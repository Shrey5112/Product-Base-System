import api from "@/utils/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface MerchantState {
  products: any[];
  courses: any[];
  loading: boolean;
  error: string | null;
}

const initialState: MerchantState = {
  products: [],
  courses: [],
  loading: false,
  error: null,
};

// =============================
// ✅ Products
// =============================

// Create Product (multipart/form-data)
export const createProduct = createAsyncThunk(
  "merchant/createProduct",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/merchant/products", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.product;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to create product");
    }
  }
);

// Update Product (multipart/form-data)
export const updateProduct = createAsyncThunk(
  "merchant/updateProduct",
  async ({ id, formData }: { id: string; formData: FormData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/merchant/products/${id}`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.product;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to update product");
    }
  }
);

// Delete Product
export const deleteProduct = createAsyncThunk(
  "merchant/deleteProduct",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/merchant/products/${id}`, { withCredentials: true });
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete product");
    }
  }
);

// =============================
// ✅ Courses
// =============================

// Create Course (multipart/form-data)
export const createCourse = createAsyncThunk(
  "merchant/createCourse",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/merchant/courses", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.course;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to create course");
    }
  }
);

// Update Course (multipart/form-data)
export const updateCourse = createAsyncThunk(
  "merchant/updateCourse",
  async ({ id, formData }: { id: string; formData: FormData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/merchant/courses/${id}`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.course;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to update course");
    }
  }
);

// Delete Course
export const deleteCourse = createAsyncThunk(
  "merchant/deleteCourse",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/merchant/courses/${id}`, { withCredentials: true });
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete course");
    }
  }
);

const merchantSlice = createSlice({
  name: "merchant",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ✅ Products
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.products = state.products.map((p) =>
          p._id === action.payload._id ? action.payload : p
        );
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p._id !== action.payload);
      })

      // ✅ Courses
      .addCase(createCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courses.push(action.payload);
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.courses = state.courses.map((c) =>
          c._id === action.payload._id ? action.payload : c
        );
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.courses = state.courses.filter((c) => c._id !== action.payload);
      });
  },
});

export default merchantSlice.reducer;
