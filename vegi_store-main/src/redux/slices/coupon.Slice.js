import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for fetching all coupons
export const getAllCoupons = createAsyncThunk(
    'coupons/getAllCoupons',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token'); // Get token from localStorage
            const response = await axios.get('http://localhost:4000/api/allCoupens', {
                headers: {
                    'Authorization': `Bearer ${token}` // Add authorization header
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch coupons');
        }
    }
);

const couponSlice = createSlice({
    name: 'coupons',
    initialState: {
        coupons: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllCoupons.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllCoupons.fulfilled, (state, action) => {
                state.loading = false;
                state.coupons = action.payload.data;
            })
            .addCase(getAllCoupons.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default couponSlice.reducer;