import api from "@/utils/api";
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";

export interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  interval: string;
  thumbnail?: string;
  cart?: { userId: string }[]; // just track users who added to cart
}

interface CourseState {
  courses: Course[];
  course: Course | null;
  loading: boolean;
  error: string | null;
  inCart: boolean; // if current user has added this course
}

const initialState: CourseState = {
  courses: [],
  course: null,
  loading: false,
  error: null,
  inCart: false,
};

// Fetch all courses
export const fetchCourses = createAsyncThunk("courses/fetchAll", async () => {
  const { data } = await api.get("/courses");
  return data.courses;
});

// Fetch course by ID
export const fetchCourseById = createAsyncThunk(
  "courses/fetchById",
  async (id: string) => {
    const { data } = await api.get(`/courses/${id}`);
    return data.course;
  }
);

// Add course to cart
export const addCourseToCart = createAsyncThunk(
  "courses/addToCart",
  async (id: string) => {
    const { data } = await api.post(`/courses/${id}/add-to-cart`);
    return data;
  }
);

// Remove course from cart
export const removeCourseFromCart = createAsyncThunk(
  "courses/removeFromCart",
  async (id: string) => {
    const { data } = await api.post(`/courses/${id}/remove-from-cart`);
    return data;
  }
);

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    clearSelectedCourse: (state) => {
      state.course = null;
      state.inCart = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all courses
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action: PayloadAction<Course[]>) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch courses";
      })

      // Fetch single course
      .addCase(fetchCourseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseById.fulfilled, (state, action: PayloadAction<Course>) => {
        state.loading = false;
        state.course = action.payload;

        const userId = localStorage.getItem("userId");
        state.inCart = action.payload.cart?.some((c) => c.userId === userId) || false;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch course";
      })

      // Add to cart
      .addCase(addCourseToCart.fulfilled, (state, action: PayloadAction<any>) => {
        state.course = action.payload.course;
        const userId = localStorage.getItem("userId");
        state.inCart = action.payload.course.cart?.some((c: any) => c.userId === userId) || false;
      })

      // Remove from cart
      .addCase(removeCourseFromCart.fulfilled, (state, action: PayloadAction<any>) => {
        state.course = action.payload.course;
        state.inCart = false;
      });
  },
});

export const { clearSelectedCourse } = courseSlice.actions;
export default courseSlice.reducer;
