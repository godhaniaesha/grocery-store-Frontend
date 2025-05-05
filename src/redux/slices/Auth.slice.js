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
      const response = await axios.post('http://localhost:4000/api/userLogin', credentials);
      console.log(response.data.data,"response");
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));

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
  async ({ email, otp }) => {
    try {
      const response = await axios.post('http://localhost:4000/api/emailOtpVerify', { email, otp });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
);

// Generate OTP
export const generateOtp = createAsyncThunk(
  'auth/generateOtp',
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:4000/api/forgotPassword', { email });
      localStorage.setItem("resetUserId", response.data.userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
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

// Reset Password
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ email, password, confirmPassword }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/resetPassword/`,
        {
          email: email,
          newPassword: password,
          confirmPassword: confirmPassword,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Unable to reset password');
    }
  }
);

// Logout User
export const userLogout = createAsyncThunk(
  'auth/userLogout',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:4000/api/userLogout', {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      localStorage.removeItem('token'); 
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

// Get User
export const getUser = createAsyncThunk(
  'auth/getUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:4000/api/getUser', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user data');
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
    passwordResetSuccess: false,
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
      // .addCase(generateOtp.pending, (state) => {
      //   state.loading = true;
      // })
      // .addCase(generateOtp.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.otpSent = true;
      // })
      // .addCase(generateOtp.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.error.message;
      // })

      .addCase(generateOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.otpSent = false;
      })
      .addCase(generateOtp.fulfilled, (state) => {
        state.loading = false;
        state.otpSent = true;
      })
      .addCase(generateOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'An error occurred during OTP generation.';
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
      })
      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.passwordResetSuccess = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.passwordResetSuccess = false;
      })
      // Logout
      .addCase(userLogout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userLogout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.error = null;
        state.otpSent = false;
        state.otpVerified = false;
      })
      .addCase(userLogout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get User
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, logout } = authSlice.actions;
export default authSlice.reducer;