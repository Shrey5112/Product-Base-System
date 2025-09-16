import { multipleUpload, singleUpload } from './../middleware/multer';
import { Router } from "express";
import {
  createProduct,
  updateProduct,
  createCourse,
  updateCourse,
  deleteProduct,
  deleteCourse,
} from "../controllers/controller.merchant";
import { authMiddleware, requireRole } from "../middleware/authMiddleware";

const router = Router();

// ✅ Products
router.post("/products", authMiddleware, requireRole("merchant"), multipleUpload, createProduct);
router.put("/products/:id", authMiddleware, requireRole("merchant"), multipleUpload, updateProduct);
router.delete("/products/:id", authMiddleware, requireRole("merchant"), deleteProduct)

// ✅ Courses
router.post("/courses", authMiddleware, requireRole("merchant"), singleUpload, createCourse);
router.put("/courses/:id", authMiddleware, requireRole("merchant"), singleUpload, updateCourse);
router.delete("/courses/:id", authMiddleware, requireRole("merchant"), deleteCourse)

export default router;
