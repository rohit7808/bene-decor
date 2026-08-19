import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { getAuthUser } from "@/lib/auth";
import { requireAdminRequest } from "@/middleware/auth";
import { sendOrderConfirmationEmail } from "@/lib/email";

/**
 * Payment Gateway Abstraction Layer
 * Prepared so Razorpay or external gateways can be plugged in seamlessly without changing UI logic.
 */
async function processPaymentMethod(paymentMethod: string, totalAmount: number) {
  if (paymentMethod === "Razorpay") {
    return { paymentStatus: "Pending", isPaid: false };
  }
  
  // Default Cash on Delivery (COD) handling
  return {
    paymentStatus: "Pending",
    isPaid: false,
  };
}

/**
 * GET /api/orders
 * Fetches single order, user order history, or all orders (admin).
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("id");
    const orderNumber = searchParams.get("orderNumber");
    const isAdminQuery = searchParams.get("admin") === "true";

    await connectDB();

    // 1. Single Order Query by ID or Order Number
    if (orderId || orderNumber) {
      const user = await getAuthUser();
      if (!user) {
        return NextResponse.json(
          { error: "Authentication required to view order details." },
          { status: 401 }
        );
      }

      const query = orderId
        ? { _id: orderId }
        : { orderNumber: orderNumber?.toUpperCase() };

      const singleOrder = await Order.findOne(query).lean();

      if (!singleOrder) {
        return NextResponse.json(
          { error: "Order not found." },
          { status: 404 }
        );
      }

      if (user.role !== "admin" && singleOrder.user && singleOrder.user.toString() !== user.userId) {
        return NextResponse.json(
          { error: "Forbidden. You are not authorized to view another customer's order." },
          { status: 403 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          order: singleOrder,
        },
        { status: 200 }
      );
    }

    // 2. Admin Query: Fetch all orders across the store
    if (isAdminQuery) {
      const adminAuth = requireAdminRequest(request);
      if (!adminAuth.success) {
        return adminAuth.response;
      }

      const allOrders = await Order.find({}).sort({ createdAt: -1 }).lean();

      return NextResponse.json(
        {
          success: true,
          count: allOrders.length,
          orders: allOrders,
        },
        { status: 200 }
      );
    }

    // 3. User Query: Fetch order history for logged-in user
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Authentication required to view order history." },
        { status: 401 }
      );
    }

    const userOrders = await Order.find({ user: user.userId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        success: true,
        count: userOrders.length,
        orders: userOrders,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("GET /api/orders Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/orders
 * Creates a new Order in MongoDB (Cash on Delivery or Pluggable Payment Gateway)
 * with individual Color Variant stock management.
 */
