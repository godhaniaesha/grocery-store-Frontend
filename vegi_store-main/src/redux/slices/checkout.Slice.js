import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Create payment action
export const createPayment = createAsyncThunk(
    'checkout/createPayment',
    async (paymentData) => {
        try {
            // Get the token from localStorage
            const token = localStorage.getItem('token');
            
            // Set the authorization header
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };
            
            const response = await axios.post('http://localhost:4000/api/createPayment', paymentData, config);
            console.log('Payment created:', response.data);
            
            return response.data;
        } catch (error) {
            if (error.response) {
                throw error.response.data;
            } else if (error.request) {
                throw { message: 'No response received from server. Please check your connection.' };
            } else {
                throw { message: 'Error creating payment: ' + error.message };
            }
        }
    }
);

const checkoutSlice = createSlice({
    name: 'checkout',
    initialState: {
        payment: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createPayment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPayment.fulfilled, (state, action) => {
                state.loading = false;
                state.payment = action.payload;
            })
            .addCase(createPayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default checkoutSlice.reducer;