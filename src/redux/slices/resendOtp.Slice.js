import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const sendOtp = createAsyncThunk(
  "sendOtp",
  async (email, { rejectWithValue }) => {
    // console.log("email", email);
    // alert("sjhas");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:4000/api/forgotPassword",
        {
          email: email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log("fdksfdsjf", response.data);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch coupons");
    }
  }
);

export const resendOtp = createAsyncThunk(
  "resendOtp",
  async (email, { rejectWithValue }) => {
    // console.log("email", email);

    alert("sjhas");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:4000/api/resendEmailOtp",
        {
          email: email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log("fdksfdsjf", response.data);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch coupons");
    }
  }
);

const resendOtpSlice = createSlice({
  name: "resendOtp",
  initialState: {
    sendOtpdt: [],
    resendOtpdt: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.sendOtpdt = action.payload.data;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // resend otp
      .addCase(resendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.resendOtpdt = action.payload.data;
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default resendOtpSlice.reducer;
