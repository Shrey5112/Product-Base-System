import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";
import { createCourse } from "@/redux/merchantSlice";
import { fetchCourses } from "@/redux/courseSlice";

interface CourseFormProps {
  initialData?: {
    _id?: string;
    title: string;
    description: string;
    price: number;
    interval: string;
    thumbnail?: string;
  };
  onClose: () => void;
  onSubmit?: (values: FormData) => void;
  isEdit?: boolean;
}

export default function CourseForm({
  initialData,
  onClose,
  onSubmit,
  isEdit,
}: CourseFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [course, setCourse] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    interval: initialData?.interval || "",
    thumbnail: null as File | null,
  });

  const [loading, setLoading] = useState(false);

  // ✅ Submit course
  const handleCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", course.title);
      formData.append("description", course.description);
      formData.append("price", course.price.toString());
      formData.append("interval", course.interval);

      if (course.thumbnail) {
        formData.append("file", course.thumbnail); // 👈 matches backend singleUpload
      }

      if (onSubmit) {
        await onSubmit(formData);
      } else {
        await dispatch(createCourse(formData)).unwrap();
      }

      await dispatch(fetchCourses()).unwrap();

      // ✅ Reset form only if adding new
      if (!isEdit) {
        setCourse({
          title: "",
          description: "",
          price: 0,
          interval: "",
          thumbnail: null,
        });
      }

      onClose();
    } catch (err) {
      console.error("❌ Failed to save course:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleCourseSubmit} className="space-y-2">
      <Input
        type="text"
        value={course.title}
        onChange={(e) => setCourse({ ...course, title: e.target.value })}
        placeholder="Title"
        required
      />
      <Textarea
        value={course.description}
        onChange={(e) => setCourse({ ...course, description: e.target.value })}
        placeholder="Description"
        required
      />
      <Input
        type="number"
        value={course.price}
        onChange={(e) =>
          setCourse({ ...course, price: Number(e.target.value) })
        }
        placeholder="Price"
        required
      />
      <Input
        type="text"
        value={course.interval}
        onChange={(e) => setCourse({ ...course, interval: e.target.value })}
        placeholder="Interval"
        required
      />
      <Input
        type="file"
        accept="image/*"
        onChange={(e) =>
          setCourse({
            ...course,
            thumbnail: e.target.files ? e.target.files[0] : null,
          })
        }
      />
      <Button type="submit" disabled={loading}>
        {loading
          ? isEdit
            ? "Updating..."
            : "Adding..."
          : isEdit
            ? "Update Course"
            : "Add Course"}
      </Button>
    </form>
  );
}
