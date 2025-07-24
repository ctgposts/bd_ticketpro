import { supabase } from '../lib/supabase';

const backupService = {
  // Trigger automatic backup to Google Drive
  createBackup: async (backupType = 'daily') => {
    try {
      const { data, error } = await supabase.functions.invoke('google-drive-backup', {
        body: {
          type: backupType,
          timestamp: new Date().toISOString()
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // Log backup attempt
      await backupService.logBackup({
        backup_type: backupType,
        file_name: data?.fileName || `backup_${Date.now()}`,
        drive_file_id: data?.fileId,
        status: data?.success ? 'completed' : 'failed',
        error_message: data?.error || null
      });

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to backup service. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      
      // Log failed backup
      await backupService.logBackup({
        backup_type: backupType,
        file_name: `failed_backup_${Date.now()}`,
        status: 'failed',
        error_message: error.message
      });

      return { success: false, error: 'Failed to create backup' };
    }
  },

  // Log backup attempt to database
  logBackup: async (backupData) => {
    try {
      const { data, error } = await supabase
        .from('backup_logs')
        .insert([{
          ...backupData,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.log('Failed to log backup:', error.message);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.log('Backup logging error:', error);
      return { success: false, error: 'Failed to log backup' };
    }
  },

  // Get backup history
  getBackupHistory: async () => {
    try {
      const { data, error } = await supabase
        .from('backup_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

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
      
      return { success: false, error: 'Failed to load backup history' };
    }
  },

  // Schedule automatic daily backup
  scheduleAutomaticBackup: async () => {
    try {
      // This would typically be handled by a cron job or scheduled function
      // For demonstration, we'll create a backup immediately
      return await backupService.createBackup('scheduled');
    } catch (error) {
      return { success: false, error: 'Failed to schedule backup' };
    }
  }
};

export default backupService;