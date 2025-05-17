// src/features/auth/authSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthenticated(
      state,
      action: PayloadAction<{ token: string; isAuthenticated: boolean }>
    ) {
      state.token = action.payload.token;
      state.isAuthenticated = action.payload.isAuthenticated;
    },
    setLoggedOut(state) {
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setAuthenticated, setLoggedOut } = authSlice.actions;
export default authSlice.reducer;
