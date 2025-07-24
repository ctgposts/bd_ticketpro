import { supabase } from '../lib/supabase';

const bookingService = {
  // Create new booking
  createBooking: async (bookingData) => {
    try {
      // Set expiry time to 24 hours from now
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      const { data, error } = await supabase
        .from('bookings')
        .insert([{
          ...bookingData,
          expires_at: expiresAt.toISOString(),
          created_at: new Date().toISOString()
        }])
        .select('*')
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      // Create notification for booking expiry
      await notificationService.createBookingExpiryNotification(data.id, data.agent_id, expiresAt);

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      
      return { success: false, error: 'Failed to create booking' };
    }
  },

  // Get all bookings with filters
  getBookings: async (filters = {}) => {
    try {
      let query = supabase
        .from('bookings')
        .select(`
          *,
          ticket:tickets(*,
            airline:airlines(*)
          ),
          agent:user_profiles(full_name, email)
        `)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.agentId) {
        query = query.eq('agent_id', filters.agentId);
      }
      
      if (filters.status) {
        query = query.eq('booking_status', filters.status);
      }

      if (filters.searchTerm) {
        query = query.or(`passenger_name.ilike.%${filters.searchTerm}%,passport_number.ilike.%${filters.searchTerm}%,mobile_number.ilike.%${filters.searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      
      return { success: false, error: 'Failed to load bookings' };
    }
  },

  // Search bookings by passport or phone
  searchBookings: async (searchTerm) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          ticket:tickets(*,
            airline:airlines(*)
          ),
          agent:user_profiles(full_name, email)
        `)
        .or(`passport_number.ilike.%${searchTerm}%,mobile_number.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      
      return { success: false, error: 'Failed to search bookings' };
    }
  },

  // Update booking status
  updateBookingStatus: async (bookingId, status, paymentStatus = null) => {
    try {
      const updateData = {
        booking_status: status,
        updated_at: new Date().toISOString()
      };

      if (status === 'confirmed') {
        updateData.confirmed_at = new Date().toISOString();
      }

      if (paymentStatus) {
        updateData.payment_status = paymentStatus;
      }

      const { data, error } = await supabase
        .from('bookings')
        .update(updateData)
        .eq('id', bookingId)
        .select('*')
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      
      return { success: false, error: 'Failed to update booking status' };
    }
  },

  // Get expired bookings (for notification system)
  getExpiringBookings: async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          agent:user_profiles(full_name, email)
        `)
        .eq('booking_status', 'pending')
        .lte('expires_at', new Date().toISOString());

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      
      return { success: false, error: 'Failed to load expiring bookings' };
    }
  },

  // Get booking by reference
  getBookingByReference: async (reference) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          ticket:tickets(*,
            airline:airlines(*)
          ),
          agent:user_profiles(full_name, email)
        `)
        .eq('booking_reference', reference)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      
      return { success: false, error: 'Failed to load booking' };
    }
  }
};

// Import notification service (will be defined below)
import notificationService from './notificationService';

export default bookingService;