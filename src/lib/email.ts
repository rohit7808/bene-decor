import { Resend } from "resend";
import {
  EmailOrderDetails,
  generateOrderConfirmationEmail,
  generatePaymentSuccessEmail,
  generateShippingConfirmationEmail,
  generatePasswordResetEmail,
  generateLoginOtpEmail,
  generateOrderProcessingEmail,
  generateOrderDeliveredEmail,
  generateOrderCancelledEmail,
} from "./emailTemplates";

let resendClient: Resend | null = null;

function getResendClient(): Resend | null {
  const rawKey = process.env.RESEND_API_KEY || "";
  const apiKey = rawKey.replace(/["']/g, "").trim();

  if (!apiKey || apiKey.includes("re_demo_key")) {
    console.warn("[Resend Warning] RESEND_API_KEY is missing or using placeholder demo key.");
    return null;
  }

  if (!resendClient) {
    console.log(`[Resend Init] Initializing Resend SDK with API Key: ${apiKey.substring(0, 6)}...${apiKey.substring(apiKey.length - 4)}`);
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

/**
 * Generic Reusable Email Dispatch Function
 */
export async function sendEmail({ to, subject, html }: SendEmailParams): Promise<boolean> {
  const rawFrom = process.env.EMAIL_FROM || "BeneDecor <marketing@benedecor.in>";
  const fromEmail = rawFrom.replace(/["']/g, "").trim();
  const client = getResendClient();

  console.log(`\n================= [RESEND DISPATCH ATTEMPT] =================`);
  console.log(`[Resend] Target Recipient (TO): ${to}`);
  console.log(`[Resend] Sender (FROM): ${fromEmail}`);
  console.log(`[Resend] Subject: ${subject}`);

  if (!to || !to.includes("@")) {
    console.error(`[Resend Error] Invalid or missing recipient email address: "${to}"`);
    console.log(`=============================================================\n`);
    return false;
  }

  try {
    if (client) {
      console.log(`[Resend API] Calling client.emails.send()...`);
      const response = await client.emails.send({
        from: fromEmail,
        to: [to],
        subject,
        html,
      });

      console.log(`[Resend API Result]:`, JSON.stringify(response, null, 2));

      if (response.error) {
        console.error("❌ Resend API Returned Error:", response.error);
        console.log(`=============================================================\n`);
        return false;
      }

      console.log(`✅ Email Sent Successfully via Resend! Message ID: ${response.data?.id}`);
      console.log(`=============================================================\n`);
      return true;
    } else {
      console.log(`⚠️ Resend Client Not Available. Running in Safe Console Logger Mode.`);
      console.log(`STATUS: Delivered (Simulated Console Mode)`);
      console.log(`=============================================================\n`);
      return true;
    }
  } catch (error) {
    console.error("❌ Resend SDK Exception:", error);
    console.log(`=============================================================\n`);
    return false;
  }
}

/**
 * Sends Order Confirmation Email
 */
export async function sendOrderConfirmationEmail(order: EmailOrderDetails): Promise<boolean> {
  const recipientEmail = order.shippingAddress?.email || order.customerEmail || "";
  console.log(`[sendOrderConfirmationEmail] Target email resolved: "${recipientEmail}"`);

  if (!recipientEmail) {
    console.warn("[sendOrderConfirmationEmail] Skipped: No recipient email address available.");
    return false;
  }

  const subject = `Order Confirmation #${order.orderNumber} - BenéDecor Handcrafted Furniture`;
  const html = generateOrderConfirmationEmail(order);

  return sendEmail({ to: recipientEmail, subject, html });
}

/**
 * Sends Payment Success Receipt Email
 */
export async function sendPaymentSuccessEmail(order: EmailOrderDetails): Promise<boolean> {
  const recipientEmail = order.shippingAddress?.email || order.customerEmail || "";
  console.log(`[sendPaymentSuccessEmail] Target email resolved: "${recipientEmail}"`);

  if (!recipientEmail) {
    console.warn("[sendPaymentSuccessEmail] Skipped: No recipient email address available.");
    return false;
  }

  const subject = `Payment Received for Order #${order.orderNumber} - BenéDecor`;
  const html = generatePaymentSuccessEmail(order);

  return sendEmail({ to: recipientEmail, subject, html });
}

/**
 * Sends Shipping Confirmation Email
 */
export async function sendShippingConfirmationEmail(
  order: EmailOrderDetails,
  trackingId?: string
): Promise<boolean> {
  const recipientEmail = order.shippingAddress?.email || order.customerEmail || "";
  console.log(`[sendShippingConfirmationEmail] Target email resolved: "${recipientEmail}"`);

  if (!recipientEmail) {
    console.warn("[sendShippingConfirmationEmail] Skipped: No recipient email address available.");
    return false;
  }

  const subject = `Your Furniture Order #${order.orderNumber} Has Shipped! - BenéDecor`;
  const html = generateShippingConfirmationEmail(order, trackingId);

  return sendEmail({ to: recipientEmail, subject, html });
}

interface PasswordResetEmailParams {
  to: string;
  name: string;
  resetUrl: string;
}

/**
 * Sends Password Reset Email
 */
export async function sendPasswordResetEmail({
  to,
  name,
  resetUrl,
}: PasswordResetEmailParams): Promise<boolean> {
  console.log(`[sendPasswordResetEmail] Target email resolved: "${to}"`);

  if (!to) {
    console.warn("[sendPasswordResetEmail] Skipped: No recipient email address provided.");
    return false;
  }

  const subject = "Reset Your Password - BenéDecor Handcrafted Furniture";
  const html = generatePasswordResetEmail(name, resetUrl);

  return sendEmail({ to, subject, html });
}

interface LoginOtpEmailParams {
  to: string;
  name: string;
  otp: string;
}

/**
 * Sends Login 2FA Verification Code Email
 */
export async function sendLoginOtpEmail({
  to,
  name,
  otp,
}: LoginOtpEmailParams): Promise<boolean> {
  console.log(`[sendLoginOtpEmail] Target email resolved: "${to}"`);

  if (!to) {
    console.warn("[sendLoginOtpEmail] Skipped: No recipient email address provided.");
    return false;
  }

  const subject = "Your BenéDecor Login Verification Code";
  const html = generateLoginOtpEmail(name, otp);

  return sendEmail({ to, subject, html });
}

/**
 * Sends Order Processing Update Email
 */
export async function sendOrderProcessingEmail(order: EmailOrderDetails): Promise<boolean> {
  const recipientEmail = order.shippingAddress?.email || order.customerEmail || "";
  if (!recipientEmail) return false;

  const subject = `Your Order #${order.orderNumber} is Now Processing - BenéDecor`;
  const html = generateOrderProcessingEmail(order);

  return sendEmail({ to: recipientEmail, subject, html });
}

/**
 * Sends Order Delivered Confirmation Email
 */
export async function sendOrderDeliveredEmail(order: EmailOrderDetails): Promise<boolean> {
  const recipientEmail = order.shippingAddress?.email || order.customerEmail || "";
  if (!recipientEmail) return false;

  const subject = `Your Furniture Order #${order.orderNumber} Has Been Delivered! - BenéDecor`;
  const html = generateOrderDeliveredEmail(order);

  return sendEmail({ to: recipientEmail, subject, html });
}

/**
 * Sends Order Cancellation Notice Email
 */
export async function sendOrderCancelledEmail(order: EmailOrderDetails): Promise<boolean> {
  const recipientEmail = order.shippingAddress?.email || order.customerEmail || "";
  if (!recipientEmail) return false;

  const subject = `Order #${order.orderNumber} Cancellation Notice - BenéDecor`;
  const html = generateOrderCancelledEmail(order);

  return sendEmail({ to: recipientEmail, subject, html });
}
