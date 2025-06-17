import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, UserState } from "../interfaces/userInterfaces";

const initialState: UserState = {
    user: null,
    isLoading: false,
    error: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<User>) {
            state.user = action.payload;
            // Lưu user vào localStorage
            const authData = { user: action.payload };
            localStorage.setItem("auth", JSON.stringify(authData));
        },
        clearUser(state) {
            state.user = null;
            state.isLoading = false;
            state.error = null;
            // Xóa auth khỏi localStorage
            localStorage.removeItem("auth");
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;