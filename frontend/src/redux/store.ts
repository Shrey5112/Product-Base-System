// store/store.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { persistReducer, persistStore } from "redux-persist";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import userReducer from "./userSlice";
import themeReducer from "./themeSlice";
import productReducer from "./productSlice";
import courseReducer from "./courseSlice";
import checkoutReducer from "./checkoutSlice";
import merchantReducer from "./merchantSlice"

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["user"], // only persist user slice (not events/bookings if you don’t want)
};

const rootReducer = combineReducers({
  user: userReducer,
  theme: themeReducer,
  product: productReducer,
  course: courseReducer,
  checkout: checkoutReducer,
  merchant: merchantReducer,
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
