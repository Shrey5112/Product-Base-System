import { useState } from "react";
import { useDispatch } from "react-redux";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { createProduct } from "@/redux/merchantSlice";
import type { AppDispatch } from "@/redux/store";
import { fetchProducts } from "@/redux/productSlice";
import { Textarea } from "./ui/textarea";

interface ProductFormProps {
  initialData?: {
    _id?: string;
    title: string;
    description: string;
    price: number;
    stock: number;
    images?: string[];
  };
  onClose: () => void;
  onSubmit?: (values: FormData) => void;
  isEdit?: boolean;
}

export default function ProductForm({
  initialData,
  onClose,
  onSubmit,
  isEdit,
}: ProductFormProps) {
  const dispatch = useDispatch<AppDispatch>();

  const [product, setProduct] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    stock: initialData?.stock || 0,
    images: [] as File[],
  });

  const [loading, setLoading] = useState(false);

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", product.title);
    formData.append("description", product.description);
    formData.append("price", String(product.price));
    formData.append("stock", String(product.stock));

    product.images.forEach((file) => {
      formData.append("files", file);
    });

    try {
      if (onSubmit) {
        // Parent update handler
        onSubmit(formData);
      } else {
        // Create product
        await dispatch(createProduct(formData)).unwrap();
      }

      // ✅ Fetch updated products only after success
      await dispatch(fetchProducts()).unwrap();

      // ✅ Reset form if creating
      if (!isEdit) {
        setProduct({
          title: "",
          description: "",
          price: 0,
          stock: 0,
          images: [],
        });
      }

      // ✅ Close dialog after success
      onClose();
    } catch (error) {
      console.error("❌ Failed to save product:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleProductSubmit} className="space-y-2">
      <Input
        type="text"
        value={product.title}
        onChange={(e) => setProduct({ ...product, title: e.target.value })}
        placeholder="Title"
        required
      />
      <Textarea
        value={product.description}
        onChange={(e) => setProduct({ ...product, description: e.target.value })}
        placeholder="Description"
        required
      />
      <Input
        type="number"
        value={product.price}
        onChange={(e) =>
          setProduct({ ...product, price: Number(e.target.value) })
        }
        placeholder="Price"
        required
      />
      <Input
        type="number"
        value={product.stock}
        onChange={(e) =>
          setProduct({ ...product, stock: Number(e.target.value) })
        }
        placeholder="Stock"
        required
      />
      <Input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) =>
          setProduct({
            ...product,
            images: e.target.files ? Array.from(e.target.files) : [],
          })
        }
      />
      <Button type="submit" disabled={loading}>
        {loading
          ? isEdit
            ? "Updating..."
            : "Adding..."
          : isEdit
            ? "Update Product"
            : "Add Product"}
      </Button>
    </form>
  );
}
