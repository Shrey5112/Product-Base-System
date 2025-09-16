import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/redux/store";
import { fetchCourses } from "@/redux/courseSlice"; // ✅ make sure you have this thunk
import CourseCard from "@/components/CourseCard";


export default function CourseList() {
  const dispatch = useDispatch<AppDispatch>();
  const { courses, loading, error } = useSelector(
    (state: RootState) => state.course
  );
  const userRole = useSelector((state: RootState) => state.user.user?.role);

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    // 👉 Dispatch delete thunk if you have one
    console.log("Delete course", id);
  };

  const handleEdit = (id: string) => {
    console.log("Edit course", id);
  };

  if (loading) return <p>Loading courses...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="pt-16 px-10">
      <h1 className="text-2xl font-bold mb-4">📚 Available Courses</h1>
      {courses.length === 0 ? (
        <p>No courses available</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {courses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              userRole={userRole}
              onDelete={handleDelete}
              onEdit={() => handleEdit(course._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
