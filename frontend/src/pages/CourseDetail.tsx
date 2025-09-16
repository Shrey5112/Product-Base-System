import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import type { RootState, AppDispatch } from "@/redux/store";
import { fetchCourseById } from "@/redux/courseSlice";
import api from "@/utils/api"; // axios instance
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CourseDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { course, loading, error } = useSelector(
    (state: RootState) => state.course
  );
  const { user } = useSelector((state: RootState) => state.user);

  const [buying, setBuying] = useState(false);

  useEffect(() => {
    if (id) dispatch(fetchCourseById(id));
  }, [dispatch, id]);

  const handleBuyCourse = async () => {
    if (!user) {
      toast.error("Please login to buy this course");
      return;
    }

    try {
      setBuying(true);

      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe failed to initialize");

      // ✅ Create subscription session
      const { data } = await api.post(`/courses/${id}/create-subscription-session`, {
        courseId: id,
        email: user.email,
      });


      // ✅ Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to buy course");
    } finally {
      setBuying(false);
    }
  };

  if (loading) return <p>Loading course...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!course) return <p>No course found</p>;

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{course.title}</CardTitle>
        </CardHeader>
        <CardContent>
          {course.thumbnail && (
            <img
              src={course.thumbnail}
              alt="thumbnail"
              className="w-full h-40 object-cover rounded mb-4"
            />
          )}
          <p className="text-gray-700 mb-3">{course.description}</p>

          <p className="text-lg font-semibold">
            ₹{course.price}
            {course.interval ? `/${course.interval}` : ""}
          </p>

          <Button
            onClick={handleBuyCourse}
            disabled={buying}
            className="mt-4 w-full"
          >
            {buying ? (
              <Loader className="w-4 h-4 animate-spin mr-2 inline" />
            ) : (
              "Subscribe"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseDetail;
