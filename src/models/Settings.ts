import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISettings extends Document {
  // 1. Store Information
  storeName: string;
  logo: string;
  businessEmail: string;
  supportEmail: string;
  phone: string;
  websiteUrl: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  description: string;

  // 2. Contact & Business Settings
  whatsappNumber: string;
  businessHours: string;
  facebookUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  showSocialLinks: boolean;

  // 3. Orders & Shipping Settings
  minOrderAmount: number;
  freeShippingThreshold: number;
  defaultDeliveryCharge: number;
  enableCOD: boolean;
  enableOnlinePayment: boolean;
  cancellationWindowHours: number;
  estimatedDeliveryDays: string;

  // 4. Tax / GST Settings
  enableTax: boolean;
  gstPercentage: number;
  taxInclusive: boolean;

  // 5. Email Settings (Resend Integration Meta)
  senderName: string;
  senderEmail: string;
  replyToEmail: string;

  // 6. Payment Settings (Razorpay Configuration Meta)
  razorpayEnabled: boolean;
  razorpayTestMode: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>(
  {
    storeName: { type: String, required: true, default: "Bené Decor", trim: true },
    logo: { type: String, default: "/images/logo.png" },
    businessEmail: { type: String, required: true, default: "marketing@benedecor.in", trim: true },
    supportEmail: { type: String, required: true, default: "saadgifurniture@gmail.com", trim: true },
    phone: { type: String, default: "+91 9928348586", trim: true },
    websiteUrl: { type: String, default: "https://benedecor.in", trim: true },
    address: { type: String, default: "Jaipur Showroom & Artisan Studio", trim: true },
    city: { type: String, default: "Jaipur", trim: true },
    state: { type: String, default: "Rajasthan", trim: true },
    pincode: { type: String, default: "302001", trim: true },
    country: { type: String, default: "India", trim: true },
    description: {
      type: String,
      default: "Handcrafted luxury solid wood furniture made with passion, precision and finest materials in Jaipur, India.",
    },

    whatsappNumber: { type: String, default: "+91 9928348586", trim: true },
    businessHours: { type: String, default: "Mon - Sat: 10:00 AM - 7:00 PM IST", trim: true },
    facebookUrl: { type: String, default: "https://facebook.com/benedecor", trim: true },
    instagramUrl: { type: String, default: "https://instagram.com/benedecor", trim: true },
    twitterUrl: { type: String, default: "https://twitter.com/benedecor", trim: true },
    showSocialLinks: { type: Boolean, default: true },

    minOrderAmount: { type: Number, default: 0, min: 0 },
    freeShippingThreshold: { type: Number, default: 0, min: 0 }, // 0 = Free shipping for all orders
    defaultDeliveryCharge: { type: Number, default: 0, min: 0 },
    enableCOD: { type: Boolean, default: true },
    enableOnlinePayment: { type: Boolean, default: true },
    cancellationWindowHours: { type: Number, default: 24, min: 0 },
    estimatedDeliveryDays: { type: String, default: "5 to 7 business days", trim: true },

    enableTax: { type: Boolean, default: true },
    gstPercentage: { type: Number, default: 18, min: 0, max: 100 },
    taxInclusive: { type: Boolean, default: true },

    senderName: { type: String, default: "BeneDecor Team", trim: true },
    senderEmail: { type: String, default: "marketing@benedecor.in", trim: true },
    replyToEmail: { type: String, default: "support@benedecor.in", trim: true },

    razorpayEnabled: { type: Boolean, default: true },
    razorpayTestMode: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

if (process.env.NODE_ENV === "development" && mongoose.models.Settings) {
  delete (mongoose.models as any).Settings;
}

export const Settings: Model<ISettings> =
  mongoose.models.Settings || mongoose.model<ISettings>("Settings", SettingsSchema);

export default Settings;
