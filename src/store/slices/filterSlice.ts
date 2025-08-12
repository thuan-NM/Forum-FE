// store/slices/filterSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FilterState {
  [key: string]: string | string[];
}

const initialState: FilterState = {
  search: "",
  sort: "desc", // hoặc "" nếu chưa chọn
  tag: [],
  topic: [],
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setFilterKey(
      state,
      action: PayloadAction<{ key: string; value: string | string[] }>
    ) {
      state[action.payload.key] = action.payload.value;
    },
    clearFilters(state) {
      Object.keys(state).forEach((key) => {
        state[key] = Array.isArray(state[key]) ? [] : "";
      });
    },
  },
});

export const { setFilterKey, clearFilters } = filterSlice.actions;
export default filterSlice.reducer;
