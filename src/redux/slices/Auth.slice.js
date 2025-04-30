import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Create Admin User
export const createAdminUser = createAsyncThunk(
  'auth/createAdminUser',
  async (formData) => {
    try {
      const response = await axios.post('http://localhost:4000/api/createAdminUser', formData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
);

// Create User
export const createUser = createAsyncThunk(
  'auth/createUser',
  async (formData) => {
    try {
      const response = await axios.post('http://localhost:4000/api/createUser', formData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
);

// Login
export const login = createAsyncThunk(
  'auth/login',
  async (credentials) => {
    try {
      const response = await axios.post('http://localhost:4000/api/login', credentials);
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      if (error.response) {
        // The server responded with a status code outside the 2xx range
        throw error.response.data;
      } else if (error.request) {
        // The request was made but no response was received
        throw { message: 'Unable to connect to the server. Please check if the server is running.' };
      } else {
        // Something happened in setting up the request
        throw { message: error.message || 'An error occurred during login.' };
      }
    }
  }
);

// Mobile Number Login
export const mobileNoLogin = createAsyncThunk(
  'auth/mobileNoLogin',
  async (mobileNumber) => {
    try {
      const response = await axios.post('http://localhost:4000/api/mobileNoLogin', { mobileNumber });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
);

// Verify OTP
export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async ({ mobileNumber, otp }) => {
    try {
      const response = await axios.post('http://localhost:4000/api/verifyOtp', { mobileNumber, otp });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
);

// Generate OTP
export const generateOtp = createAsyncThunk(
  'auth/generateOtp',
  async (mobileNumber) => {
    try {
      const response = await axios.post('http://localhost:4000/api/generateOtp', { mobileNumber });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
);

// Verify Generated OTP
export const verifyGeneratedOtp = createAsyncThunk(
  'auth/verifyGeneratedOtp',
  async ({ mobileNumber, otp }) => {
    try {
      const response = await axios.post('http://localhost:4000/api/verifyGenereOtp', { mobileNumber, otp });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
);

// Resend OTP
export const resendOtp = createAsyncThunk(
  'auth/resendOtp',
  async (mobileNumber) => {
    try {
      const response = await axios.post('http://localhost:4000/api/resentOtp', { mobileNumber });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
);

// Static Resend OTP
export const staticResendOtp = createAsyncThunk(
  'auth/staticResendOtp',
  async (mobileNumber) => {
    try {
      const response = await axios.post('http://localhost:4000/api/staticResendotp', { mobileNumber });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
    otpSent: false,
    otpVerified: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.otpSent = false;
      state.otpVerified = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Admin User
      .addCase(createAdminUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(createAdminUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(createAdminUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Create User
      .addCase(createUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Mobile Number Login
      .addCase(mobileNoLogin.pending, (state) => {
        state.loading = true;
      })
      .addCase(mobileNoLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.otpSent = true;
      })
      .addCase(mobileNoLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Verify OTP
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.otpVerified = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Generate OTP
      .addCase(generateOtp.pending, (state) => {
        state.loading = true;
      })
      .addCase(generateOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.otpSent = true;
      })
      .addCase(generateOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Verify Generated OTP
      .addCase(verifyGeneratedOtp.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyGeneratedOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.otpVerified = true;
      })
      .addCase(verifyGeneratedOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Resend OTP
      .addCase(resendOtp.pending, (state) => {
        state.loading = true;
      })
      .addCase(resendOtp.fulfilled, (state) => {
        state.loading = false;
        state.otpSent = true;
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Static Resend OTP
      .addCase(staticResendOtp.pending, (state) => {
        state.loading = true;
      })
      .addCase(staticResendOtp.fulfilled, (state) => {
        state.loading = false;
        state.otpSent = true;
      })
      .addCase(staticResendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearError, logout } = authSlice.actions;
export default authSlice.reducer;