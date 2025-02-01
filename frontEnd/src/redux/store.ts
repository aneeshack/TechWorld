import storage from 'redux-persist/lib/storage'; 
import { userReducer } from './store/slices/UserSlice';
import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';


const persistConfig = {
    key : 'root',
    storage
}

// create a persisted reducer
const persistedReducer = persistReducer(persistConfig, userReducer);

// configure store
export const store = configureStore({
    reducer: {
        user: persistedReducer
    }
})

export const persistor = persistStore(store)

// exporting types
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>