import { Response } from "express";
import { Product } from "../models/model.product";
import { Course } from "../models/model.course";
import { AuthRequest } from "../middleware/authMiddleware";
import cloudinary from "../utils/cloudinary"; 
import getDataUri from "../utils/dataUri";


// ✅ Create Product (with multiple images)
export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, price, stock } = req.body;
    const imageUrls: string[] = [];

    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        const fileUri = getDataUri(file as Express.Multer.File);
        if (fileUri) {   // ✅ make sure it's not undefined
          const uploadRes = await cloudinary.uploader.upload(fileUri, {
            folder: "products",
          });
          imageUrls.push(uploadRes.secure_url);
        }
      }
    }

    const product = await Product.create({
      merchantId: req.user._id,
      title,
      description,
      price,
      stock,
      images: imageUrls,
    });

    res.status(201).json({ success: true, product, message: "Product created successfully" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Update Product (with multiple images)
export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, price, stock } = req.body;

    let updateData: any = { title, description, price, stock };

    if (req.files && Array.isArray(req.files)) {
      const imageUrls: string[] = [];
      for (const file of req.files) {
        const fileUri = getDataUri(file as Express.Multer.File);
        if (fileUri) {   // ✅ prevent TS error
          const uploadRes = await cloudinary.uploader.upload(fileUri, {
            folder: "products",
          });
          imageUrls.push(uploadRes.secure_url);
        }
      }
      updateData.images = imageUrls;
    }

    const product = await Product.findOneAndUpdate(
      { _id: id, merchantId: req.user._id },
      updateData,
      { new: true }
    );

    if (!product) {
      res.status(404).json({ success: false, message: "Product not found or unauthorized" });
      return;
    }

    res.json({ success: true, product, message: "Product updated successfully" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// ✅ Delete Product
// =============================
export const deleteProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      merchantId: req.user._id,
    });

    if (!product) {
      res.status(404).json({ success: false, message: "Product not found or unauthorized" });
      return;
    }

    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ✅ Create Course
export const createCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, price, interval } = req.body;

    let thumbnailUrl: string | undefined;

    if (req.file) {
      const fileUri = getDataUri(req.file as any);
      if (fileUri) {
        const uploadRes = await cloudinary.uploader.upload(fileUri, {
          folder: "courses",
        });
        thumbnailUrl = uploadRes.secure_url;
      }
    }

    const course = await Course.create({
      merchantId: req.user._id,
      title,
      description,
      price,
      interval,
      thumbnail: thumbnailUrl,
    });

    res.status(201).json({ success: true, course, message: "Course created successfully" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// ✅ Update Course
export const updateCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, price, interval } = req.body;

    let updateData: any = { title, description, price, interval };

    if (req.file) {
      const fileUri = getDataUri(req.file as any);
      if (fileUri) {
        const uploadRes = await cloudinary.uploader.upload(fileUri, {
          folder: "courses",
        });
        updateData.thumbnail = uploadRes.secure_url;
      }
    }

    const course = await Course.findOneAndUpdate(
      { _id: id, merchantId: req.user._id },
      updateData,
      { new: true }
    );

    if (!course) {
      res.status(404).json({ success: false, message: "Course not found or unauthorized" });
      return;
    }

    res.json({ success: true, course, message: "Course updated successfully" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Delete Course
export const deleteCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const course = await Course.findOneAndDelete({
      _id: req.params.id,
      merchantId: req.user._id,
    });

    if (!course) {
      res.status(404).json({ success: false, message: "Course not found or unauthorized" });
      return;
    }

    res.json({ success: true, message: "Course deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
