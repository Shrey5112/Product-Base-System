import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {User} from "../models/model.user";

// Register user
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ success: false, message: "User already exists" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });

    res.status(201).json({ success: true, user, message: "Register successful" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Login user and set cookie
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ success: false, message: "Invalid email or password" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(400).json({ success: false, message: "Invalid email or password" });
      return;
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secretKey",
      { expiresIn: "1d" }
    );

    // ✅ Store token in HttpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // send only over HTTPS in prod
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.json({ success: true, message: "Login successful", user });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Logout user by clearing cookie
export const logout = async (_req: Request, res: Response): Promise<void> => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.json({ success: true, message: "Logged out successfully" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
