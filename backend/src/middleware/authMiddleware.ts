import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import {User} from "../models/model.user";

export interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      res.status(401).json({ success: false, message: "Not authenticated" });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretKey") as {
      id: string;
      role: string;
    };

    const user = await User.findById(decoded.id).select("-passwordHash");
    if (!user) {
      res.status(401).json({ success: false, message: "User not found" });
      return;
    }

    req.user = user;
    next();
  } catch (err: any) {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export const requireRole = (role: "merchant" | "admin") => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || req.user.role !== role) {
      res.status(403).json({ success: false, message: "Forbidden: Insufficient role" });
      return;
    }
    next();
  };
};
