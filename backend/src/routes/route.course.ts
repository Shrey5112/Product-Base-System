import { Router } from "express";
import { listCourses, getCourse, removeCourseFromCart, addCourseToCart, createSubscriptionSession } from "../controllers/controller.course";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

// Public course routes
router.get("/", listCourses);
router.get("/:id", getCourse);
router.post("/:id/add-to-cart", authMiddleware, addCourseToCart);
router.post("/:id/remove-from-cart", authMiddleware, removeCourseFromCart);
router.post("/:id/create-subscription-session", authMiddleware, createSubscriptionSession);

export default router;
