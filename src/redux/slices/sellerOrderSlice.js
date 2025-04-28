import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getOrders = createAsyncThunk(
  "order/get",
  async (_, { rejectWithValue }) => {
    try {
    
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      const response = await axios.get(
        `http://localhost:4000/api/getalldatabyseller/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("response:", response.data.data);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const AcceptOrder = createAsyncThunk(
  "order/accept",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      console.log("redux:", id, status);

      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:4000/api/updateOrderStatus/${id}`,
        {
          orderStatus: status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const ReasonsForCancellation = createAsyncThunk(
  "order/reasons",
  async (_, { rejectWithValue }) => {
    try {
      // console.log("redux:", id);

      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:4000/api/allReasons`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const RejectOrder = createAsyncThunk(
  "order/reject",
  async ({ id, status, reasonId, comments }, { rejectWithValue }) => {
    try {
      console.log("redux:", id, status);

      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:4000/api/rejectOrder`,
        {
          orderId: id,
          reasonForCancellationId: reasonId,
          comments: comments,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("response:", response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const SingleOrder = createAsyncThunk(
  "ordersss/SingleOrder",
  async (id, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const allOrders = state.sellerOrder.orders;
      console.log("redux:", id);

      // Find the order with matching orderId
      const singleOrder = allOrders.find((order) => order.orderId === id);

      if (!singleOrder) {
        return rejectWithValue("Order not found");
      }

      console.log("Found Order:", singleOrder);

      return singleOrder;
    } catch (error) {
      console.log(error);
      return rejectWithValue("Error fetching order details");
    }
  }
);
const sellerOrderSlice = createSlice({
  name: "sellerOrder",
  initialState: {
    orders: [],
    reason: [],
    sOrder: [],
    loading: false,
    error: null,
    message: "",
    success: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.pending, (state) => {
        state.loading = true;
        state.message = "View Orders...";
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.orders = action.payload;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to View Orders";
      })
      .addCase(AcceptOrder.pending, (state) => {
        state.loading = true;
        state.message = "Accepting Order...";
      })
      .addCase(AcceptOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const updatedOrders = state.orders.map((order) =>
          order._id === action.payload._id ? action.payload : order
        );
        state.orders = updatedOrders;
        state.message = "Order Accepted Successfully!";
      })
      .addCase(AcceptOrder.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to Accept Order";
      })
      .addCase(RejectOrder.pending, (state) => {
        state.loading = true;
        state.message = "Rejecting Order...";
      })
      .addCase(RejectOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const updatedOrders = state.orders.map((order) =>
          order._id === action.payload._id ? action.payload : order
        );
        state.orders = updatedOrders;
        state.message = "Order Rejected Successfully!";
      })
      .addCase(RejectOrder.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to Reject Order";
      })
      .addCase(ReasonsForCancellation.pending, (state) => {
        state.loading = true;
        state.message = "Fetching Reasons for Cancellation...";
      })
      .addCase(ReasonsForCancellation.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.reason = action.payload;
        state.message = "Reasons for Cancellation fetched successfully!";
      })
      .addCase(ReasonsForCancellation.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message =
          action.payload?.message || "Failed to fetch Reasons for Cancellation";
      })
      .addCase(SingleOrder.pending, (state) => {
        state.loading = true;
        state.message = "Fetching Single Order...";
      })
      .addCase(SingleOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.sOrder = action.payload;
        state.message = "Single Order fetched successfully!";
      })
      .addCase(SingleOrder.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message =
          action.payload?.message || "Failed to fetch Single Order";
      });
  },
});

export default sellerOrderSlice.reducer;
