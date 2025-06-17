
import axios, { AxiosError } from "axios";
import { store } from "../store/store"; 
import { logout } from "../store/slices/authSlice"; 
import { RootState } from "../store/store";
import axiosRetry from "axios-retry";

const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
});

axiosRetry(instance, {
    retries: 3,
    retryCondition: (error) => {
        const errorres = error as AxiosError<{ code?: string }>;
        return errorres?.response?.data?.code === "ex";
    },
    retryDelay: (retryCount) => {
        return retryCount * 100;
    },
});

instance.interceptors.request.use(
    (config) => {
        const state: RootState = store.getState();
        const token = state.auth.token; 
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

        if (error.response) {
            const status = error.response.status;
            const errorData = error.response.data;

            if (status === 401 && errorData.code === "ex") {
                if (!originalRequest._retry) {
                    console.log("hello")
                    originalRequest._retry = true;
                    store.dispatch(logout());
                    window.location.href = "/auth";
                }
            } 
        }

        return Promise.reject(error);
    }
);

export default instance;