export async function POST(request: NextRequest) {
  try {
    // 0. Enforce strict authentication check on server
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in to place an order." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const {
      items,
      shippingAddress,
      paymentMethod = "Razorpay",
      notes = "",
    } = body;

    // Reject any Cash on Delivery (COD) order attempts
    const normalizedPaymentMethod = String(paymentMethod).trim().toUpperCase();
    if (normalizedPaymentMethod === "COD" || normalizedPaymentMethod.includes("CASH")) {
      return NextResponse.json(
        { error: "Cash on Delivery (COD) is no longer available. Only Online Payment is accepted." },
        { status: 400 }
      );
    }

    // 1. Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Order must contain at least one item." },
        { status: 400 }
      );
    }

    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.postalCode
    ) {
      return NextResponse.json(
        { error: "Please fill in all required shipping address fields." },
        { status: 400 }
      );
    }

    await connectDB();

    // 2. Validate stock availability, positive quantity & fetch trusted database prices for variants
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const productId = item.productId || item.product;
      const qty = Number(item.quantity);

      if (isNaN(qty) || qty <= 0 || !Number.isInteger(qty)) {
        return NextResponse.json(
          { error: `Invalid item quantity (${item.quantity}) for '${item.name || "Item"}'. Quantity must be a positive whole number.` },
          { status: 400 }
        );
      }

      let trustedPrice = Number(item.price) || 0;
      let sku = item.sku;
      let colorName = item.colorName;
      let colorCode = item.colorCode;

      if (productId && mongoose.Types.ObjectId.isValid(productId)) {
        const prod = await Product.findById(productId);
        if (!prod || !prod.isAvailable) {
          return NextResponse.json(
            { error: `Product '${item.name || "Item"}' is unavailable or inactive.` },
            { status: 400 }
          );
        }

        // If product has color variants
        if (prod.hasVariants && item.variantId && Array.isArray(prod.variants)) {
          const variant = prod.variants.find((v: any) => String(v._id || v.id) === String(item.variantId));
          if (!variant || variant.status === "inactive") {
            return NextResponse.json(
              { error: `Selected color variant for '${prod.name}' is unavailable.` },
              { status: 400 }
            );
          }
          if (variant.stock < qty) {
            return NextResponse.json(
              {
                error: `Insufficient stock for '${prod.name} (${variant.colorName})'. Only ${variant.stock} unit(s) remaining.`,
              },
              { status: 400 }
            );
          }
          trustedPrice = variant.price;
          colorName = variant.colorName;
          colorCode = variant.colorCode;
          sku = variant.sku || prod.sku;
        } else {
          if (prod.stock < qty) {
            return NextResponse.json(
              {
                error: `Insufficient stock for '${prod.name}'. Only ${prod.stock} unit(s) remaining.`,
              },
              { status: 400 }
            );
          }
          trustedPrice = prod.price;
          sku = prod.sku;
        }
      }

      const itemTotal = trustedPrice * qty;
      subtotal += itemTotal;

      validatedItems.push({
        product: productId,
        variantId: item.variantId,
        colorName,
        colorCode,
        sku,
        name: item.name,
        image: item.image,
        quantity: qty,
        price: trustedPrice,
      });
    }

    // 3. Generate unique order number (e.g., BD-849201)
    const timestampPart = Date.now().toString().slice(-4);
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    const generatedOrderNumber = `BD-${timestampPart}${randomPart}`;

    const shippingCharge = 0; // Free Shipping
    const tax = 0;
    const discount = 0;
    const totalAmount = subtotal + shippingCharge + tax - discount;

    // 4. Process Payment Method Abstraction
    const paymentResult = await processPaymentMethod(paymentMethod, totalAmount);

    // 5. Create Order Document in MongoDB
    const newOrder = new Order({
      orderNumber: generatedOrderNumber,
      user: user.userId,
      items: validatedItems,
      shippingAddress: {
        fullName: shippingAddress.fullName.trim(),
        phone: shippingAddress.phone.trim(),
        email: shippingAddress.email ? shippingAddress.email.trim() : user.email,
        address: shippingAddress.address.trim(),
        city: shippingAddress.city.trim(),
        state: shippingAddress.state.trim(),
        postalCode: shippingAddress.postalCode.trim(),
        country: shippingAddress.country ? shippingAddress.country.trim() : "India",
      },
      paymentMethod,
      paymentStatus: paymentResult.paymentStatus,
      orderStatus: "Processing",
      subtotal,
      shippingCharge,
      tax,
      discount,
      totalAmount,
      isPaid: paymentResult.isPaid,
      notes,
    });

    await newOrder.save();

    // 6. Deduct stock for purchased products and individual color variants
    for (const item of items) {
      const productId = item.productId || item.product;
      if (productId && mongoose.Types.ObjectId.isValid(productId)) {
        const qty = Number(item.quantity) || 1;
        const prod = await Product.findById(productId);

        if (prod) {
          if (prod.hasVariants && item.variantId && Array.isArray(prod.variants)) {
            // Deduct stock specifically for this color variant
            const variantIndex = prod.variants.findIndex(
              (v: any) => String(v._id || v.id) === String(item.variantId)
            );
            if (variantIndex > -1) {
              prod.variants[variantIndex].stock = Math.max(
                0,
                prod.variants[variantIndex].stock - qty
              );
            }
            // Also adjust parent total stock
            prod.stock = Math.max(0, prod.stock - qty);
            await prod.save();
          } else {
            prod.stock = Math.max(0, prod.stock - qty);
            if (prod.stock <= 0) {
              prod.isAvailable = false;
            }
            await prod.save();
          }
        }
      }
    }

    // Trigger Order Confirmation Email notification
    try {
      const recipientEmail = shippingAddress.email || (user ? user.email : "");
      const cleanAddress = {
        fullName: shippingAddress.fullName || newOrder.shippingAddress?.fullName || "Valued Customer",
        phone: shippingAddress.phone || newOrder.shippingAddress?.phone || "N/A",
        email: recipientEmail,
        address: shippingAddress.address || newOrder.shippingAddress?.address || "N/A",
        street: shippingAddress.address || newOrder.shippingAddress?.address || "N/A",
        city: shippingAddress.city || newOrder.shippingAddress?.city || "N/A",
        state: shippingAddress.state || newOrder.shippingAddress?.state || "N/A",
        postalCode: shippingAddress.postalCode || newOrder.shippingAddress?.postalCode || "N/A",
        pinCode: shippingAddress.postalCode || newOrder.shippingAddress?.postalCode || "N/A",
        country: shippingAddress.country || newOrder.shippingAddress?.country || "India",
      };

      await sendOrderConfirmationEmail({
        orderNumber: newOrder.orderNumber,
        customerName: cleanAddress.fullName,
        customerEmail: recipientEmail,
        customerPhone: cleanAddress.phone,
        totalAmount: newOrder.totalAmount,
        paymentMethod: newOrder.paymentMethod,
        paymentStatus: newOrder.paymentStatus,
        orderStatus: newOrder.orderStatus,
        createdAt: newOrder.createdAt,
        items: newOrder.items.map((item: any) => ({
          name: `${item.name}${item.colorName ? ` - ${item.colorName}` : ""}`,
          quantity: item.quantity || 1,
          price: item.price || 0,
          image: item.image,
        })),
        shippingAddress: cleanAddress,
      });
    } catch (e) {
      console.error("Order Email Trigger Error:", e);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Order placed successfully",
        order: {
          _id: newOrder._id.toString(),
          orderNumber: newOrder.orderNumber,
          totalAmount: newOrder.totalAmount,
          paymentMethod: newOrder.paymentMethod,
          paymentStatus: newOrder.paymentStatus,
          orderStatus: newOrder.orderStatus,
          createdAt: newOrder.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("POST /api/orders Error:", error);
    return NextResponse.json(
      { error: "Failed to place order. Please try again." },
      { status: 500 }
    );
  }
}
