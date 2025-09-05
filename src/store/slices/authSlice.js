import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: "",
  refreshToken: "Bearer",
  tokenType: "",
  user: null,
  loading: false,
  error: null,
};

export const counterSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.tokenType = action.payload.tokenType;
    },
    clearToken: (state) => {
      state.accessToken = "";
      state.tokenType = "";
      state.user = null;
      state.loading = false;
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setToken, clearToken, setUser, setLoading, setError } =
  counterSlice.actions;
export default counterSlice.reducer;
