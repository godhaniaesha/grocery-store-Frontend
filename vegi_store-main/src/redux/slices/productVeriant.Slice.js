import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:4000/api";

// Fetch all product variants with pagination
export const fetchProductVariants = createAsyncThunk(
  "productVariants/fetchProductVariants",
  async ( { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/allProductVarient`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Fetch product variant by ID
export const fetchProductVariantById = createAsyncThunk(
  'productVariants/fetchProductVariantById',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/getProductVarient/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

const productVariantSlice = createSlice({
  name: "productVariants",
  initialState: {
    variants: [],
    variant: null,
    loading: false,
    error: null,
    totalVariants: 0
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductVariants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductVariants.fulfilled, (state, action) => {
        state.loading = false;
        state.variants = action.payload.data;
        state.totalVariants = action.payload.totalProductVarient;
      })
      .addCase(fetchProductVariants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch product variants';
      })
      .addCase(fetchProductVariantById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductVariantById.fulfilled, (state, action) => {
        state.loading = false;
        state.variant = action.payload.data;
      })
      .addCase(fetchProductVariantById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch product variant';
      });
  },
});

export default productVariantSlice.reducer;