import Razorpay from "razorpay";

let razorpayInstance: Razorpay | null = null;

export function getRazorpayInstance(): Razorpay {
  if (!razorpayInstance) {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      console.warn(
        "Warning: RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is missing in environment variables."
      );
    }

    razorpayInstance = new Razorpay({
      key_id: keyId || "placeholder_key_id",
      key_secret: keySecret || "placeholder_key_secret",
    });
  }

  return razorpayInstance;
}

export default getRazorpayInstance;
