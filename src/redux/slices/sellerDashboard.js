import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getuserData = createAsyncThunk(
  "getuserData",
  async (_, { rejectWithValue, getState }) => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    var response = await axios.get("http://localhost:4000/api/getUser", config);
    return response.data;
  }
);
export const dashBoard = createAsyncThunk(
  "dashData",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      var sellerID = localStorage.getItem("userId");
      const response = await axios.get(
        `http://localhost:4000/api/getAllProductOfSeller/${sellerID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("response data", response);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getAlldataseller = createAsyncThunk(
  "dataseller",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      var sellerID = localStorage.getItem("userId");
      const response = await axios.get(
        `http://localhost:4000/api/getalldatabyseller/${sellerID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("response data", response);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const dashRecentOrder = createAsyncThunk(
  "Recent Order",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:4000/api/recentOrders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const dashSalesByCategory = createAsyncThunk(
  "sales By Category",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const sellerID = localStorage.getItem("userId");
      const response = await axios.get(
        `http://localhost:4000/api/getSalesByCategory/${sellerID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      return response.data.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const dashSatatistics = createAsyncThunk(
  "satatistics",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const sellerID = localStorage.getItem("userId");
      const response = await axios.get(
        `http://localhost:4000/api/getMonthlyRevenue/${sellerID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      return response.data.data;
    } catch (error) {
      console.log(error);
    }
  }
);

const sellerDashboardSlice = createSlice({
  name: "sellerDashboard",
  initialState: {
    dashBoard: [],
    recentOrder: [],
    salesByCategory: [],
    statistics: [],
    getdataseller: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    // dashboard
    builder
      .addCase(dashBoard.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.dashBoard = action.payload;
        state.message = "View Dashboard...";
      })
      .addCase(dashBoard.pending, (state, action) => {
        state.loading = true;
        state.message = "Accepting Dashboard...";
      })
      .addCase(dashBoard.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to View Dashboard";
      })

      // recent order
      .addCase(dashRecentOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.recentOrder = action.payload;
        state.message = "View Dashboard...";
      })
      .addCase(dashRecentOrder.pending, (state, action) => {
        state.loading = true;
        state.message = "Accepting Dashboard...";
      })
      .addCase(dashRecentOrder.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to View Dashboard";
      })

      // sales By category
      .addCase(dashSalesByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.salesByCategory = action.payload;
        state.message = "View Dashboard...";
      })
      .addCase(dashSalesByCategory.pending, (state, action) => {
        state.loading = true;
        state.message = "Accepting Dashboard...";
      })
      .addCase(dashSalesByCategory.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to View Dashboard";
      })

      // statistics
      .addCase(dashSatatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.statistics = action.payload;
        state.message = "View Dashboard...";
      })
      .addCase(dashSatatistics.pending, (state, action) => {
        state.loading = true;
        state.message = "Accepting Dashboard...";
      })
      .addCase(dashSatatistics.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to View Dashboard";
      })

      // getalldataseller
      .addCase(getAlldataseller.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.getdataseller = action.payload;
        state.message = "View Dashboard...";
      })
      .addCase(getAlldataseller.pending, (state, action) => {
        state.loading = true;
        state.message = "Accepting Dashboard...";
      })
      .addCase(getAlldataseller.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to View Dashboard";
      });
  },
});

export default sellerDashboardSlice.reducer;
