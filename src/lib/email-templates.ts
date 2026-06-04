import { formatPrice } from "./shop-utils";

/**
 * Generates a Corporate Welcome Email
 */
export function getWelcomeEmailHtml(name: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f7; color: #333; margin: 0; padding: 0; }
        .container { width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .header { background-color: #18181b; padding: 30px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px; }
        .content { padding: 40px 30px; }
        .greeting { font-size: 20px; font-weight: bold; margin-bottom: 20px; }
        .text { line-height: 1.6; color: #555; margin-bottom: 20px; }
        .cta-button { display: inline-block; background-color: #4f46e5; color: #ffffff; text-decoration: none; padding: 12px 25px; border-radius: 5px; font-weight: bold; margin-top: 10px; }
        .features { background-color: #f9fafb; padding: 20px; border-radius: 5px; margin: 25px 0; }
        .feature-item { margin-bottom: 10px; display: flex; align-items: center; }
        .footer { background-color: #f4f4f7; padding: 20px; text-align: center; font-size: 12px; color: #888; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>MAJESTIC INC.</h1>
        </div>
        <div class="content">
          <div class="greeting">Welcome aboard, ${name}!</div>
          <p class="text">
            We are thrilled to formally welcome you to Majestic Inc. Your account has been successfully created, giving you full access to our premium e-commerce platform.
          </p>
          <p class="text">
            At Majestic, we are committed to providing you with top-tier tech, fashion, and lifestyle products. Here is what you can do next:
          </p>
          
          <div class="features">
            <div class="feature-item">✅ <strong>Personalized Dashboard:</strong> Track orders and manage preferences.</div>
            <div class="feature-item">✅ <strong>Exclusive Access:</strong> Get early notifications on flash sales.</div>
            <div class="feature-item">✅ <strong>24/7 Support:</strong> Our team is always here to help.</div>
          </div>

          <center>
            <a href="${process.env.NEXTAUTH_URL}/profile" class="cta-button">Access Your Account</a>
          </center>

          <p class="text" style="margin-top: 30px;">
            If you have any questions, simply reply to this email or contact our support team directly.
          </p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Majestic Inc. All rights reserved.</p>
          <p>123 Commerce St, Tech City, USA</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generates a Detailed Order Confirmation Email
 */
export function getOrderConfirmationEmailHtml(order: any) {
  const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  // Generate Items Rows
  const itemsHtml = order.items.map((item: any) => `
    <tr style="border-bottom: 1px solid #eee;">
      <td style="padding: 15px 0;">
        <div style="font-weight: bold;">${item.product.name}</div>
        <div style="font-size: 12px; color: #888;">Qty: ${item.quantity}</div>
      </td>
      <td style="text-align: right; padding: 15px 0;">
        ${formatPrice(item.price * item.quantity)}
      </td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f7; color: #333; margin: 0; padding: 0; }
        .container { width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .header { background-color: #4f46e5; padding: 30px; text-align: center; color: white; }
        .order-id { font-size: 14px; opacity: 0.9; margin-top: 5px; text-transform: uppercase; letter-spacing: 1px;}
        .content { padding: 40px 30px; }
        .summary-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .total-row { border-top: 2px solid #333; font-weight: bold; font-size: 18px; }
        .shipping-info { background-color: #f9fafb; padding: 20px; border-radius: 5px; margin-top: 20px; font-size: 14px; }
        .footer { background-color: #f4f4f7; padding: 20px; text-align: center; font-size: 12px; color: #888; }
        .btn { display: inline-block; background-color: #18181b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px; font-size: 14px;}
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin:0;">Order Confirmed</h1>
          <div class="order-id">Order #${order.id.slice(0, 8)}</div>
        </div>
        <div class="content">
          <p>Hi <strong>${order.fullName || 'Valued Customer'}</strong>,</p>
          <p>Thank you for your purchase! We have received your order and are getting it ready for shipment. We will notify you once it's on its way.</p>

          <h3>Order Summary</h3>
          <table class="summary-table">
            ${itemsHtml}
            <tr>
              <td style="padding-top: 15px;">Subtotal</td>
              <td style="text-align: right; padding-top: 15px;">${formatPrice(order.totalAmount)}</td>
            </tr>
            <tr>
              <td style="padding-bottom: 15px;">Shipping</td>
              <td style="text-align: right; padding-bottom: 15px;">Free</td>
            </tr>
            <tr class="total-row">
              <td style="padding: 15px 0;">Total</td>
              <td style="text-align: right; padding: 15px 0;">${formatPrice(order.totalAmount)}</td>
            </tr>
          </table>

          <div class="shipping-info">
            <strong>Shipping Destination:</strong><br/>
            ${order.address}<br/>
            ${order.city}, ${order.postalCode}<br/>
            ${order.country}<br/><br/>
            <strong>Estimated Delivery:</strong> 3-5 Business Days
          </div>

          <center>
            <a href="${process.env.NEXTAUTH_URL}/tracking" class="btn">Track Your Order</a>
          </center>
        </div>
        <div class="footer">
          <p>Need help? Contact support@majestic.com</p>
          <p>&copy; ${new Date().getFullYear()} Majestic Inc.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}