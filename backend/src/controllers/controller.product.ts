import dotenv from 'dotenv';
import { Request, Response } from "express";
import{ Product} from "../models/model.product";
import { Order } from "../models/model.order";
import { Types } from "mongoose";
import type { IProduct } from "../models/model.product";
import Stripe from "stripe";

dotenv.config();

// GET /api/products — list products with filtering & pagination
export const listProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;

    const query: any = {};
    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: "i" };

    const products = await Product.find(query)
      .skip((+page - 1) * +limit)
      .limit(+limit);

    const total = await Product.countDocuments(query);

    res.json({ success: true, products, total, page: +page, limit: +limit });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/products/:id — get single product
export const getProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }
    res.json({ success: true, product });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// /api/products/:id/add-to-cart
export const addProductToCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const existing = product.cart.find((c) => c.userId.toString() === userId);
    if (existing) {
      existing.quantity += 1;
    } else {
      product.cart.push({ userId, quantity: 1 });
    }

    await product.save();

    // Calculate total price for this user
    const userCartItem = product.cart.find((c) => c.userId.toString() === userId);
    const totalPrice = userCartItem ? userCartItem.quantity * product.price : 0;

    res.json({ success: true, product, totalPrice });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Remove from Cart
export const removeProductFromCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.cart = product.cart.filter((c) => c.userId.toString() !== userId);
    await product.save();

    res.json({ success: true, product, totalPrice: 0 });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-08-27.basil",
});

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const { items, userId, shipping } = req.body as {
      items: { productId: string; quantity: number }[];
      userId: string;
      shipping: number;
    };
    console.log("ship", shipping);

    if (!items || !items.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Fetch products from DB
    // const productIds = items.map((i) => new Types.ObjectId(i.productId));
    // Fetch products with correct typing
const products = await Product.find({
  _id: { $in: items.map(i => new Types.ObjectId(i.productId)) },
}) as (IProduct & { _id: Types.ObjectId })[];

    if (products.length !== items.length) {
      return res.status(400).json({ message: "Some products not found" });
    }

    // Build order items
    const orderItems = items.map((cartItem) => {
      const product = products.find(
        (p) => p._id.toString() === cartItem.productId
      );

      if (!product) throw new Error(`Product not found: ${cartItem.productId}`);

      return {
        type: "product" as const,
        itemId: product._id,
        quantity: cartItem.quantity,
        price: product.price,
      };
    });

    // Calculate total
    const itemsTotal = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const totalAmount = itemsTotal + Number(shipping || 0);

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      // line_items: orderItems.map((item) => ({
      //   price_data: {
      //     currency: "inr",
      //     product_data: { name: "Product " + item.itemId.toString() },
      //     unit_amount: item.price * 100,
      //   },
      //   quantity: item.quantity,
      // })),
      line_items: [
    ...orderItems.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: { name: "Product " + item.itemId.toString() },
        unit_amount: item.price * 100, // price in paise
      },
      quantity: item.quantity,
    })),
    // Add shipping as a separate line item
    {
      price_data: {
        currency: "inr",
        product_data: { name: "Shipping" },
        unit_amount: Number(shipping || 0) * 100, // convert ₹ to paise
      },
      quantity: 1,
    },
  ],
      success_url: `${process.env.CLIENT_ORIGIN}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_ORIGIN}/cancel`,
    });

    // Save order
    const order = await Order.create({
      userId: new Types.ObjectId(userId),
      items: orderItems,
      totalAmount,
      shipping: shipping || 0,
      status: "pending",
      checkoutSessionId: session.id,
    });

    res.json({
      success: true,
      id: session.id,
      url: session.url,
      orderId: order._id.toString(),
      totalAmount,
    });
  } catch (err: any) {
    console.error("Stripe Checkout Error:", err);
    res.status(500).json({ message: err.message || "Failed to create session" });
  }
};