-- BD TicketPro Travel Booking System Migration
-- Authentication & User Management Module

-- Enable required extensions (most are pre-installed in Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create custom types
CREATE TYPE public.user_role AS ENUM ('admin', 'manager', 'staff');
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'expired');
CREATE TYPE public.payment_status AS ENUM ('pending', 'partial', 'full', 'refunded');
CREATE TYPE public.notification_type AS ENUM ('booking_expiry', 'commission_update', 'booking_confirmation');
CREATE TYPE public.ticket_class AS ENUM ('economy', 'business', 'first');

-- 2. Create user_profiles table (intermediary for auth)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT,
    role public.user_role DEFAULT 'staff'::public.user_role,
    commission_rate DECIMAL(5,2) DEFAULT 5.0,
    total_commission DECIMAL(12,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create airlines table
CREATE TABLE public.airlines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    code TEXT NOT NULL UNIQUE,
    logo_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create tickets table
CREATE TABLE public.tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    airline_id UUID REFERENCES public.airlines(id) ON DELETE CASCADE,
    flight_number TEXT NOT NULL,
    departure_city TEXT NOT NULL,
    arrival_city TEXT NOT NULL,
    departure_date TIMESTAMPTZ NOT NULL,
    arrival_date TIMESTAMPTZ NOT NULL,
    ticket_class public.ticket_class DEFAULT 'economy'::public.ticket_class,
    purchase_price DECIMAL(10,2) NOT NULL,
    selling_price DECIMAL(10,2) NOT NULL,
    available_seats INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create bookings table
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_reference TEXT NOT NULL UNIQUE,
    ticket_id UUID REFERENCES public.tickets(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    passenger_name TEXT NOT NULL,
    passport_number TEXT NOT NULL,
    mobile_number TEXT NOT NULL,
    pax_count INTEGER DEFAULT 1,
    total_amount DECIMAL(12,2) NOT NULL,
    commission_amount DECIMAL(12,2) DEFAULT 0,
    booking_status public.booking_status DEFAULT 'pending'::public.booking_status,
    payment_status public.payment_status DEFAULT 'pending'::public.payment_status,
    expires_at TIMESTAMPTZ NOT NULL,
    confirmed_at TIMESTAMPTZ,
    comments TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. Create notifications table
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    type public.notification_type NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    scheduled_for TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. Create backup_logs table for Google Drive backups
CREATE TABLE public.backup_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    backup_type TEXT NOT NULL,
    file_name TEXT NOT NULL,
    drive_file_id TEXT,
    status TEXT DEFAULT 'pending',
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 8. Create essential indexes
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_tickets_departure_date ON public.tickets(departure_date);
CREATE INDEX idx_tickets_airline_id ON public.tickets(airline_id);
CREATE INDEX idx_bookings_agent_id ON public.bookings(agent_id);
CREATE INDEX idx_bookings_ticket_id ON public.bookings(ticket_id);
CREATE INDEX idx_bookings_passport ON public.bookings(passport_number);
CREATE INDEX idx_bookings_mobile ON public.bookings(mobile_number);
CREATE INDEX idx_bookings_status ON public.bookings(booking_status);
CREATE INDEX idx_bookings_expires_at ON public.bookings(expires_at);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_scheduled_for ON public.notifications(scheduled_for);

-- 9. Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.airlines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backup_logs ENABLE ROW LEVEL SECURITY;

-- 10. Create helper functions for RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'::public.user_role
)
$$;

CREATE OR REPLACE FUNCTION public.is_manager_or_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role IN ('admin'::public.user_role, 'manager'::public.user_role)
)
$$;

CREATE OR REPLACE FUNCTION public.can_access_booking(booking_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.bookings b
    WHERE b.id = booking_uuid AND (
        b.agent_id = auth.uid() OR
        public.is_manager_or_admin()
    )
)
$$;

-- 11. Create RLS policies
CREATE POLICY "users_own_profile"
ON public.user_profiles
FOR ALL
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "all_can_read_airlines"
ON public.airlines
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "admin_manage_airlines"
ON public.airlines
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "all_can_read_tickets"
ON public.tickets
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "admin_manage_tickets"
ON public.tickets
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "agent_access_bookings"
ON public.bookings
FOR ALL
TO authenticated
USING (public.can_access_booking(id))
WITH CHECK (public.can_access_booking(id));

CREATE POLICY "user_own_notifications"
ON public.notifications
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "admin_manage_backups"
ON public.backup_logs
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 12. Create triggers for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name, role)
    VALUES (
        NEW.id, 
        NEW.email, 
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'staff'::public.user_role)
    );
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 13. Create function to generate booking reference
CREATE OR REPLACE FUNCTION public.generate_booking_reference()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    prefix TEXT := 'BDT';
    timestamp_part TEXT;
    random_part TEXT;
    final_reference TEXT;
