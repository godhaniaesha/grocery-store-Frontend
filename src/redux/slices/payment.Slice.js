import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchPayment = createAsyncThunk(
  'payment/fetchPayment',
  async (id, thunkAPI) => {
    try {
      const token = localStorage.getItem('token'); // or your specific key
      const response = await axios.get(`http://localhost:4000/api/getPayment/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response.data.data[0],"response.data");
      
      return response.data.data[0]; // Assuming you want the first item
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch payment');
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState: {
    payment: null,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.payment = action.payload;
      })
      .addCase(fetchPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default paymentSlice.reducer;