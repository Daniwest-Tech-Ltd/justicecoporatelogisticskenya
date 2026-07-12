import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  to: string;
  subject: string;
  type: "booking_confirmation" | "booking_update" | "welcome" | "driver_assignment" | "general";
  data: {
    customerName?: string;
    vehicleName?: string;
    pickupDate?: string;
    returnDate?: string;
    status?: string;
    message?: string;
    // Driver specific fields
    driverName?: string;
    fleetNumber?: string;
    workType?: string;
    description?: string;
    location?: string;
    duration?: string;
    amount?: number | string;
  };
}

const getEmailTemplate = (type: string, data: NotificationRequest["data"]): string => {
  const baseStyles = `
    body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0; border-bottom: 3px solid #ff0000; }
    .header h1 { color: white; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px; }
    .content { background: #fff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; }
    .footer { background: #1a1a1a; color: #888; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
    .button { display: inline-block; background: #ff0000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; text-transform: uppercase; }
    .highlight { background: #fdf2f2; padding: 20px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #ff0000; }
    .label { font-size: 10px; font-weight: bold; color: #999; text-transform: uppercase; display: block; margin-bottom: 2px; }
    .value { font-size: 14px; font-weight: bold; color: #111; margin-bottom: 10px; display: block; }
  `;

  switch (type) {
    case "driver_assignment":
      return `
        <!DOCTYPE html>
        <html>
        <head><style>${baseStyles}</style></head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Mission Dispatch Notice</h1>
            </div>
            <div class="content">
              <p>Dear <strong>${data.driverName || "Personnel"}</strong>,</p>
              <p>You have been assigned a new logistical task by Justice Corporate Logistics. Please review the operational parameters below:</p>

              <div class="highlight">
                <span class="label">Fleet Unit / Identifier</span>
                <span class="value">${data.fleetNumber || "N/A"}</span>

                <span class="label">Mission Classification</span>
                <span class="value">${data.workType || "N/A"}</span>

                <span class="label">Operational Target (Location)</span>
                <span class="value">${data.location || "N/A"}</span>

                <span class="label">Temporal Allocation (Duration)</span>
                <span class="value">${data.duration || "N/A"}</span>

                <span class="label">Financial Valuation (Amount)</span>
                <span class="value">KSh ${data.amount || "0"}</span>
              </div>

              <div style="margin-top: 20px; padding: 15px; background: #f5f5f5; border-radius: 4px;">
                <span class="label">Mission Scope & Instructions</span>
                <p style="font-size: 13px; color: #555;">${data.description || "Refer to standard operating protocols."}</p>
              </div>

              <p style="margin-top: 30px; font-size: 12px; color: #666;">
                <strong>NOTICE:</strong> Please ensure a full technical inspection of the asset is completed before departure. Any logistical constraints must be reported to the command center immediately.
              </p>

              <div style="text-align: center; margin-top: 30px;">
                <a href="#" class="button">Acknowledge Mission</a>
              </div>
            </div>
            <div class="footer">
              <p><strong>Justice Corporate Logistics Kenya</strong></p>
              <p>Institutional Dispatch Terminal // Secure Transmission</p>
              <p>© 2026 JCK. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `;

    case "booking_confirmation":
      return `
        <!DOCTYPE html>
        <html>
        <head><style>${baseStyles}</style></head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="border-bottom: none;">Booking Confirmed</h1>
            </div>
            <div class="content">
              <p>Dear ${data.customerName || "Customer"},</p>
              <p>Thank you for choosing Justice Corporate Logistics Kenya! Your rental booking has been received and is being processed.</p>
              <div class="highlight" style="background: #f8f4eb; border-left-color: #D4A853;">
                <p><strong>Vehicle:</strong> ${data.vehicleName || "N/A"}</p>
                <p><strong>Pickup Date:</strong> ${data.pickupDate || "N/A"}</p>
                <p><strong>Return Date:</strong> ${data.returnDate || "N/A"}</p>
              </div>
              <p>Our team will contact you shortly to confirm your booking and arrange vehicle pickup.</p>
              <p>If you have any questions, please don't hesitate to contact us at 0702575512.</p>
            </div>
            <div class="footer">
              <p>Justice Corporate Logistics Kenya</p>
              <p>Muthithi Road, Westlands, Nairobi</p>
              <p>© 2026 All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `;

    // ... (rest of templates)
    default:
      return `
        <!DOCTYPE html>
        <html>
        <head><style>${baseStyles}</style></head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Justice Corporate Logistics</h1>
            </div>
            <div class="content">
              <p>${data.message || "Thank you for using our services."}</p>
            </div>
            <div class="footer">
              <p>© 2026 Justice Corporate Logistics Kenya. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `;
  }
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, type, data }: NotificationRequest = await req.json();

    const html = getEmailTemplate(type, data);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Justice Logistics <onboarding@resend.dev>",
        to: [to],
        subject: subject,
        html: html,
      }),
    });

    const emailResponse = await res.json();

    if (!res.ok) {
      throw new Error(emailResponse.message || "Failed to send email");
    }

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending notification:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
