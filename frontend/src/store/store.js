import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./authSlice";

const authPersistConfig = {
    key: 'auth',
    storage,
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

const store = configureStore({
    reducer: {
        auth: persistedAuthReducer,
    }
});

export const persistor = persistStore(store);

export default store;
