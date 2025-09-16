import { Router } from "express";
import { listProducts, getProduct, addProductToCart, removeProductFromCart, createCheckoutSession } from "../controllers/controller.product";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

// Public product routes
router.get("/", listProducts);
router.get("/:id", getProduct);
router.post("/:id/add-to-cart", authMiddleware, addProductToCart);
router.post("/:id/remove-from-cart", authMiddleware, removeProductFromCart);
router.post("/create-session", authMiddleware, createCheckoutSession);

export default router;
