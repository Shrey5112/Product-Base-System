import { Request, Response } from "express";
import {Course} from "../models/model.course";
import Stripe from "stripe";

// GET /api/courses — list courses with filtering & pagination
export const listCourses = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;

    const query: any = {};
    if (category) query.category = category;
    if (search) query.title = { $regex: search, $options: "i" };

    const courses = await Course.find(query)
      .skip((+page - 1) * +limit)
      .limit(+limit);

    const total = await Course.countDocuments(query);

    res.json({ success: true, courses, total, page: +page, limit: +limit });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/courses/:id — get single course
export const getCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      res.status(404).json({ success: false, message: "Course not found" });
      return;
    }
    res.json({ success: true, course });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// /api/courses/:id/add-to-cart
export const addCourseToCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const existing = course.cart.find((c) => c.userId.toString() === userId);
    if (existing) {
      existing.quantity += 1;
    } else {
      course.cart.push({ userId, quantity: 1 });
    }

    await course.save();
    res.json({ success: true, course });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// /api/courses/:id/remove-from-cart
export const removeCourseFromCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    course.cart = course.cart.filter((c) => c.userId.toString() !== userId);

    await course.save();
    res.json({ success: true, course });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-08-27.basil",
});

export const createSubscriptionSession = async (req: Request, res: Response) => {
  try {
    const { courseId, userId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Stripe product & price
    const stripeProduct = await stripe.products.create({
      name: course.title,
      description: course.description,
    });

    const stripePrice = await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: course.price * 100, // in paise
      currency: "inr",
      recurring: { interval: course.interval || "month" }, // month/week/year
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: stripePrice.id,
          quantity: 1,
        },
      ],
      customer_email: req.body.email,
      success_url: `${process.env.CLIENT_ORIGIN}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_ORIGIN}/cancel`,
    });

    res.json({ url: session.url, userId });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
