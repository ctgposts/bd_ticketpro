import { supabase } from '../lib/supabase';

const agentService = {
  // Get all agents
  getAgents: async (filters = {}) => {
    try {
      let query = supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.role) {
        query = query.eq('role', filters.role);
      }
      
      if (filters.isActive !== undefined) {
        query = query.eq('is_active', filters.isActive);
      }

      if (filters.searchTerm) {
        query = query.or(`full_name.ilike.%${filters.searchTerm}%,email.ilike.%${filters.searchTerm}%`);
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
      
      return { success: false, error: 'Failed to load agents' };
    }
  },

  // Get agent commission statistics
  getAgentCommissionStats: async (agentId, dateRange = null) => {
    try {
      let query = supabase
        .from('bookings')
        .select(`
          commission_amount,
          total_amount,
          booking_status,
          created_at,
          confirmed_at
        `)
        .eq('agent_id', agentId)
        .eq('booking_status', 'confirmed');

      // Apply date range filter if provided
      if (dateRange?.start && dateRange?.end) {
        query = query.gte('confirmed_at', dateRange.start)
                   .lte('confirmed_at', dateRange.end);
      }

      const { data, error } = await query;

      if (error) {
        return { success: false, error: error.message };
      }

      // Calculate statistics
      const stats = {
        totalBookings: data.length,
        totalSales: data.reduce((sum, booking) => sum + (booking.total_amount || 0), 0),
        totalCommission: data.reduce((sum, booking) => sum + (booking.commission_amount || 0), 0),
        averageBookingValue: data.length > 0 ? data.reduce((sum, booking) => sum + (booking.total_amount || 0), 0) / data.length : 0,
        bookingsByMonth: {}
      };

      // Group bookings by month
      data.forEach(booking => {
        const month = new Date(booking.confirmed_at).toISOString().slice(0, 7); // YYYY-MM format
        if (!stats.bookingsByMonth[month]) {
          stats.bookingsByMonth[month] = {
            count: 0,
            sales: 0,
            commission: 0
          };
        }
        stats.bookingsByMonth[month].count++;
        stats.bookingsByMonth[month].sales += booking.total_amount || 0;
        stats.bookingsByMonth[month].commission += booking.commission_amount || 0;
      });

      return { success: true, data: stats };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      
      return { success: false, error: 'Failed to load commission statistics' };
    }
  },

  // Update agent commission rate
  updateCommissionRate: async (agentId, newRate) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({ 
          commission_rate: newRate,
          updated_at: new Date().toISOString()
        })
        .eq('id', agentId)
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
      
      return { success: false, error: 'Failed to update commission rate' };
    }
  },

  // Get agent performance report
  getAgentPerformanceReport: async (agentId, period = 'month') => {
    try {
      const endDate = new Date();
      const startDate = new Date();

      // Set date range based on period
      switch (period) {
        case 'week':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(endDate.getMonth() - 1);
          break;
        case 'quarter':
          startDate.setMonth(endDate.getMonth() - 3);
          break;
        case 'year':
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
        default:
          startDate.setMonth(endDate.getMonth() - 1);
      }

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          ticket:tickets(
            airline:airlines(name)
          )
        `)
        .eq('agent_id', agentId)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
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
      
      return { success: false, error: 'Failed to load performance report' };
    }
  },

  // Create new agent
  createAgent: async (agentData) => {
    try {
      // First create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: agentData.email,
        password: agentData.password,
        options: {
          data: {
            full_name: agentData.full_name,
            role: agentData.role
          }
        }
      });

      if (authError) {
        return { success: false, error: authError.message };
      }

      return { success: true, data: authData };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('AuthRetryableFetchError')) {
        return { 
          success: false, 
          error: 'Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.' 
        };
      }
      
      return { success: false, error: 'Failed to create agent' };
    }
  }
};

export default agentService;