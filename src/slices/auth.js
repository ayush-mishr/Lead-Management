import { createSlice } from "@reduxjs/toolkit";
import { getTokenFromStorage, initializeSession, clearSession } from "../utils/tokenUtils";

const initialState = {
  signupData: null,
  loading: false,
  token: getTokenFromStorage(),
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setSignupData(state, value) {
      state.signupData = value.payload;
    },
    setLoading(state, value) {
      state.loading = value.payload;
    },
    setToken(state, value) {
      state.token = value.payload;
      if (value.payload) {
        // Save token when logging in
        localStorage.setItem("token", JSON.stringify(value.payload));
        // Initialize session
        initializeSession();
      } else {
        // Remove token when logging out
        localStorage.removeItem("token");
        // Clear session
        clearSession();
      }
    },
  },
});

export const { setSignupData, setLoading, setToken } = authSlice.actions;

export default authSlice.reducer;
