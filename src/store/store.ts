import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // Sử dụng localStorage
import userSlice from "./slices/userSlice";
import authSlice from "./slices/authSlice";
import filterSlice from "./slices/filterSlice";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["user", "theme", "auth"], // Chỉ lưu trữ các slice này
};

const rootReducer = combineReducers({
  user: userSlice,
  auth: authSlice,
  filter: filterSlice,

  // Thêm các reducer khác nếu cần
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
