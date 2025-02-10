import storage from 'redux-persist/lib/storage'; 
import { userReducer } from './store/slices/UserSlice';
import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth'] // ✅ Only persist auth state (optional)
};

// ✅ Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, userReducer);

// ✅ Configure store with ignored serializable checks
export const store = configureStore({
    reducer: {
        auth: persistedReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"], // ✅ Ignore Persist Actions
                ignoredPaths: ["auth"], // ✅ Ignore specific paths
            },
        }),
});

export const persistor = persistStore(store);

// ✅ Exporting types
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
