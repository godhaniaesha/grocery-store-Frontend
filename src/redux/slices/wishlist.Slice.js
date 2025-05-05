import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Create Wishlist
export const createWishlist = createAsyncThunk(
    'wishlist/createWishlist',
    async (productId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'http://localhost:4000/api/createWishlist',
                { productId },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to add to wishlist';
        }
    }
);

// Get Wishlist Items
export const getWishlistItems = createAsyncThunk(
    'wishlist/getWishlistItems',
    async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                'http://localhost:4000/api/myWishlist',
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            console.log(response.data.data,"response");
            
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to fetch wishlist items';
        }
    }
);

// Delete from Wishlist
export const deleteFromWishlist = createAsyncThunk(
    'wishlist/deleteFromWishlist',
    async (wishlistId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(
                `http://localhost:4000/api/deleteWishlist/${wishlistId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            return { ...response.data, wishlistId };
        } catch (error) {
            throw error.response?.data?.message || 'Failed to remove from wishlist';
        }
    }
);

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: {
        wishlistItems: [],
        loading: false,
        error: null
    },
    reducers: {
        clearWishlistError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Create Wishlist
            .addCase(createWishlist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createWishlist.fulfilled, (state, action) => {
                state.loading = false;
                state.wishlistItems.push(action.payload.data);
            })
            .addCase(createWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Get Wishlist Items
            .addCase(getWishlistItems.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getWishlistItems.fulfilled, (state, action) => {
                state.loading = false;
                state.wishlistItems = action.payload.data;
            })
            .addCase(getWishlistItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Delete from Wishlist
            .addCase(deleteFromWishlist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteFromWishlist.fulfilled, (state, action) => {
                state.loading = false;
                state.wishlistItems = state.wishlistItems.filter(
                    item => item._id !== action.payload.wishlistId
                );
            })
            .addCase(deleteFromWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const { clearWishlistError } = wishlistSlice.actions;
export default wishlistSlice.reducer;