// store/slices/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserState, User } from "../interfaces/userInterfaces";

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
        },
        clearUser(state) {
            state.user = null;
            state.isLoading = false;
            state.error = null;
        },
    },
    // Nếu cần thêm extraReducers, bạn có thể thêm ở đây
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
