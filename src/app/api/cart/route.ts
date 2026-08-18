import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import { getAuthUser } from "@/lib/auth";
import mongoose from "mongoose";

/**
 * GET /api/cart
 * Fetches MongoDB cart for authenticated user.
 */
export async function GET() {
  try {
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    await connectDB();

    let cart = await Cart.findOne({ userId: user.userId }).lean();

    if (!cart) {
      cart = {
        userId: user.userId,
        items: [],
        subtotal: 0,
        totalItems: 0,
      } as any;
    }

    return NextResponse.json(
      {
        success: true,
        cart,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("GET /api/cart Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch shopping cart." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cart
 * Adds an item (with color variant support) to cart or increases quantity.
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { productId, variantId, colorName, colorCode, sku, name, price, image, quantity = 1 } = body;

    if (!productId || !name || price === undefined || !image) {
      return NextResponse.json(
        { error: "Product details (productId, name, price, image) are required." },
        { status: 400 }
      );
    }

    await connectDB();

    // Verify product stock & availability
    if (mongoose.Types.ObjectId.isValid(productId)) {
      const dbProduct = await Product.findById(productId);
      if (!dbProduct || !dbProduct.isAvailable) {
        return NextResponse.json(
          { error: `'${name}' is currently unavailable.` },
          { status: 400 }
        );
      }

      // If product has color variants
      if (dbProduct.hasVariants && variantId && Array.isArray(dbProduct.variants)) {
        const variant = dbProduct.variants.find((v: any) => String(v._id || v.id) === String(variantId));
        if (!variant || variant.status === "inactive" || variant.stock <= 0) {
          return NextResponse.json(
            { error: `'${name} (${colorName || "Selected Color"})' is currently out of stock.` },
            { status: 400 }
          );
        }
      } else if (dbProduct.stock <= 0) {
        return NextResponse.json(
          { error: `'${name}' is currently out of stock.` },
          { status: 400 }
        );
      }
    }

    let cart = await Cart.findOne({ userId: user.userId });

    if (!cart) {
      cart = new Cart({
        userId: user.userId,
        items: [],
        subtotal: 0,
        totalItems: 0,
      });
    }

    // Check if exact product + variant combination exists in cart
    const existingIndex = cart.items.findIndex(
      (item) =>
        String(item.productId) === String(productId) &&
        String(item.variantId || "") === String(variantId || "")
    );

    const currentQty = existingIndex > -1 ? cart.items[existingIndex].quantity : 0;
    const targetQty = currentQty + Number(quantity);

    if (mongoose.Types.ObjectId.isValid(productId)) {
      const dbProduct = await Product.findById(productId);
      if (dbProduct) {
        if (dbProduct.hasVariants && variantId && Array.isArray(dbProduct.variants)) {
          const variant = dbProduct.variants.find((v: any) => String(v._id || v.id) === String(variantId));
          if (variant && targetQty > variant.stock) {
            return NextResponse.json(
              { error: `Cannot add more than available stock (${variant.stock} unit(s) remaining for ${colorName || "this color"}).` },
              { status: 400 }
            );
          }
        } else if (targetQty > dbProduct.stock) {
          return NextResponse.json(
            { error: `Cannot add more than available stock (${dbProduct.stock} unit(s) remaining).` },
            { status: 400 }
          );
        }
      }
    }

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += Number(quantity);
    } else {
      cart.items.push({
        productId,
        variantId: variantId ? String(variantId) : undefined,
        colorName: colorName ? String(colorName) : undefined,
        colorCode: colorCode ? String(colorCode) : undefined,
        sku: sku ? String(sku) : undefined,
        name,
        price: Number(price),
        image,
        quantity: Number(quantity),
      });
    }

    await cart.save();

    return NextResponse.json(
      {
        success: true,
        message: "Item added to cart successfully",
        cart,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("POST /api/cart Error:", error);
    return NextResponse.json(
      { error: "Failed to add item to cart." },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/cart
 * Updates item quantity in cart by productId and optional variantId.
 */
export async function PUT(request: NextRequest) {
  try {
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { productId, variantId, quantity, action } = body;

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required." },
        { status: 400 }
      );
    }

    await connectDB();

    const cart = await Cart.findOne({ userId: user.userId });

    if (!cart) {
      return NextResponse.json(
        { error: "Cart not found." },
        { status: 404 }
      );
    }

    const itemIndex = cart.items.findIndex(
      (item) =>
        String(item.productId) === String(productId) &&
        String(item.variantId || "") === String(variantId || "")
    );

    if (itemIndex === -1) {
      return NextResponse.json(
        { error: "Item not found in cart." },
        { status: 404 }
      );
    }

    if (action === "increment") {
      cart.items[itemIndex].quantity += 1;
    } else if (action === "decrement") {
      cart.items[itemIndex].quantity -= 1;
    } else if (typeof quantity === "number") {
      cart.items[itemIndex].quantity = quantity;
    }

    // Remove item if quantity falls to 0 or below
    if (cart.items[itemIndex].quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    }

    await cart.save();

    return NextResponse.json(
      {
        success: true,
        message: "Cart updated successfully",
        cart,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("PUT /api/cart Error:", error);
    return NextResponse.json(
      { error: "Failed to update cart item." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/cart
 * Removes a specific item (by productId & variantId) or clears the cart.
 */
export async function DELETE(request: NextRequest) {
  try {
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const variantId = searchParams.get("variantId") || "";
    const clearAll = searchParams.get("clear") === "true";

    await connectDB();

    const cart = await Cart.findOne({ userId: user.userId });

    if (!cart) {
      return NextResponse.json(
        { success: true, message: "Cart cleared", cart: { items: [], subtotal: 0, totalItems: 0 } },
        { status: 200 }
      );
    }

    if (clearAll) {
      cart.items = [];
    } else if (productId) {
      cart.items = cart.items.filter(
        (item) =>
          !(
            String(item.productId) === String(productId) &&
            String(item.variantId || "") === String(variantId)
          )
      );
    }

    await cart.save();

    return NextResponse.json(
      {
        success: true,
        message: "Item removed from cart",
        cart,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("DELETE /api/cart Error:", error);
    return NextResponse.json(
      { error: "Failed to delete cart item." },
      { status: 500 }
    );
  }
}
