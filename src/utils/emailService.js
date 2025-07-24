import { supabase } from '../lib/supabase';

const emailService = {
  // Send invoice email using Supabase Edge Function
  sendInvoiceEmail: async (bookingData) => {
    try {
      const { data, error } = await supabase.functions.invoke('send-invoice-email', {
        body: {
          booking: bookingData,
          recipient: bookingData.passenger_email || bookingData.mobile_number + '@sms.gateway',
          template: 'booking_invoice'
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to email service. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      
      return { success: false, error: 'Failed to send invoice email' };
    }
  },

  // Send booking confirmation email
  sendConfirmationEmail: async (bookingData) => {
    try {
      const { data, error } = await supabase.functions.invoke('send-confirmation-email', {
        body: {
          booking: bookingData,
          recipient: bookingData.passenger_email || bookingData.mobile_number + '@sms.gateway',
          template: 'booking_confirmation'
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to email service. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      
      return { success: false, error: 'Failed to send confirmation email' };
    }
  },

  // Send booking expiry warning email
  sendExpiryWarningEmail: async (bookingData) => {
    try {
      const { data, error } = await supabase.functions.invoke('send-expiry-warning-email', {
        body: {
          booking: bookingData,
          recipient: bookingData.agent?.email,
          template: 'booking_expiry_warning'
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to email service. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      
      return { success: false, error: 'Failed to send expiry warning email' };
    }
  }
};

export default emailService;