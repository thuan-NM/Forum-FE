import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, UserState } from "../interfaces/userInterfaces";

const savedAuth = localStorage.getItem("auth");
const parsedAuth = savedAuth ? JSON.parse(savedAuth) : null;

const initialState: UserState = {
    user: parsedAuth?.user || null,  // 🔥 Lấy `user` từ localStorage
    isLoading: false,
    error: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<User>) {
            state.user = action.payload;
        },
        clearUser(state) {
            state.user = null;
            state.isLoading = false;
            state.error = null;

            // 🔥 Xóa `user` khỏi localStorage
            const savedAuth = localStorage.getItem("auth");
            if (savedAuth) {
                const parsedAuth = JSON.parse(savedAuth);
                delete parsedAuth.user;
                localStorage.setItem("auth", JSON.stringify(parsedAuth));
            }
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
