import mongoose, { Schema, Document, Model, Types } from "mongoose";

/**
 * 1. Interface for User Address object
 */
export interface IAddress {
  _id?: Types.ObjectId;
  fullName?: string;
  phone?: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault?: boolean;
}

/**
 * 2. TypeScript Interface representing a User document in MongoDB.
 */
export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role: "customer" | "admin";
  avatar?: string;
  addresses: IAddress[];
  wishlist: Types.ObjectId[];
  cart: Types.ObjectId[];
  orders: Types.ObjectId[];
  emailVerified: boolean;
  isActive: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  loginOtp?: string;
  loginOtpExpires?: Date;
  loginOtpAttempts?: number;
  loginOtpLastSent?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 3. Mongoose Sub-Schema definition for User Address
 */
const AddressSchema = new Schema<IAddress>(
  {
    fullName: { type: String, trim: true },
    phone: { type: String, trim: true },
    street: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true, default: "India" },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }
);

/**
 * 4. Mongoose Schema definition for User model with production validations & security.
 */
const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    role: {
      type: String,
      enum: {
        values: ["customer", "admin"],
        message: "Role must be either customer or admin",
      },
      default: "customer",
      index: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    addresses: {
      type: [AddressSchema],
      default: [],
    },
    wishlist: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
        default: [],
      },
    ],
    cart: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
        default: [],
      },
    ],
    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: "Order",
        default: [],
      },
    ],
    emailVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    resetPasswordToken: {
      type: String,
      default: undefined,
    },
    resetPasswordExpires: {
      type: Date,
      default: undefined,
    },
    loginOtp: {
      type: String,
      default: undefined,
    },
    loginOtpExpires: {
      type: Date,
      default: undefined,
    },
    loginOtpAttempts: {
      type: Number,
      default: 0,
    },
    loginOtpLastSent: {
      type: Date,
      default: undefined,
    },
  },
  {
    timestamps: true, // Auto adds createdAt and updatedAt fields
  }
);

if (process.env.NODE_ENV === "development" && mongoose.models.User) {
  delete (mongoose.models as any).User;
}

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
