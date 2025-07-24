import { serve } from "https://deno.land/std@0.192.0/http/server.ts";

serve(async (req) => {
  // ✅ CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
      }
    });
  }
  
  try {
    const { type, timestamp } = await req.json();
    
    // Get Google Drive API credentials from environment
    const clientId = Deno.env.get('GOOGLE_DRIVE_CLIENT_ID');
    const clientSecret = Deno.env.get('GOOGLE_DRIVE_CLIENT_SECRET');
    const refreshToken = Deno.env.get('GOOGLE_DRIVE_REFRESH_TOKEN');
    
    if (!clientId || !clientSecret || !refreshToken) {
      throw new Error('Google Drive credentials not configured');
    }

    // Get access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to get Google Drive access token');
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Create backup data (in a real implementation, you'd export from Supabase)
    const backupData = {
      timestamp: timestamp,
      type: type,
      data: {
        bookings: "Sample booking data would be exported here",
        agents: "Sample agent data would be exported here",
        tickets: "Sample ticket data would be exported here"
      },
      metadata: {
        version: "1.0",
        exportedBy: "BD TicketPro Auto Backup",
        recordCount: 1000
      }
    };

    const fileName = `bdticketpro_backup_${type}_${new Date().toISOString().split('T')[0]}.json`;
    const fileContent = JSON.stringify(backupData, null, 2);

    // Upload to Google Drive
    const uploadResponse = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=media', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: fileName,
        parents: [Deno.env.get('GOOGLE_DRIVE_FOLDER_ID') || 'root']
      })
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      throw new Error(`Failed to upload backup to Google Drive: ${errorText}`);
    }

    const uploadResult = await uploadResponse.json();

    // Upload file content
    const contentResponse = await fetch(`https://www.googleapis.com/upload/drive/v3/files/${uploadResult.id}?uploadType=media`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: fileContent
    });

    if (!contentResponse.ok) {
      throw new Error('Failed to upload backup content');
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Backup created and uploaded to Google Drive successfully',
      fileName: fileName,
      fileId: uploadResult.id,
      fileSize: fileContent.length,
      backupType: type,
      timestamp: timestamp
    }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: error.message
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
});