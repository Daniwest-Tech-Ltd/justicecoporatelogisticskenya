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
  type: "booking_confirmation" | "booking_update" | "welcome" | "general";
  data: {
    customerName?: string;
    vehicleName?: string;
    pickupDate?: string;
    returnDate?: string;
    status?: string;
    message?: string;
  };
}

const getEmailTemplate = (type: string, data: NotificationRequest["data"]): string => {
  const baseStyles = `
    body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #D4A853 0%, #B8962D 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .header h1 { color: white; margin: 0; font-size: 24px; }
    .content { background: #fff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; }
    .footer { background: #1a1a1a; color: #888; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
    .button { display: inline-block; background: linear-gradient(135deg, #D4A853 0%, #B8962D 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; }
    .highlight { background: #f8f4eb; padding: 15px; border-radius: 6px; margin: 15px 0; }
  `;

  switch (type) {
    case "booking_confirmation":
      return `
        <!DOCTYPE html>
        <html>
        <head><style>${baseStyles}</style></head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚗 Booking Confirmed!</h1>
            </div>
            <div class="content">
              <p>Dear ${data.customerName || "Customer"},</p>
              <p>Thank you for choosing Justice Corporate Logistics Kenya! Your rental booking has been received and is being processed.</p>
              <div class="highlight">
                <p><strong>Vehicle:</strong> ${data.vehicleName || "N/A"}</p>
                <p><strong>Pickup Date:</strong> ${data.pickupDate || "N/A"}</p>
                <p><strong>Return Date:</strong> ${data.returnDate || "N/A"}</p>
              </div>
              <p>Our team will contact you shortly to confirm your booking and arrange vehicle pickup.</p>
              <p>If you have any questions, please don't hesitate to contact us at 0702575512.</p>
            </div>
            <div class="footer">
              <p>Justice Corporate Logistics Kenya</p>
              <p>Mpesi Lane 11, Westlands, Nairobi</p>
              <p>© 2026 All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `;
    
    case "booking_update":
      return `
        <!DOCTYPE html>
        <html>
        <head><style>${baseStyles}</style></head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📋 Booking Update</h1>
            </div>
            <div class="content">
              <p>Dear ${data.customerName || "Customer"},</p>
              <p>Your booking status has been updated.</p>
              <div class="highlight">
                <p><strong>Vehicle:</strong> ${data.vehicleName || "N/A"}</p>
                <p><strong>New Status:</strong> ${data.status || "N/A"}</p>
              </div>
              <p>${data.message || ""}</p>
              <p>If you have any questions, please contact us at 0702575512.</p>
            </div>
            <div class="footer">
              <p>Justice Corporate Logistics Kenya</p>
              <p>© 2026 All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `;

    case "welcome":
      return `
        <!DOCTYPE html>
        <html>
        <head><style>${baseStyles}</style></head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to Justice Corporate Logistics!</h1>
            </div>
            <div class="content">
              <p>Dear ${data.customerName || "Customer"},</p>
              <p>Welcome to Justice Corporate Logistics Kenya! We're thrilled to have you join our family.</p>
              <p>With our NTSA compliant fleet of fully insured vehicles, you can enjoy premium car rental services for all your needs:</p>
              <ul>
                <li>Self Drive Rentals</li>
                <li>Chauffeur Driven Services</li>
                <li>Corporate Rentals</li>
                <li>Event Transportation</li>
                <li>Long-Term Leasing</li>
              </ul>
              <p>Browse our catalogue and book your dream ride today!</p>
            </div>
            <div class="footer">
              <p>Justice Corporate Logistics Kenya</p>
              <p>© 2026 All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `;

    default:
      return `
        <!DOCTYPE html>
        <html>
        <head><style>${baseStyles}</style></head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Justice Corporate Logistics Kenya</h1>
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

    console.log("Email sent successfully:", emailResponse);

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
