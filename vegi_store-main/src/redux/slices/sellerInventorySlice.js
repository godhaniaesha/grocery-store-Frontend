import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createInventory = createAsyncThunk(
  "inventory/create",
  async (inventoryData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:4000/api/createStock`,
        inventoryData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getStockBySeller = createAsyncThunk(
  "inventory/getStock",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(`http://localhost:4000/api/getOwnProductVar`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.data;
    } catch (error) {
      console.error("Error fetching inventory:", error);
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);


export const getInventory = createAsyncThunk(
  "inventory/get",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      const response = await axios.get(`http://localhost:4000/api/allStocks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Filter inventory based on sellerId (optional - remove if not needed)
      const filteredInventory = response.data.data.map((stockItem) => {
        const filteredItems = stockItem.productVarientData.filter(
          (item) => item.sellerId === userId
        );

        return {
          ...stockItem,
          productVarientData: filteredItems,
        };
      }).filter(stockItem => stockItem.productVarientData.length > 0);
      console.log("Filtered Inventory:", filteredInventory);
      
      return filteredInventory;
    } catch (error) {
      console.error("Error fetching inventory:", error);
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const SingleInventory = createAsyncThunk(
  "inventory/SingleInventory",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:4000/api/getStock/${id}`,
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

export const updateInventory = createAsyncThunk(
  "inventory/Edit",
  async (data, { rejectWithValue }) => {
    console.log("data", data);

    try {
      const { _id, ...rest } = data;
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:4000/api/updateStock/${_id}`,
        rest,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const deleteInventory = createAsyncThunk(
  "inventory/delete",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `http://localhost:4000/api/deleteStock/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return id;
    } catch (error) {
      console.log(error);
    }
  }
);

const sellerInventorySlice = createSlice({
  name: "sellerInventory",
  initialState: {
    inventory: [],
    success: false,
    message: "",
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createInventory.pending, (state) => {
        state.loading = true;
        state.message = "Adding INVENTORY...";
      })
      .addCase(createInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.inventory?.push(action.payload);
      })
      .addCase(createInventory.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to add Stock";
      })
      .addCase(getInventory.pending, (state) => {
        state.loading = true;
        state.message = "View INVENTORY...";
      })
      .addCase(getInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.inventory = action.payload;
      })
      .addCase(getInventory.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to View Stock";
      })
      .addCase(deleteInventory.pending, (state) => {
        state.loading = true;
        state.message = "Deleting Inventory...";
      })
      .addCase(deleteInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.inventory = state.inventory.filter(
          (i) => i._id !== action.payload
        );
        state.message = action.payload?.message || "Inventory deleted successfully";
      })
      .addCase(deleteInventory.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to delete Inventory";
      })
      .addCase(SingleInventory.pending, (state) => {
        state.loading = true;
        state.message = "View INVENTORY...";
      })
      .addCase(SingleInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.inventory = action.payload;
      })
      .addCase(SingleInventory.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to View Stock";
      })
      .addCase(updateInventory.pending, (state) => {
        state.loading = true;
        state.message = "Editing inventory...";
      })
      .addCase(updateInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.inventory = state.inventory.map((inv) =>
          inv?._id === action.payload?._id ? action.payload : inv
        );
        state.message =
          action.payload?.message || "inventory updated successfully";
      })
      .addCase(updateInventory.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to update inventory";
      })
      .addCase(getStockBySeller.pending, (state) => {
        state.loading = true;
        state.message = "Fetching inventory...";
      })
      .addCase(getStockBySeller.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.inventory = action.payload;
        state.message = "Inventory fetched successfully";
      })
      .addCase(getStockBySeller.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to fetch inventory";
      });
  },
});

export default sellerInventorySlice.reducer;
