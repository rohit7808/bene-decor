export interface EmailOrderItem {
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface EmailOrderDetails {
  orderNumber: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string | Date;
  items: EmailOrderItem[];
  shippingAddress: {
    fullName?: string;
    phone?: string;
    email?: string;
    address?: string;
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    pinCode?: string;
    country?: string;
  };
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
}

const BRAND_COLOR = "#A67C52";

/**
 * 1. Order Confirmation Email HTML Template
 */
export function generateOrderConfirmationEmail(order: EmailOrderDetails): string {
  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-IN");

  const customerName =
    order.customerName || order.shippingAddress?.fullName || "Valued Customer";
  const streetAddress =
    order.shippingAddress?.address ||
    order.shippingAddress?.street ||
    "Delivery Address N/A";
  const city = order.shippingAddress?.city || "N/A";
  const state = order.shippingAddress?.state || "N/A";
  const pinCode =
    order.shippingAddress?.postalCode ||
    order.shippingAddress?.pinCode ||
    "N/A";
  const phone =
    order.shippingAddress?.phone || order.customerPhone || "N/A";
  const country = order.shippingAddress?.country || "India";
  const orderNumber = order.orderNumber || "BD-ORDER";
  const paymentMethod = order.paymentMethod || "N/A";
  const paymentStatus = order.paymentStatus || "Pending";
  const totalAmountFormatted = (order.totalAmount || 0).toLocaleString("en-IN");

  const itemsRows = (order.items || [])
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eeeeee; font-family: sans-serif; font-size: 14px; color: #1f1f1f;">
          <strong>${item.name || "Handcrafted Furniture Item"}</strong>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #eeeeee; font-family: sans-serif; font-size: 14px; color: #666666; text-align: center;">
          ${item.quantity || 1}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #eeeeee; font-family: sans-serif; font-size: 14px; color: #666666; text-align: right;">
          ₹${(item.price || 0).toLocaleString("en-IN")}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #eeeeee; font-family: sans-serif; font-size: 14px; color: #1f1f1f; font-weight: bold; text-align: right;">
          ₹${((item.price || 0) * (item.quantity || 1)).toLocaleString("en-IN")}
        </td>
      </tr>
    `
    )
    .join("");

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Order Confirmation - BenéDecor</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #faf8f5; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #faf8f5; padding: 40px 20px;">
      <tr>
        <td align="center">
          <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 16px; border: 1px solid #e5e5e5; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            <!-- Header -->
            <tr>
              <td style="background-color: #ffffff; padding: 30px; text-align: center; border-bottom: 2px solid ${BRAND_COLOR};">
                <h1 style="margin: 0; font-family: Georgia, serif; font-size: 28px; color: #1f1f1f; letter-spacing: 2px;">BENÉ DECOR</h1>
                <p style="margin: 5px 0 0 0; font-size: 12px; color: ${BRAND_COLOR}; text-transform: uppercase; letter-spacing: 3px; font-weight: bold;">
                  Handcrafted Solid Wood Furniture
                </p>
              </td>
            </tr>

            <!-- Hero Banner -->
            <tr>
              <td style="padding: 30px; text-align: center; background-color: #faf8f5;">
                <div style="width: 50px; height: 50px; border-radius: 50%; background-color: #e6f4ea; color: #16a34a; font-size: 24px; line-height: 50px; margin: 0 auto 15px auto; font-weight: bold;">✓</div>
                <h2 style="margin: 0 0 10px 0; font-family: Georgia, serif; font-size: 22px; color: #1f1f1f;">Order Confirmed!</h2>
                <p style="margin: 0; font-size: 14px; color: #666666; line-height: 1.5;">
                  Thank you for choosing BenéDecor, <strong>${customerName}</strong>. Your furniture order has been received and is being processed by our master artisans.
                </p>
              </td>
            </tr>

            <!-- Order Meta -->
            <tr>
              <td style="padding: 25px 30px; border-bottom: 1px solid #eeeeee;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="font-size: 13px; color: #666666;">
                      Order Number: <strong style="color: #1f1f1f; font-size: 15px;">#${orderNumber}</strong><br>
                      Order Date: <strong style="color: #1f1f1f;">${formattedDate}</strong>
                    </td>
                    <td align="right" style="font-size: 13px; color: #666666;">
                      Payment Method: <strong style="color: #1f1f1f;">${paymentMethod}</strong><br>
                      Payment Status: <strong style="color: #16a34a;">${paymentStatus}</strong>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Items Table -->
            <tr>
              <td style="padding: 20px 30px;">
                <h3 style="margin: 0 0 15px 0; font-family: Georgia, serif; font-size: 16px; color: #1f1f1f;">Order Summary</h3>
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                  <thead>
                    <tr style="background-color: #faf8f5;">
                      <th align="left" style="padding: 10px; font-size: 11px; text-transform: uppercase; color: #666666; border-bottom: 1px solid #e5e5e5;">Item</th>
                      <th align="center" style="padding: 10px; font-size: 11px; text-transform: uppercase; color: #666666; border-bottom: 1px solid #e5e5e5;">Qty</th>
                      <th align="right" style="padding: 10px; font-size: 11px; text-transform: uppercase; color: #666666; border-bottom: 1px solid #e5e5e5;">Price</th>
                      <th align="right" style="padding: 10px; font-size: 11px; text-transform: uppercase; color: #666666; border-bottom: 1px solid #e5e5e5;">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsRows}
                  </tbody>
                </table>
              </td>
            </tr>

            <!-- Totals & Shipping -->
            <tr>
              <td style="padding: 20px 30px; background-color: #faf8f5;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td width="50%" valign="top" style="padding-right: 20px;">
                      <h4 style="margin: 0 0 8px 0; font-size: 13px; color: ${BRAND_COLOR}; text-transform: uppercase;">Shipping Address</h4>
                      <p style="margin: 0; font-size: 13px; color: #666666; line-height: 1.5;">
                        <strong>${customerName}</strong><br>
                        ${streetAddress}<br>
                        ${city}, ${state} - ${pinCode}<br>
                        ${country}<br>
                        Phone: <strong>${phone}</strong>
                      </p>
                    </td>
                    <td width="50%" valign="top">
                      <table width="100%" border="0" cellspacing="0" cellpadding="4" style="font-size: 13px; color: #666666;">
                        <tr>
                          <td>Subtotal:</td>
                          <td align="right" style="color: #1f1f1f; font-weight: bold;">₹${totalAmountFormatted}</td>
                        </tr>
                        <tr>
                          <td>Home Delivery:</td>
                          <td align="right" style="color: #16a34a; font-weight: bold;">FREE</td>
                        </tr>
                        <tr>
                          <td style="padding-top: 10px; border-top: 1px solid #e5e5e5; font-size: 15px; font-weight: bold; color: #1f1f1f;">Total Amount:</td>
                          <td align="right" style="padding-top: 10px; border-top: 1px solid #e5e5e5; font-size: 18px; font-weight: bold; color: #1f1f1f;">₹${totalAmountFormatted}</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding: 25px; text-align: center; font-size: 12px; color: #888888; border-top: 1px solid #eeeeee;">
                <p style="margin: 0 0 5px 0;">Need assistance? Contact BenéDecor Concierge at support@benedecor.in</p>
                <p style="margin: 0;">© ${new Date().getFullYear()} BenéDecor Handcrafted Furniture. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

/**
 * 2. Payment Success Email HTML Template
 */
export function generatePaymentSuccessEmail(order: EmailOrderDetails): string {
  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

  const customerName =
    order.customerName || order.shippingAddress?.fullName || "Valued Customer";
  const orderNumber = order.orderNumber || "BD-ORDER";
  const totalAmountFormatted = (order.totalAmount || 0).toLocaleString("en-IN");
  const paymentMethod = order.paymentMethod || "Razorpay";
  const razorpayPaymentId = order.razorpayPaymentId || "N/A";
  const razorpayOrderId = order.razorpayOrderId || "N/A";

  const streetAddress =
    order.shippingAddress?.address ||
    order.shippingAddress?.street ||
    "Delivery Address N/A";
  const city = order.shippingAddress?.city || "N/A";
  const state = order.shippingAddress?.state || "N/A";
  const pinCode =
    order.shippingAddress?.postalCode ||
    order.shippingAddress?.pinCode ||
    "N/A";
  const phone =
    order.shippingAddress?.phone || order.customerPhone || "N/A";
  const country = order.shippingAddress?.country || "India";

  const itemsRows = (order.items || [])
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eeeeee; font-family: sans-serif; font-size: 14px; color: #1f1f1f;">
          <strong>${item.name || "Handcrafted Furniture Item"}</strong>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #eeeeee; font-family: sans-serif; font-size: 14px; color: #666666; text-align: center;">
          ${item.quantity || 1}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #eeeeee; font-family: sans-serif; font-size: 14px; color: #666666; text-align: right;">
          ₹${(item.price || 0).toLocaleString("en-IN")}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #eeeeee; font-family: sans-serif; font-size: 14px; color: #1f1f1f; font-weight: bold; text-align: right;">
          ₹${((item.price || 0) * (item.quantity || 1)).toLocaleString("en-IN")}
        </td>
      </tr>
    `
    )
    .join("");

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Payment Successful - BenéDecor</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #faf8f5; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #faf8f5; padding: 40px 20px;">
      <tr>
        <td align="center">
          <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 16px; border: 1px solid #e5e5e5; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            <!-- Header -->
            <tr>
              <td style="background-color: #ffffff; padding: 30px; text-align: center; border-bottom: 2px solid ${BRAND_COLOR};">
                <h1 style="margin: 0; font-family: Georgia, serif; font-size: 28px; color: #1f1f1f; letter-spacing: 2px;">BENÉ DECOR</h1>
                <p style="margin: 5px 0 0 0; font-size: 12px; color: ${BRAND_COLOR}; text-transform: uppercase; letter-spacing: 3px; font-weight: bold;">
                  Official Payment Receipt
                </p>
              </td>
            </tr>

            <!-- Hero Banner -->
            <tr>
              <td style="padding: 30px; text-align: center; background-color: #f0fdf4;">
                <div style="width: 50px; height: 50px; border-radius: 50%; background-color: #16a34a; color: #ffffff; font-size: 24px; line-height: 50px; margin: 0 auto 15px auto; font-weight: bold;">✓</div>
                <h2 style="margin: 0 0 10px 0; font-family: Georgia, serif; font-size: 22px; color: #16a34a;">Payment Received Successfully!</h2>
                <p style="margin: 0; font-size: 14px; color: #15803d;">
                  We have verified your payment of <strong>₹${totalAmountFormatted}</strong> for Order <strong>#${orderNumber}</strong>.
                </p>
              </td>
            </tr>

            <!-- Transaction Details Table -->
            <tr>
              <td style="padding: 25px 30px; border-bottom: 1px solid #eeeeee;">
                <h3 style="margin: 0 0 15px 0; font-family: Georgia, serif; font-size: 16px; color: #1f1f1f;">Transaction Details</h3>
                <table width="100%" border="0" cellspacing="0" cellpadding="8" style="background-color: #faf8f5; border-radius: 12px; font-size: 13px; color: #666666;">
                  <tr>
                    <td>Customer Name:</td>
                    <td align="right" style="color: #1f1f1f; font-weight: bold;">${customerName}</td>
                  </tr>
                  <tr>
                    <td>Order Number:</td>
                    <td align="right" style="color: #1f1f1f; font-weight: bold;">#${orderNumber}</td>
                  </tr>
                  <tr>
                    <td>Razorpay Payment ID:</td>
                    <td align="right" style="color: #1f1f1f; font-family: monospace; font-weight: bold;">${razorpayPaymentId}</td>
                  </tr>
                  <tr>
                    <td>Razorpay Order ID:</td>
                    <td align="right" style="color: #1f1f1f; font-family: monospace;">${razorpayOrderId}</td>
                  </tr>
                  <tr>
                    <td>Payment Method:</td>
                    <td align="right" style="color: #1f1f1f; font-weight: bold;">${paymentMethod}</td>
                  </tr>
                  <tr>
                    <td>Payment Status:</td>
                    <td align="right" style="color: #16a34a; font-weight: bold;">PAID / SUCCESSFUL</td>
                  </tr>
                  <tr>
                    <td>Transaction Date:</td>
                    <td align="right" style="color: #1f1f1f;">${formattedDate}</td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Ordered Products Table -->
            ${
              itemsRows
                ? `
            <tr>
              <td style="padding: 20px 30px;">
                <h3 style="margin: 0 0 15px 0; font-family: Georgia, serif; font-size: 16px; color: #1f1f1f;">Purchased Furniture Items</h3>
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                  <thead>
                    <tr style="background-color: #faf8f5;">
                      <th align="left" style="padding: 10px; font-size: 11px; text-transform: uppercase; color: #666666; border-bottom: 1px solid #e5e5e5;">Item</th>
                      <th align="center" style="padding: 10px; font-size: 11px; text-transform: uppercase; color: #666666; border-bottom: 1px solid #e5e5e5;">Qty</th>
                      <th align="right" style="padding: 10px; font-size: 11px; text-transform: uppercase; color: #666666; border-bottom: 1px solid #e5e5e5;">Price</th>
                      <th align="right" style="padding: 10px; font-size: 11px; text-transform: uppercase; color: #666666; border-bottom: 1px solid #e5e5e5;">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsRows}
                  </tbody>
                </table>
              </td>
            </tr>
            `
                : ""
            }

            <!-- Totals & Shipping -->
            <tr>
              <td style="padding: 20px 30px; background-color: #faf8f5;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td width="50%" valign="top" style="padding-right: 20px;">
                      <h4 style="margin: 0 0 8px 0; font-size: 13px; color: ${BRAND_COLOR}; text-transform: uppercase;">Shipping Address</h4>
                      <p style="margin: 0; font-size: 13px; color: #666666; line-height: 1.5;">
                        <strong>${customerName}</strong><br>
                        ${streetAddress}<br>
                        ${city}, ${state} - ${pinCode}<br>
                        ${country}<br>
                        Phone: <strong>${phone}</strong>
                      </p>
                    </td>
                    <td width="50%" valign="top">
                      <table width="100%" border="0" cellspacing="0" cellpadding="4" style="font-size: 13px; color: #666666;">
                        <tr>
                          <td>Subtotal:</td>
                          <td align="right" style="color: #1f1f1f; font-weight: bold;">₹${totalAmountFormatted}</td>
                        </tr>
                        <tr>
                          <td>Delivery Charge:</td>
                          <td align="right" style="color: #16a34a; font-weight: bold;">FREE</td>
                        </tr>
                        <tr>
                          <td style="padding-top: 10px; border-top: 1px solid #e5e5e5; font-size: 15px; font-weight: bold; color: #1f1f1f;">Total Paid:</td>
                          <td align="right" style="padding-top: 10px; border-top: 1px solid #e5e5e5; font-size: 18px; font-weight: bold; color: #16a34a;">₹${totalAmountFormatted}</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding: 25px; text-align: center; font-size: 12px; color: #888888; border-top: 1px solid #eeeeee;">
                <p style="margin: 0 0 5px 0;">This email serves as your official payment receipt for BenéDecor furniture purchases.</p>
                <p style="margin: 0;">© ${new Date().getFullYear()} BenéDecor Handcrafted Furniture. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

/**
 * 3. Shipping Confirmation Email HTML Template
 */
export function generateShippingConfirmationEmail(
  order: EmailOrderDetails,
  trackingId: string = "BD-TRACK-98421"
): string {
  const customerName =
    order.customerName || order.shippingAddress?.fullName || "Valued Customer";
  const orderNumber = order.orderNumber || "BD-ORDER";
  const streetAddress =
    order.shippingAddress?.address ||
    order.shippingAddress?.street ||
    "Delivery Address N/A";
  const city = order.shippingAddress?.city || "N/A";
  const state = order.shippingAddress?.state || "N/A";
  const pinCode =
    order.shippingAddress?.postalCode ||
    order.shippingAddress?.pinCode ||
    "N/A";

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Your Order Has Shipped - BenéDecor</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #faf8f5; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #faf8f5; padding: 40px 20px;">
      <tr>
        <td align="center">
          <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 16px; border: 1px solid #e5e5e5; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            <tr>
              <td style="background-color: #ffffff; padding: 30px; text-align: center; border-bottom: 2px solid ${BRAND_COLOR};">
                <h1 style="margin: 0; font-family: Georgia, serif; font-size: 28px; color: #1f1f1f; letter-spacing: 2px;">BENÉ DECOR</h1>
                <p style="margin: 5px 0 0 0; font-size: 12px; color: ${BRAND_COLOR}; text-transform: uppercase; letter-spacing: 3px; font-weight: bold;">
                  Dispatch & Shipping Announcement
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding: 30px; text-align: center; background-color: #eff6ff;">
                <div style="width: 50px; height: 50px; border-radius: 50%; background-color: #2563eb; color: #ffffff; font-size: 24px; line-height: 50px; margin: 0 auto 15px auto; font-weight: bold;">🚚</div>
                <h2 style="margin: 0 0 10px 0; font-family: Georgia, serif; font-size: 22px; color: #1e40af;">Your Furniture Has Shipped!</h2>
                <p style="margin: 0; font-size: 14px; color: #1e3a8a;">
                  Great news <strong>${customerName}</strong>! Your order <strong>#${orderNumber}</strong> has been carefully packed and dispatched via specialized furniture freight delivery.
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding: 25px 30px;">
                <table width="100%" border="0" cellspacing="0" cellpadding="10" style="background-color: #faf8f5; border-radius: 12px; font-size: 13px; color: #666666;">
                  <tr>
                    <td>Tracking Number:</td>
                    <td align="right" style="color: #2563eb; font-weight: bold; font-size: 15px;">${trackingId}</td>
                  </tr>
                  <tr>
                    <td>Carrier Service:</td>
                    <td align="right" style="color: #1f1f1f; font-weight: bold;">BenéDecor White-Glove Furniture Delivery</td>
                  </tr>
                  <tr>
                    <td>Shipping Destination:</td>
                    <td align="right" style="color: #1f1f1f;">${streetAddress}, ${city}, ${state} - ${pinCode}</td>
                  </tr>
                  <tr>
                    <td>Estimated Delivery:</td>
                    <td align="right" style="color: #16a34a; font-weight: bold;">3 - 5 Business Days</td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding: 25px; text-align: center; font-size: 12px; color: #888888; border-top: 1px solid #eeeeee;">
                <p style="margin: 0 0 5px 0;">Our delivery team will contact you prior to arrival for home placement and setup.</p>
                <p style="margin: 0;">© ${new Date().getFullYear()} BenéDecor Handcrafted Furniture. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

/**
 * 4. Password Reset Email HTML Template
 */
export function generatePasswordResetEmail(name: string, resetUrl: string): string {
  const customerName = name || "Valued Customer";

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Reset Your Password - BenéDecor</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #faf8f5; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #faf8f5; padding: 40px 20px;">
      <tr>
        <td align="center">
          <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 16px; border: 1px solid #e5e5e5; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            <!-- Header -->
            <tr>
              <td style="background-color: #ffffff; padding: 30px; text-align: center; border-bottom: 2px solid ${BRAND_COLOR};">
                <h1 style="margin: 0; font-family: Georgia, serif; font-size: 28px; color: #1f1f1f; letter-spacing: 2px;">BENÉ DECOR</h1>
                <p style="margin: 5px 0 0 0; font-size: 12px; color: ${BRAND_COLOR}; text-transform: uppercase; letter-spacing: 3px; font-weight: bold;">
                  Password Security Assistance
                </p>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding: 35px 30px; text-align: center;">
                <div style="width: 50px; height: 50px; border-radius: 50%; background-color: #fef3c7; color: #d97706; font-size: 24px; line-height: 50px; margin: 0 auto 15px auto; font-weight: bold;">🔑</div>
                <h2 style="margin: 0 0 12px 0; font-family: Georgia, serif; font-size: 22px; color: #1f1f1f;">Password Reset Request</h2>
                <p style="margin: 0 0 20px 0; font-size: 14px; color: #666666; line-height: 1.6;">
                  Hello <strong>${customerName}</strong>,<br>
                  We received a request to reset the password for your BenéDecor account. Click the button below to choose a new password. This link is valid for <strong>30 minutes</strong> and can only be used once.
                </p>

                <!-- Button -->
                <div style="margin: 25px 0;">
                  <a href="${resetUrl}" target="_blank" style="background-color: ${BRAND_COLOR}; color: #ffffff; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block; box-shadow: 0 4px 10px rgba(166,124,82,0.3);">
                    Reset Password →
                  </a>
                </div>

                <p style="margin: 20px 0 0 0; font-size: 12px; color: #888888; line-height: 1.5;">
                  If you did not request a password reset, please ignore this email. Your password will remain unchanged.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding: 25px; text-align: center; font-size: 12px; color: #888888; border-top: 1px solid #eeeeee; background-color: #faf8f5;">
                <p style="margin: 0 0 5px 0;">Need assistance? Contact BenéDecor Concierge at support@benedecor.in</p>
                <p style="margin: 0;">© ${new Date().getFullYear()} BenéDecor Handcrafted Furniture. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

/**
 * 5. Login OTP Email HTML Template
 */
export function generateLoginOtpEmail(name: string, otp: string): string {
  const customerName = name || "Valued Customer";

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Your Login Verification Code - BenéDecor</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #faf8f5; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #faf8f5; padding: 40px 20px;">
      <tr>
        <td align="center">
          <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 16px; border: 1px solid #e5e5e5; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            <!-- Header -->
            <tr>
              <td style="background-color: #ffffff; padding: 30px; text-align: center; border-bottom: 2px solid ${BRAND_COLOR};">
                <h1 style="margin: 0; font-family: Georgia, serif; font-size: 28px; color: #1f1f1f; letter-spacing: 2px;">BENÉ DECOR</h1>
                <p style="margin: 5px 0 0 0; font-size: 12px; color: ${BRAND_COLOR}; text-transform: uppercase; letter-spacing: 3px; font-weight: bold;">
                  Two-Factor Security Verification
                </p>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding: 35px 30px; text-align: center;">
                <div style="width: 50px; height: 50px; border-radius: 50%; background-color: #fef3c7; color: #d97706; font-size: 24px; line-height: 50px; margin: 0 auto 15px auto; font-weight: bold;">🛡️</div>
                <h2 style="margin: 0 0 12px 0; font-family: Georgia, serif; font-size: 22px; color: #1f1f1f;">Login Verification Code</h2>
                <p style="margin: 0 0 20px 0; font-size: 14px; color: #666666; line-height: 1.6;">
                  Hello <strong>${customerName}</strong>,<br>
                  Use the 6-digit code below to complete your secure login to BenéDecor. This code is valid for <strong>5 minutes</strong>.
                </p>

                <!-- OTP Code Display -->
                <div style="margin: 25px 0; padding: 18px 24px; background-color: #faf8f5; border: 2px dashed ${BRAND_COLOR}; border-radius: 14px; display: inline-block;">
                  <span style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: bold; color: #1f1f1f; letter-spacing: 12px; display: block; margin-right: -12px;">
                    ${otp}
                  </span>
                </div>

                <p style="margin: 20px 0 0 0; font-size: 12px; color: #888888; line-height: 1.5;">
                  If you did not attempt to log in to your BenéDecor account, please ignore this message or contact support immediately.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding: 25px; text-align: center; font-size: 12px; color: #888888; border-top: 1px solid #eeeeee; background-color: #faf8f5;">
                <p style="margin: 0 0 5px 0;">Need assistance? Contact BenéDecor Concierge at support@benedecor.in</p>
                <p style="margin: 0;">© ${new Date().getFullYear()} BenéDecor Handcrafted Furniture. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

/**
 * 6. Order Processing Update Email HTML Template
 */
export function generateOrderProcessingEmail(order: EmailOrderDetails): string {
  const customerName =
    order.customerName || order.shippingAddress?.fullName || "Valued Customer";
  const orderNumber = order.orderNumber || "BD-ORDER";

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Order Processing - BenéDecor</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #faf8f5; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #faf8f5; padding: 40px 20px;">
      <tr>
        <td align="center">
          <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 16px; border: 1px solid #e5e5e5; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            <tr>
              <td style="background-color: #ffffff; padding: 30px; text-align: center; border-bottom: 2px solid ${BRAND_COLOR};">
                <h1 style="margin: 0; font-family: Georgia, serif; font-size: 28px; color: #1f1f1f; letter-spacing: 2px;">BENÉ DECOR</h1>
                <p style="margin: 5px 0 0 0; font-size: 12px; color: ${BRAND_COLOR}; text-transform: uppercase; letter-spacing: 3px; font-weight: bold;">
                  Artisan Crafting Update
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding: 35px 30px; text-align: center;">
                <div style="width: 50px; height: 50px; border-radius: 50%; background-color: #fef3c7; color: #d97706; font-size: 24px; line-height: 50px; margin: 0 auto 15px auto; font-weight: bold;">🛠️</div>
                <h2 style="margin: 0 0 12px 0; font-family: Georgia, serif; font-size: 22px; color: #1f1f1f;">Order is Now Being Processed</h2>
                <p style="margin: 0 0 20px 0; font-size: 14px; color: #666666; line-height: 1.6;">
                  Hello <strong>${customerName}</strong>,<br>
                  Great news! Your order <strong>#${orderNumber}</strong> is currently being handcrafted and prepped for quality inspection by our master wood artisans.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding: 25px; text-align: center; font-size: 12px; color: #888888; border-top: 1px solid #eeeeee; background-color: #faf8f5;">
                <p style="margin: 0 0 5px 0;">Need assistance? Contact BenéDecor Concierge at support@benedecor.in</p>
                <p style="margin: 0;">© ${new Date().getFullYear()} BenéDecor Handcrafted Furniture. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

/**
 * 7. Order Delivered Email HTML Template
 */
export function generateOrderDeliveredEmail(order: EmailOrderDetails): string {
  const customerName =
    order.customerName || order.shippingAddress?.fullName || "Valued Customer";
  const orderNumber = order.orderNumber || "BD-ORDER";

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Order Delivered - BenéDecor</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #faf8f5; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #faf8f5; padding: 40px 20px;">
      <tr>
        <td align="center">
          <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 16px; border: 1px solid #e5e5e5; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            <tr>
              <td style="background-color: #ffffff; padding: 30px; text-align: center; border-bottom: 2px solid ${BRAND_COLOR};">
                <h1 style="margin: 0; font-family: Georgia, serif; font-size: 28px; color: #1f1f1f; letter-spacing: 2px;">BENÉ DECOR</h1>
                <p style="margin: 5px 0 0 0; font-size: 12px; color: ${BRAND_COLOR}; text-transform: uppercase; letter-spacing: 3px; font-weight: bold;">
                  Delivery Complete
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding: 35px 30px; text-align: center;">
                <div style="width: 50px; height: 50px; border-radius: 50%; background-color: #dcfce7; color: #16a34a; font-size: 24px; line-height: 50px; margin: 0 auto 15px auto; font-weight: bold;">🏡</div>
                <h2 style="margin: 0 0 12px 0; font-family: Georgia, serif; font-size: 22px; color: #16a34a;">Your Furniture Has Been Delivered!</h2>
                <p style="margin: 0 0 20px 0; font-size: 14px; color: #666666; line-height: 1.6;">
                  Hello <strong>${customerName}</strong>,<br>
                  Your order <strong>#${orderNumber}</strong> has been successfully delivered. We hope your new handcrafted solid wood furniture brings warmth and elegance to your home!
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding: 25px; text-align: center; font-size: 12px; color: #888888; border-top: 1px solid #eeeeee; background-color: #faf8f5;">
                <p style="margin: 0 0 5px 0;">Need assistance? Contact BenéDecor Concierge at support@benedecor.in</p>
                <p style="margin: 0;">© ${new Date().getFullYear()} BenéDecor Handcrafted Furniture. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

/**
 * 8. Order Cancelled Email HTML Template
 */
export function generateOrderCancelledEmail(order: EmailOrderDetails): string {
  const customerName =
    order.customerName || order.shippingAddress?.fullName || "Valued Customer";
  const orderNumber = order.orderNumber || "BD-ORDER";

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Order Cancellation Notice - BenéDecor</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #faf8f5; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #faf8f5; padding: 40px 20px;">
      <tr>
        <td align="center">
          <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 16px; border: 1px solid #e5e5e5; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            <tr>
              <td style="background-color: #ffffff; padding: 30px; text-align: center; border-bottom: 2px solid ${BRAND_COLOR};">
                <h1 style="margin: 0; font-family: Georgia, serif; font-size: 28px; color: #1f1f1f; letter-spacing: 2px;">BENÉ DECOR</h1>
                <p style="margin: 5px 0 0 0; font-size: 12px; color: ${BRAND_COLOR}; text-transform: uppercase; letter-spacing: 3px; font-weight: bold;">
                  Order Status Notification
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding: 35px 30px; text-align: center;">
                <div style="width: 50px; height: 50px; border-radius: 50%; background-color: #ffe4e6; color: #e11d48; font-size: 24px; line-height: 50px; margin: 0 auto 15px auto; font-weight: bold;">✕</div>
                <h2 style="margin: 0 0 12px 0; font-family: Georgia, serif; font-size: 22px; color: #e11d48;">Order Cancelled</h2>
                <p style="margin: 0 0 20px 0; font-size: 14px; color: #666666; line-height: 1.6;">
                  Hello <strong>${customerName}</strong>,<br>
                  Your order <strong>#${orderNumber}</strong> has been cancelled. If a payment was processed, a full refund will be credited back to your original payment method.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding: 25px; text-align: center; font-size: 12px; color: #888888; border-top: 1px solid #eeeeee; background-color: #faf8f5;">
                <p style="margin: 0 0 5px 0;">Need assistance? Contact BenéDecor Concierge at support@benedecor.in</p>
                <p style="margin: 0;">© ${new Date().getFullYear()} BenéDecor Handcrafted Furniture. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}
