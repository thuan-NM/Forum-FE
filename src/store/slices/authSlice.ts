// store/slices/authSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { AuthState, LoginCredentials } from "../interfaces/authInterfaces";
import { setUser } from "./userSlice"; // Import action để set user

const AUTH_LOCAL_STORAGE_KEY = "auth";
// Hàm để tải trạng thái auth từ localStorage
const loadAuthFromLocalStorage = (): AuthState => {
    try {
        const serializedAuth = localStorage.getItem(AUTH_LOCAL_STORAGE_KEY);
        if (serializedAuth === null) {
            return {
                isAuth: false,
                token: null,
                loading: false,
                error: null,
            };
        }
        return JSON.parse(serializedAuth) as AuthState;
    } catch (e) {
        console.warn("Không thể tải auth từ localStorage", e);
        return {
            isAuth: false,
            token: null,
            loading: false,
            error: null,
        };
    }
};

// Async thunk để xử lý đăng nhập
export const loginUser = createAsyncThunk(
    "auth/login",
    async (credentials: LoginCredentials, thunkAPI) => {
        try {
            const response = await axios.post(
                "http://localhost:8080/api/login",
                credentials,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                }
            );
            // Giả sử response.data có chứa token và thông tin người dùng
            const { token, user } = response.data;

            // Lưu token vào localStorage
            localStorage.setItem(
                AUTH_LOCAL_STORAGE_KEY,
                JSON.stringify({
                    isAuth: true,
                    token,
                    loading: false,
                    error: null,
                })
            );

            // Dispatch action để lưu thông tin người dùng vào userSlice
            thunkAPI.dispatch(setUser(user));

            return token;
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response?.data?.error || "Login failed");
        }
    }
);

const initialState: AuthState = loadAuthFromLocalStorage();

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // Action để đăng xuất
        logout(state) {
            state.isAuth = false;
            state.token = null;
            state.loading = false;
            state.error = null;
            localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY);
        },
        setAuthToken(state, action: PayloadAction<string>) {
            state.token = action.payload;
            state.isAuth = true;
          },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.isAuth = true;
                state.token = action.payload;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Export các action từ authSlice
export const { logout,setAuthToken } = authSlice.actions;
export default authSlice.reducer;
