import { supabase } from '../lib/supabase';

const notificationService = {
  // Create booking expiry notification
  createBookingExpiryNotification: async (bookingId, agentId, expiryDate) => {
    try {
      // Schedule notification 2 hours before expiry
      const notificationTime = new Date(expiryDate);
      notificationTime.setHours(notificationTime.getHours() - 2);

      const { data, error } = await supabase
        .from('notifications')
        .insert([{
          user_id: agentId,
          booking_id: bookingId,
          type: 'booking_expiry',
          title: 'Booking Expiry Warning',
          message: 'A booking is about to expire in 2 hours. Please confirm or it will be automatically cancelled.',
          scheduled_for: notificationTime.toISOString(),
          created_at: new Date().toISOString()
        }])
        .select()
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
      
      return { success: false, error: 'Failed to create notification' };
    }
  },

  // Get user notifications
  getUserNotifications: async (userId, includeRead = false) => {
    try {
      let query = supabase
        .from('notifications')
        .select(`
          *,
          booking:bookings(booking_reference, passenger_name)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!includeRead) {
        query = query.eq('is_read', false);
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
      
      return { success: false, error: 'Failed to load notifications' };
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ 
          is_read: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', notificationId)
        .select()
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
      
      return { success: false, error: 'Failed to update notification' };
    }
  },

  // Process pending notifications (for scheduled sending)
  processPendingNotifications: async () => {
    try {
      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .lte('scheduled_for', now)
        .is('sent_at', null);

      if (error) {
        return { success: false, error: error.message };
      }

      // Process each notification
      for (const notification of data) {
        // Here you would typically send the actual notification
        // For now, we'll just mark it as sent
        await supabase
          .from('notifications')
          .update({ sent_at: new Date().toISOString() })
          .eq('id', notification.id);
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
      
      return { success: false, error: 'Failed to process notifications' };
    }
  },

  // Create commission update notification
  createCommissionNotification: async (agentId, amount, bookingReference) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert([{
          user_id: agentId,
          type: 'commission_update',
          title: 'Commission Earned',
          message: `You earned ৳${amount.toFixed(2)} commission from booking ${bookingReference}`,
          created_at: new Date().toISOString()
        }])
        .select()
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
      
      return { success: false, error: 'Failed to create commission notification' };
    }
  }
};

export default notificationService;