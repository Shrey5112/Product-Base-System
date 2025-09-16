import api from "@/utils/api";
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";

export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  images?: string[];
  cart: { userId: string; quantity: number }[];
}

interface ProductState {
  products: Product[];
  product: Product | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  product: null,
  loading: false,
  error: null,
};

// Fetch all products
export const fetchProducts = createAsyncThunk("products/fetchAll", async () => {
  const { data } = await api.get("/products");
  return data.products;
});

// Fetch single product
export const fetchProductById = createAsyncThunk("products/fetchById", async (id: string) => {
  const { data } = await api.get(`/products/${id}`);
  return data.product;
});

// Add product to cart
export const addProductToCart = createAsyncThunk("products/addToCart", async (id: string) => {
  const { data } = await api.post(`/products/${id}/add-to-cart`);
  return data.product;
});

// Remove product from cart
export const removeProductFromCart = createAsyncThunk("products/removeFromCart", async (id: string) => {
  const { data } = await api.post(`/products/${id}/remove-from-cart`);
  return data.product;
});

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // All products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch products";
      })

      // Single product
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action: PayloadAction<Product>) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch product";
      })

      // Add to cart
      .addCase(addProductToCart.fulfilled, (state, action: PayloadAction<Product>) => {
        const idx = state.products.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) state.products[idx] = action.payload;
        if (state.product?._id === action.payload._id) state.product = action.payload;
      })

      // Remove from cart
      .addCase(removeProductFromCart.fulfilled, (state, action: PayloadAction<Product>) => {
        const idx = state.products.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) state.products[idx] = action.payload;
        if (state.product?._id === action.payload._id) state.product = action.payload;
      });
  },
});

export default productSlice.reducer;
