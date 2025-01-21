// utils/axiosConfig.ts

import axios, { AxiosError } from "axios";
import { store } from "../store/store"; // Import store
import { logout } from "../store/slices/authSlice"; // Import logout từ authSlice
import { RootState } from "../store/store";
import axiosRetry from "axios-retry";

// Tạo một instance của axios
const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
});

axiosRetry(instance, {
    retries: 3,
    retryCondition: (error) => {
        // Thử lại nếu lỗi là do token hết hạn
        const errorres = error as AxiosError<{ code?: string }>;
        return errorres?.response?.data?.code === "ex";
    },
    retryDelay: (retryCount) => {
        return retryCount * 100;
    },
});

// Thêm interceptor để thêm token vào header
instance.interceptors.request.use(
    (config) => {
        const state: RootState = store.getState();
        const token = state.auth.token; // Lấy token từ authSlice
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            // Nếu làm mới token thất bại, đăng xuất người dùng
            store.dispatch(logout());
            window.location.href = "/auth";        
        }
        return Promise.reject(error);
    }
);

export default instance;
