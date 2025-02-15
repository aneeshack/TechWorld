import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "../redux/store/slices/UserSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Default: localStorage for web

// Persist configuration
const persistConfig = {
  key: "root", // Key to access persisted state in storage
  storage,
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, userReducer);

export const store = configureStore({
  reducer: {
    auth: persistedReducer, // Wrap user reducer with persisted reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore specific actions or state paths where you need non-serializable data
        ignoredActions: ["persist/PERSIST"], // Example: Ignore persist actions
        ignoredPaths: ["user.register"], // Ignore paths with non-serializable data
      },
    }),
});

export const persistor = persistStore(store); // Create persistor

// Export types
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;