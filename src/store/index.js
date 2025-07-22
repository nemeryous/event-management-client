import { configureStore } from "@reduxjs/toolkit";
import { rootApi } from "@api/rootApi";
import snackbarReducer from "@store/slices/snackbarSlice";
import authReducer from "@store/slices/authSlice";

const store = configureStore({
  reducer: {
    snackbar: snackbarReducer,
    auth: authReducer,
    [rootApi.reducerPath]: rootApi.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(rootApi.middleware);
  },
  // eslint-disable-next-line no-undef
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
