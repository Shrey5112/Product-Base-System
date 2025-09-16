// src/store/userSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;          // ✅ normalized from backend's _id
  name: string;
  email: string;
  role: string;
  token?: string;      // token is usually optional after first login
  isAuthenticated: boolean;
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // ✅ On login/register success
    setUser: (state, action: PayloadAction<any>) => {
      const payload = action.payload;

      state.user = {
        id: payload._id || payload.id,  // normalize _id → id
        name: payload.name,
        email: payload.email,
        role: payload.role,
        token: payload.token,           // if available
        isAuthenticated: true,
      };

      state.isAuthenticated = true;
    },

    // ✅ On logout
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
