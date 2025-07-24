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
    const { booking, recipient, template } = await req.json();
    
    // Email content for booking invoice
    const emailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>BD TicketPro - Booking Invoice</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .booking-details { background: #f8fafc; border-radius: 8px; padding: 15px; margin: 15px 0; }
          .detail-row { display: flex; justify-content: space-between; margin: 8px 0; }
          .total { background: #2563eb; color: white; padding: 10px; border-radius: 4px; text-align: center; margin-top: 15px; }
          .footer { background: #f1f5f9; padding: 15px; text-align: center; color: #64748b; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>BD TicketPro</h1>
            <h2>Booking Invoice</h2>
          </div>
          
          <div class="content">
            <div class="booking-details">
              <h3>Booking Details</h3>
              <div class="detail-row">
                <span><strong>Booking Reference:</strong></span>
                <span>${booking.booking_reference}</span>
              </div>
              <div class="detail-row">
                <span><strong>Passenger Name:</strong></span>
                <span>${booking.passenger_name}</span>
              </div>
              <div class="detail-row">
                <span><strong>Flight:</strong></span>
                <span>${booking.ticket?.airline?.name || 'N/A'} - ${booking.ticket?.flight_number || 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span><strong>Route:</strong></span>
                <span>${booking.ticket?.departure_city || 'N/A'} → ${booking.ticket?.arrival_city || 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span><strong>Departure:</strong></span>
                <span>${new Date(booking.ticket?.departure_date || Date.now()).toLocaleString()}</span>
              </div>
              <div class="detail-row">
                <span><strong>Passengers:</strong></span>
                <span>${booking.pax_count} passenger(s)</span>
              </div>
              <div class="detail-row">
                <span><strong>Booking Date:</strong></span>
                <span>${new Date(booking.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div class="total">
              <h3>Total Amount: ৳${booking.total_amount?.toLocaleString() || '0'}</h3>
              <p>Payment Status: ${booking.payment_status?.toUpperCase() || 'PENDING'}</p>
            </div>
            
            <p style="margin-top: 20px;">
              Thank you for choosing BD TicketPro for your travel needs. 
              Please keep this invoice for your records.
            </p>
            
            <p style="color: #dc2626; font-weight: bold;">
              Important: Please confirm your booking within 24 hours or it will be automatically cancelled.
            </p>
          </div>
          
          <div class="footer">
            <p>BD TicketPro - Your Trusted Travel Partner</p>
            <p>Contact: support@bdticketpro.com | Phone: +880 1700-000000</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email using Resend API
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    if (!resendApiKey) {
      throw new Error('Resend API key not configured');
    }

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: [recipient],
        subject: `BD TicketPro - Invoice for Booking ${booking.booking_reference}`,
        html: emailContent,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      throw new Error(`Failed to send email: ${errorText}`);
    }

    const emailResult = await emailResponse.json();

    return new Response(JSON.stringify({
      success: true,
      message: 'Invoice email sent successfully',
      emailId: emailResult.id,
      bookingReference: booking.booking_reference
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