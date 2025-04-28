import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const resendEmailOtp = createAsyncThunk(
  'emailVerification/resendOtp',
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:4000/api/resendEmailOtp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message);
      }
      
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const verifyEmailOtp = createAsyncThunk(
  'emailVerification/verifyOtp',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:4000/api/emailOtpVerify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message);
      }
      
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const emailVerificationSlice = createSlice({
  name: 'emailVerification',
  initialState: {
    isLoading: false,
    error: null,
    success: false,
    message: '',
    verifiedUser: null
  },
  reducers: {
    clearEmailVerificationState: (state) => {
      state.isLoading = false;
      state.error = null;
      state.success = false;
      state.message = '';
      state.verifiedUser = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyEmailOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyEmailOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.message = action.payload.message;
        state.verifiedUser = action.payload.data;
      })
      .addCase(verifyEmailOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(resendEmailOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resendEmailOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
      })
      .addCase(resendEmailOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearEmailVerificationState } = emailVerificationSlice.actions;
export default emailVerificationSlice.reducer;