import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {},
  reducers: {
    login: (state, action) => {
      if (action.payload) {
        state.user = action.payload;
      }
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("token");
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
