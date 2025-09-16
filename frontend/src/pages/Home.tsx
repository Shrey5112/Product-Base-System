import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/redux/store";
import { fetchProducts } from "@/redux/productSlice";
import { fetchCourses } from "@/redux/courseSlice";
import ProductCard from "@/components/ProductCard";
import CourseCard from "@/components/CourseCard";
import ProductForm from "@/components/ProductForm";
import CourseForm from "@/components/CourseForm";
import {
  deleteProduct,
  deleteCourse,
  updateProduct,
  updateCourse,
} from "@/redux/merchantSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { products } = useSelector((state: RootState) => state.product);
  const { courses } = useSelector((state: RootState) => state.course);
  const { user } = useSelector((state: RootState) => state.user);

  // 🔹 State for edit dialog
  const [editOpen, setEditOpen] = useState(false);
  const [editType, setEditType] = useState<"product" | "course" | null>(null);
  const [editItem, setEditItem] = useState<any>(null);

  const [productOpen, setProductOpen] = useState(false);
  const [courseOpen, setCourseOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCourses());
  }, [dispatch]);

  // 🔹 handleEdit opens dialog with selected item
  const handleEdit = (type: "product" | "course", item: any) => {
    setEditType(type);
    setEditItem(item);
    setEditOpen(true);
  };

  // 🔹 handleUpdate dispatches correct action
  const handleUpdate = (values: any) => {
    if (editType === "product") {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (key === "images" && Array.isArray(values.images)) {
          values.images.forEach((file: File) =>
            formData.append("images", file)
          );
        } else {
          formData.append(key, values[key]);
        }
      });

      dispatch(updateProduct({ id: editItem._id, formData }));
    } else if (editType === "course") {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (key === "thumbnail" && values.thumbnail instanceof File) {
          formData.append("thumbnail", values.thumbnail);
        } else {
          formData.append(key, values[key]);
        }
      });

      dispatch(updateCourse({ id: editItem._id, formData }));
    }

    setEditOpen(false); // close dialog after update
  };

  const handleDeleteProduct = async (id: string) => {
  await dispatch(deleteProduct(id)).unwrap();
  dispatch(fetchProducts()); // ✅ refresh product list
};

// 🔹 handleDelete for Course
const handleDeleteCourse = async (id: string) => {
  await dispatch(deleteCourse(id)).unwrap();
  dispatch(fetchCourses()); // ✅ refresh course list
};

  return (
    <div className="pt-16 px-10">
      {user?.role === "merchant" && ( <div className="flex justify-between items-center mb-2">

      <h1 className="text-2xl font-bold mb-6">Merchant Dashboard</h1>

      {/* 🔹 Create dialogs */}
      <div className="flex gap-2 mb-6">
        <Dialog open={productOpen} onOpenChange={setProductOpen}>
          <DialogTrigger asChild>
            <Button>Create Product</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Product</DialogTitle>
            </DialogHeader>
            <ProductForm onClose={() => setProductOpen(false)} />
          </DialogContent>
        </Dialog>

        <Dialog open={courseOpen} onOpenChange={setCourseOpen}>
          <DialogTrigger asChild>
            <Button>Create Course</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Course</DialogTitle>
            </DialogHeader>
            <CourseForm onClose={() => setCourseOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      </div>)}

      {/* 🔹 Product list */}
      <h2 className="text-xl font-semibold mt-2 mb-4">Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {products.map((p) => (
          <ProductCard
            key={p._id}
            product={p}
            userRole={user?.role}
            onDelete={(id) => handleDeleteProduct(id)}
            onEdit={() => handleEdit("product", p)} // open edit dialog
          />
        ))}
      </div>

      {/* 🔹 Course list */}
      <h2 className="text-xl font-semibold mt-6 mb-4">Courses</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {courses.map((c) => (
          <CourseCard
            key={c._id}
            course={c}
            userRole={user?.role}
            onDelete={(id) => handleDeleteCourse(id)}
            onEdit={() => handleEdit("course", c)} // open edit dialog
          />
        ))}
      </div>

      {/* 🔹 Shared Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Edit {editType === "product" ? "Product" : "Course"}
            </DialogTitle>
          </DialogHeader>

          {editType === "product" && editItem && (
            <ProductForm
              initialData={editItem} // ✅ pre-fill form when editing
              onClose={() => setEditOpen(false)}
              onSubmit={(values) => handleUpdate(values)} // ✅ calls update with form values
              isEdit={true} // ✅ tell form it's in edit mode
            />
          )}

          {editType === "course" && editItem && (
            <CourseForm
              initialData={editItem}
              onClose={() => setEditOpen(false)}
              onSubmit={(values) => handleUpdate(values)}
              isEdit={true}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
