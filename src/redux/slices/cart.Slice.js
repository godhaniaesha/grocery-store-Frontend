import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:4000/api";

// Create cart
export const createCart = createAsyncThunk(
  "cart/createCart",
  async (cartData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axios.post(`${API_URL}/createCart`, cartData, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Get my all cart items
// Fix the getallMyCarts thunk
export const getallMyCarts = createAsyncThunk(
  "cart/getallMyCarts",
  async (_, { rejectWithValue }) => {  // Remove the destructuring from the first parameter
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axios.get(`${API_URL}/allMyCarts`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Add this new action after createCart
export const updateCart = createAsyncThunk(
  "cart/updateCart",
  async (cartData, { rejectWithValue, dispatch }) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axios.put(`${API_URL}/updateCart/${cartData.cartId}`, cartData, config);
      
      // If quantity is 0, automatically delete the cart item
      if (cartData.quantity === 0) {
        await dispatch(deleteCart(cartData.cartId));
        return { ...response.data, deleted: true };
      }
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Add this new action after updateCart
export const deleteCart = createAsyncThunk(
  "cart/deleteCart",
  async (cartId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axios.delete(`${API_URL}/deleteCart/${cartId}`, config);
      
      // Ensure the response includes the cartId for proper state updates
      if (response.data && !response.data.cartId) {
        response.data.cartId = cartId;
      }
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);


const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: [],
    loading: false,
    error: null,
    success: false,
    message: '',
    totalCartItems: 0
  },
  reducers: {
    clearCartState: (state) => {
      state.error = null;
      state.success = false;
      state.message = '';
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.totalCartItems = 0;
      state.success = true;
      state.message = 'Cart cleared successfully';
    }
  },
  extraReducers: (builder) => {

    // Add these cases in extraReducers
    builder
      // Handle createCart
      .addCase(createCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCart.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
        if (action.payload.success) {
          state.cartItems.push(action.payload.data);
        }
      })
      .addCase(createCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle getallMyCarts
      .addCase(getallMyCarts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getallMyCarts.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload.data;
        state.totalCartItems = action.payload.totalMyCart;
        state.success = action.payload.success;
        state.message = action.payload.message;
      })
      .addCase(getallMyCarts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCart.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
        
        // If item was deleted due to quantity 0, don't update the cart items
        if (action.payload.deleted) {
          return;
        }
        
        if (action.payload.success && action.payload.data) {
          const updatedItem = action.payload.data;
          const itemIndex = state.cartItems.findIndex(item => item._id === updatedItem._id);
          
          if (itemIndex !== -1) {
            // Update the existing item with new data
            state.cartItems[itemIndex] = {
              ...state.cartItems[itemIndex],
              ...updatedItem
            };
          }
        }
      })
      .addCase(updateCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update the deleteCart.fulfilled case to add logging
      .addCase(deleteCart.fulfilled, (state, action) => {
          state.loading = false;
          state.success = action.payload?.success || false;
          state.message = action.payload?.message || '';
          
          if (action.payload?.success) {
              // Check if we have the deleted cart item ID
              const deletedCartId = action.payload?.data?._id || action.payload?.cartId;
              
              if (deletedCartId) {
                  // Remove the item from the cart
                  state.cartItems = state.cartItems.filter(item => item._id !== deletedCartId);
                  console.log("Cart item removed successfully:", deletedCartId);
              } else {
                  console.warn("Cart item deleted but ID not provided in response");
              }
          }
      })
      .addCase(deleteCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

  }
});

export const { clearCartState, clearCart } = cartSlice.actions;
export default cartSlice.reducer;  // Add this default export