import api from "@/utils/api";
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";

export interface CheckoutState {
  url: string | null;       // ✅ Stripe Checkout URL
  orderId: string | null;
  loading: boolean;
  error: string | null;
  order: any | null;
}

const initialState: CheckoutState = {
  url: null,
  orderId: null,
  loading: false,
  error: null,
  order: null,
};

// ✅ Create Checkout Session
export const createCheckoutSession = createAsyncThunk(
  "checkout/createSession",
  async ({ items, userId, shipping }: { items: any[]; userId: string; shipping: number }) => {
  const { data } = await api.post("/checkout/create-session", { items, userId, shipping });
  return data;
}

);

// ✅ Confirm Payment (optional, if you want to verify via webhook or client)
export const confirmPayment = createAsyncThunk(
  "checkout/confirmPayment",
  async (checkoutSessionId: string, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/checkout/confirm-payment", { checkoutSessionId });
      return data; // { success, order }
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to confirm payment");
    }
  }
);

// ✅ Get Order by ID
export const fetchOrder = createAsyncThunk(
  "checkout/fetchOrder",
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/orders/${id}`);
      return data.order;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch order");
    }
  }
);

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    resetCheckout: (state) => {
      state.url = null;
      state.orderId = null;
      state.order = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create session
      .addCase(createCheckoutSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCheckoutSession.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.url = action.payload.url;     // ✅ Stripe Checkout URL
        state.orderId = action.payload.orderId;
      })
      .addCase(createCheckoutSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Confirm payment
      .addCase(confirmPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(confirmPayment.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.order = action.payload.order;
      })
      .addCase(confirmPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch order
      .addCase(fetchOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrder.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetCheckout } = checkoutSlice.actions;
export default checkoutSlice.reducer;
