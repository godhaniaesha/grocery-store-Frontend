import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Create order action
export const createOrder = createAsyncThunk(
    'order/createOrder',
    async (orderData) => {
        try {
            // Get the token from localStorage
            const token = localStorage.getItem('token');

            // Set the authorization header
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };

            const response = await axios.post('http://localhost:4000/api/createOrder', orderData, config);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
);

// Fetch all orders action
export const fetchAllOrders = createAsyncThunk(
    'order/fetchAllOrders',
    async () => {
        try {
            // Get the token from localStorage
            const token = localStorage.getItem('token');

            // Set the authorization header
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };

            const response = await axios.get('http://localhost:4000/api/allOrders', config);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
);

// Fetch user orders action
export const fetchUserOrders = createAsyncThunk(
    'order/fetchUserOrders',
    async () => {
        try {
            // Get the token from localStorage
            const token = localStorage.getItem('token');

            // Set the authorization header
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };

            const response = await axios.get('http://localhost:4000/api/allMyOrders', config);
            console.log("API Response:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching orders:", error);
            throw error.response.data;
        }
    }
);

// Delete order action
export const updateOrderStatus = createAsyncThunk(
    'order/updateOrderStatus',
    async (id) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };
            const response = await axios.put(`http://localhost:4000/api/updateOrderStatus/${id}`, { paymentStatus: 'Received' }, config);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
);

export const deleteOrder = createAsyncThunk(
    'order/deleteOrder',
    async (orderId) => {
        console.log("orderId delete:", orderId);
        try {
            // Get the token from localStorage
            const token = localStorage.getItem('token');

            // Set the authorization header
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };

            const response = await axios.delete(`http://localhost:4000/api/deleteOrder/${orderId}`, config);
            console.log("response.data", response.data)
            return response.data;
        } catch (error) {
            console.error("Error deleting order:", error);
            throw error.response.data;
        }
    }
);

const orderSlice = createSlice({
    name: 'order',
    initialState: {
        orders: [],
        userOrders: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.orders.push(action.payload);
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchAllOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(fetchAllOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchUserOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.userOrders = action.payload;
            })
            .addCase(fetchUserOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(deleteOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteOrder.fulfilled, (state, action) => {
                state.loading = false;
                // Check if orders is an array before filtering
                if (Array.isArray(state.orders)) {
                    state.orders = state.orders.filter(order => order._id !== action.payload._id);
                }
                
                // Check if userOrders is an array before filtering
                if (Array.isArray(state.userOrders)) {
                    state.userOrders = state.userOrders.filter(order => order._id !== action.payload._id);
                } else if (state.userOrders && state.userOrders.data && Array.isArray(state.userOrders.data)) {
                    // If userOrders is an object with a data property that's an array
                    state.userOrders.data = state.userOrders.data.filter(order => order._id !== action.payload._id);
                }
            })
            .addCase(deleteOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateOrderStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                state.loading = false;
                const updatedOrder = action.payload;
                if (Array.isArray(state.orders)) {
                    state.orders = state.orders.map(order => 
                        order._id === updatedOrder._id ? updatedOrder : order
                    );
                }
                if (Array.isArray(state.userOrders)) {
                    state.userOrders = state.userOrders.map(order => 
                        order._id === updatedOrder._id ? updatedOrder : order
                    );
                }
            })
            .addCase(updateOrderStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default orderSlice.reducer;