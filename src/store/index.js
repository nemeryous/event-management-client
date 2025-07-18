import { configureStore } from "@reduxjs/toolkit";
import { rootApi } from "@api/rootApi";
import snackbarReducer from "@store/slices/snackbarSlice";

const store = configureStore({
  reducer: {
    snackbar: snackbarReducer,
    [rootApi.reducerPath]: rootApi.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(rootApi.middleware);
  },
});

export default store;
