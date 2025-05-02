import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  loading: boolean;
  token: string | null;
  error: string | null;
  isAuth: boolean;
}

const initialState: AuthState = {
  loading: false,
  token: null,
  error: null,
  isAuth: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<{ token: string}>) {
      console.log("Login Success: Token received");
      state.loading = false;
      state.token = action.payload.token;
      state.isAuth = true;
      state.error = null;
    },
    loginFailure(state, action: PayloadAction<string>) {
      console.log("Login Failed:", action.payload);
      state.loading = false;
      state.isAuth = false;
      state.token = null;
      state.error = action.payload;
    },
    logout(state) {
      console.log("User Logged Out");
      state.isAuth = false;
      state.token = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } =
  authSlice.actions;

export default authSlice.reducer;