BEGIN
    timestamp_part := TO_CHAR(CURRENT_TIMESTAMP, 'YYMMDD');
    random_part := UPPER(SUBSTR(MD5(RANDOM()::TEXT), 1, 4));
    final_reference := prefix || timestamp_part || random_part;
    
    -- Ensure uniqueness
    WHILE EXISTS (SELECT 1 FROM public.bookings WHERE booking_reference = final_reference) LOOP
        random_part := UPPER(SUBSTR(MD5(RANDOM()::TEXT), 1, 4));
        final_reference := prefix || timestamp_part || random_part;
    END LOOP;
    
    RETURN final_reference;
END;
$$;

-- 14. Create function to calculate commission
CREATE OR REPLACE FUNCTION public.calculate_commission(agent_uuid UUID, booking_amount DECIMAL)
RETURNS DECIMAL
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    commission_rate DECIMAL;
    commission_amount DECIMAL;
BEGIN
    SELECT up.commission_rate INTO commission_rate
    FROM public.user_profiles up
    WHERE up.id = agent_uuid;
    
    IF commission_rate IS NULL THEN
        commission_rate := 5.0; -- Default 5%
    END IF;
    
    commission_amount := booking_amount * (commission_rate / 100);
    RETURN commission_amount;
END;
$$;

-- 15. Create trigger to update commission on booking confirmation
CREATE OR REPLACE FUNCTION public.update_agent_commission()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Only update commission when booking is confirmed
    IF NEW.booking_status = 'confirmed'::public.booking_status AND 
       OLD.booking_status != 'confirmed'::public.booking_status THEN
        
        -- Calculate commission
        NEW.commission_amount := public.calculate_commission(NEW.agent_id, NEW.total_amount);
        
        -- Update agent's total commission
        UPDATE public.user_profiles
        SET total_commission = total_commission + NEW.commission_amount,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = NEW.agent_id;
    END IF;
    
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_booking_status_change
    BEFORE UPDATE ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_agent_commission();

-- 16. Create sample data
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    manager_uuid UUID := gen_random_uuid();
    staff_uuid UUID := gen_random_uuid();
    airline1_uuid UUID := gen_random_uuid();
    airline2_uuid UUID := gen_random_uuid();
    ticket1_uuid UUID := gen_random_uuid();
    ticket2_uuid UUID := gen_random_uuid();
BEGIN
    -- Create auth users
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@bdticketpro.com', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Ahmed Rahman", "role": "admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (manager_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'manager@bdticketpro.com', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Fatima Khan", "role": "manager"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (staff_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'staff@bdticketpro.com', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Rashid Hassan", "role": "staff"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Create airlines
    INSERT INTO public.airlines (id, name, code, logo_url) VALUES
        (airline1_uuid, 'Biman Bangladesh Airlines', 'BG', '/assets/images/airlines/biman.png'),
        (airline2_uuid, 'US-Bangla Airlines', 'BS', '/assets/images/airlines/us-bangla.png');

    -- Create tickets
    INSERT INTO public.tickets (id, airline_id, flight_number, departure_city, arrival_city, departure_date, arrival_date, purchase_price, selling_price, available_seats) VALUES
        (ticket1_uuid, airline1_uuid, 'BG147', 'Dhaka', 'Dubai', '2025-08-15 14:30:00+06', '2025-08-15 18:45:00+04', 45000, 52000, 150),
        (ticket2_uuid, airline2_uuid, 'BS325', 'Dhaka', 'Bangkok', '2025-08-20 09:15:00+06', '2025-08-20 12:30:00+07', 38000, 44000, 180);

    -- Create sample bookings
    INSERT INTO public.bookings (
        booking_reference, ticket_id, agent_id, passenger_name, passport_number, 
        mobile_number, pax_count, total_amount, booking_status, payment_status, expires_at
    ) VALUES
        (public.generate_booking_reference(), ticket1_uuid, staff_uuid, 'Mohammad Ali Khan', 'BP1234567', '+8801712345678', 1, 52000, 'confirmed'::public.booking_status, 'full'::public.payment_status, CURRENT_TIMESTAMP + INTERVAL '24 hours'),
        (public.generate_booking_reference(), ticket2_uuid, staff_uuid, 'Rashida Begum', 'BP7654321', '+8801987654321', 2, 88000, 'pending'::public.booking_status, 'pending'::public.payment_status, CURRENT_TIMESTAMP + INTERVAL '24 hours');

END $$;