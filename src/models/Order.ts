import mongoose, { Schema, Document, Model, Types } from "mongoose";

/**
 * 1. Interface for Order Item with Color Variant support
 */
export interface IOrderItem {
  product: Types.ObjectId | string;
  variantId?: string;
  colorName?: string;
  colorCode?: string;
  sku?: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
}

/**
 * 2. Interface for Shipping Address in Order
 */
export interface IShippingAddress {
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

/**
 * 3. TypeScript Interface representing an Order document in MongoDB.
 */
export interface IOrder extends Document {
  orderNumber: string;
  user: Types.ObjectId;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  paymentMethod: "COD" | "Razorpay" | "Card" | "UPI" | "NetBanking";
  paymentStatus: "Pending" | "Paid" | "Failed" | "Refunded";
  orderStatus: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  trackingId?: string;
  subtotal: number;
  shippingCharge: number;
  tax: number;
  discount: number;
  totalAmount: number;
  isDelivered: boolean;
  deliveredAt?: Date;
  isPaid: boolean;
  paidAt?: Date;
  notes?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 4. Mongoose Sub-Schema for Order Items
 */
const OrderItemSchema = new Schema<IOrderItem>(
  {
    product: {
      type: Schema.Types.Mixed,
      required: [true, "Product reference is required"],
    },
    variantId: {
      type: String,
      trim: true,
    },
    colorName: {
      type: String,
      trim: true,
    },
    colorCode: {
      type: String,
      trim: true,
    },
    sku: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Product image URL is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
  },
  { _id: false }
);

/**
 * 5. Mongoose Sub-Schema for Shipping Address
 */
const ShippingAddressSchema = new Schema<IShippingAddress>(
  {
    fullName: { type: String, required: [true, "Full name is required"], trim: true },
    phone: { type: String, required: [true, "Phone number is required"], trim: true },
    email: { type: String, trim: true },
    address: { type: String, required: [true, "Address is required"], trim: true },
    city: { type: String, required: [true, "City is required"], trim: true },
    state: { type: String, required: [true, "State is required"], trim: true },
    postalCode: { type: String, required: [true, "Postal code is required"], trim: true },
    country: { type: String, required: [true, "Country is required"], trim: true, default: "India" },
  },
  { _id: false }
);

/**
 * 6. Mongoose Schema definition for Order model with validations & indexes.
 */
const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: [true, "Order number is required"],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    user: {
      type: Schema.Types.Mixed,
      required: false,
      index: true,
    },
    items: {
      type: [OrderItemSchema],
      required: [true, "Order items cannot be empty"],
      validate: [
        (items: IOrderItem[]) => items.length > 0,
        "Order must contain at least one item",
      ],
    },
    shippingAddress: {
      type: ShippingAddressSchema,
      required: [true, "Shipping address is required"],
    },
    paymentMethod: {
      type: String,
      enum: {
        values: ["Razorpay", "online", "Card", "UPI", "NetBanking", "COD"],
        message: "Invalid payment method",
      },
      required: [true, "Payment method is required"],
      default: "Razorpay",
    },
    paymentStatus: {
      type: String,
      enum: {
        values: ["Pending", "Paid", "Failed", "Refunded"],
        message: "Invalid payment status",
      },
      default: "Pending",
      index: true,
    },
    orderStatus: {
      type: String,
      enum: {
        values: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
        message: "Invalid order status",
      },
      default: "Processing",
      index: true,
    },
    trackingId: {
      type: String,
      trim: true,
      default: "",
    },
    subtotal: {
      type: Number,
      required: [true, "Subtotal is required"],
      min: [0, "Subtotal cannot be negative"],
    },
    shippingCharge: {
      type: Number,
      default: 0,
      min: [0, "Shipping charge cannot be negative"],
    },
    tax: {
      type: Number,
      default: 0,
      min: [0, "Tax cannot be negative"],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be negative"],
    },
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Total amount cannot be negative"],
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    razorpayOrderId: {
      type: String,
      trim: true,
      default: "",
    },
    razorpayPaymentId: {
      type: String,
      trim: true,
      default: "",
    },
    razorpaySignature: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true, // Auto adds createdAt and updatedAt fields
  }
);

/**
 * 7. Export Order model safely preventing duplicate model compilation in Next.js HMR.
 */
export const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
