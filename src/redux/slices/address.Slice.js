import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Create Address Action
export const createAddress = createAsyncThunk(
  'address/createAddress',
  async (addressData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axios.post('http://localhost:4000/api/createAddress', addressData, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Get User Addresses Action
export const getUserAddresses = createAsyncThunk(
  'address/getUserAddresses',
  async (_, { rejectWithValue }) => {  // Changed parameter structure
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axios.get(`http://localhost:4000/api/allMyAddress`, config);  // Added http://
      console.log('Address API Response:', response.data); // Added logging
      return response.data;
    } catch (error) {
      console.error('Address API Error:', error); // Added error logging
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Delete Address Action
export const deleteAddress = createAsyncThunk(
  'address/deleteAddress',
  async (addressId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axios.delete(`http://localhost:4000/api/deleteAddress/${addressId}`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Update Address Action
export const updateAddress = createAsyncThunk(
  'address/updateAddress',
  async ({ addressId, addressData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axios.put(`http://localhost:4000/api/updateAddress/${addressId}`, addressData, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

const addressSlice = createSlice({
  name: 'address',
  initialState: {
    addresses: [],
    loading: false,
    error: null,
    success: false,
    message: ''
  },
  reducers: {
    clearAddressState: (state) => {
      state.error = null;
      state.success = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Address
      .addCase(createAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
        state.addresses.push(action.payload.data);
      })
      .addCase(createAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get User Addresses
      .addCase(getUserAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload.data;
      })
      .addCase(getUserAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Address
      .addCase(deleteAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
        state.addresses = state.addresses.filter(
          address => address._id !== action.payload.addressId
        );
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Address
      .addCase(updateAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
        const index = state.addresses.findIndex(
          address => address._id === action.payload.data._id
        );
        if (index !== -1) {
          state.addresses[index] = action.payload.data;
        }
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearAddressState } = addressSlice.actions;
export default addressSlice.reducer;