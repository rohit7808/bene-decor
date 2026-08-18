import mongoose, { Schema, Document, Model, Types } from "mongoose";

/**
 * 1. Interface for Color Variant subdocument
 */
export interface IColorVariant {
  _id?: string | Types.ObjectId;
  colorName: string;      // e.g. "Royal Blue"
  colorCode: string;      // e.g. "#3B82F6"
  price: number;          // Variant selling price
  originalPrice?: number; // Variant original price
  stock: number;          // Stock for this variant
  sku?: string;           // Variant SKU e.g. "CHAIR-BLUE-001"
  images: string[];       // Images specific to this color variant
  status: "active" | "inactive";
}

/**
 * 2. TypeScript Interface representing a Product document in MongoDB.
 */
export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  category: string;
  subCategory?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: string[];
  stock: number;
  lowStockThreshold?: number;
  sku?: string;
  material?: string;
  color?: string;
  dimensions?: string;
  weight?: string;
  brand?: string;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  isAvailable: boolean;
  tags: string[];
  hasVariants?: boolean;
  variants?: IColorVariant[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 3. Mongoose Schema definition for Color Variant
 */
const ColorVariantSchema = new Schema<IColorVariant>(
  {
    colorName: {
      type: String,
      required: [true, "Color name is required"],
      trim: true,
    },
    colorCode: {
      type: String,
      trim: true,
      default: "#A67C52",
    },
    price: {
      type: Number,
      required: [true, "Variant selling price is required"],
      min: [0, "Price cannot be negative"],
    },
    originalPrice: {
      type: Number,
      min: [0, "Original price cannot be negative"],
      default: 0,
    },
    stock: {
      type: Number,
      required: [true, "Variant stock count is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    sku: {
      type: String,
      trim: true,
      uppercase: true,
    },
    images: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { _id: true }
);

/**
 * 4. Mongoose Schema definition for Product model with production validations & indexes.
 */
const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [2, "Product name must be at least 2 characters"],
      maxlength: [150, "Product name cannot exceed 150 characters"],
    },
    slug: {
      type: String,
      required: [true, "Product slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      index: true,
    },
    subCategory: {
      type: String,
      trim: true,
      default: "",
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    originalPrice: {
      type: Number,
      min: [0, "Original price cannot be negative"],
      default: 0,
    },
    discount: {
      type: Number,
      min: [0, "Discount cannot be less than 0%"],
      max: [100, "Discount cannot exceed 100%"],
      default: 0,
    },
    images: {
      type: [String],
      required: [true, "At least one product image is required"],
      default: [],
    },
    stock: {
      type: Number,
      required: [true, "Stock count is required"],
      min: [0, "Stock cannot be negative"],
      default: 10,
    },
    lowStockThreshold: {
      type: Number,
      min: [0, "Low stock threshold cannot be negative"],
      default: 5,
    },
    sku: {
      type: String,
      sparse: true,
      trim: true,
      uppercase: true,
    },
    material: {
      type: String,
      trim: true,
      default: "Solid Wood",
    },
    color: {
      type: String,
      trim: true,
      default: "Natural Finish",
    },
    dimensions: {
      type: String,
      trim: true,
      default: "",
    },
    weight: {
      type: String,
      trim: true,
      default: "",
    },
    brand: {
      type: String,
      trim: true,
      default: "Bené Decor",
    },
    rating: {
      type: Number,
      min: [0, "Rating cannot be less than 0"],
      max: [5, "Rating cannot exceed 5"],
      default: 5.0,
    },
    reviewCount: {
      type: Number,
      min: [0, "Review count cannot be negative"],
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
      index: true,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    hasVariants: {
      type: Boolean,
      default: false,
    },
    variants: {
      type: [ColorVariantSchema],
      default: [],
    },
  },
  {
    timestamps: true, // Auto adds createdAt and updatedAt fields
  }
);

/**
 * 5. Compound index optimization for high-performance e-commerce catalog queries
 */
ProductSchema.index({ category: 1, isAvailable: 1, price: 1 });

/**
 * 6. Invalidate Mongoose model cache in development to ensure new schema fields load
 */
if (process.env.NODE_ENV === "development" && mongoose.models.Product) {
  delete (mongoose.models as any).Product;
}

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
