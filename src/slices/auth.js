import { createSlice } from "@reduxjs/toolkit";

// Safely get token from localStorage
const getTokenFromStorage = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem("token");
      return token ? JSON.parse(token) : null;
    }
  } catch (error) {
    console.error("Error accessing localStorage:", error);
  }
  return null;
};

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
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          if (value.payload) {
            //  Save token when logging in
            localStorage.setItem("token", JSON.stringify(value.payload));
          } else {
            //  Remove token when logging out
            localStorage.removeItem("token");
          }
        }
      } catch (error) {
        console.error("Error accessing localStorage in setToken:", error);
      }
    },
  },
});

export const { setSignupData, setLoading, setToken } = authSlice.actions;

export default authSlice.reducer;
