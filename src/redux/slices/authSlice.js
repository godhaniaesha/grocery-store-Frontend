import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Create async thunk for logout
// Update the logoutUser thunk with the correct API endpoint
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // Using the correct logout API endpoint
      const response = await axios.post('http://localhost:4000/api/userLogout', {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.success) {
        // Clear local storage only on successful logout
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return response.data;
      } else {
        return rejectWithValue(response.data.message || 'Logout failed');
      }
    } catch (error) {
      // Improved error handling
      const errorMessage = error.response?.data?.message || 'Unable to logout. Please try again.';
      return rejectWithValue(errorMessage);
    }
  }
);



// Create async thunk for password change
export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await axios.put('http://localhost:4000/api/changePassword', {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Password change failed');
    }
  }
);

// Create async thunk for login
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:4000/api/userLogin', {
        email: credentials.email,
        password: credentials.password
      });

      // Check if response has data
      if (response.data) {
        // Store token in localStorage
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.data));
        }
        return response.data;
      }
      
      return rejectWithValue('Login failed');
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

// Add forgotPassword thunk
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:4000/api/forgotPassword', {
        email: email
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send reset code');
    }
  }
);


export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ email, newPassword, confirmPassword }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/resetPassword`,  // Update endpoint to use email
        {
          email,
          newPassword,
          confirmPassword
        }
      );

      if (response.data.success) {
        localStorage.removeItem('forgotEmail'); // Clean up
        return response.data;
      } else {
        return rejectWithValue(response.data.message || 'Password reset failed');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Unable to reset password');
    }
  }
);


const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
    token: localStorage.getItem('token') || null,
    isLoading: false,
    error: null,
    passwordChangeSuccess: false,
    forgotPasswordSuccess: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.passwordChangeSuccess = false;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        state.passwordChangeSuccess = true;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.passwordChangeSuccess = false;
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.forgotPasswordSuccess = false;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        state.forgotPasswordSuccess = true;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.forgotPasswordSuccess = false;
      })
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.passwordResetSuccess = false;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.passwordResetSuccess = true;
        state.message = action.payload.message;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.passwordResetSuccess = false;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;