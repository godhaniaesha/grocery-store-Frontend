import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Create Subcategory Action
export const createSubcategory = createAsyncThunk(
  'subcategory/createSubcategory',
  async (formData) => {
    try {
      const response = await axios.post('http://localhost:4000/api/createSubCategory', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
);

// Get All Subcategories Action
export const getAllSubcategories = createAsyncThunk(
  'subcategory/getAllSubcategories',
  async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authorization token found');
      }

      const response = await axios.get('http://localhost:4000/api/AllSubCategory', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Subcategory API Response:', response.data.data);
      return response.data.data;
    } catch (error) {
      console.error('Subcategory API Error:', error);
      throw error.response?.data || error.message;
    }
  }
);

// Get Subcategory By Id Action
export const getSubcategoryById = createAsyncThunk(
  'subcategory/getSubcategoryById',
  async (id) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/getSubCategory/${id}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
);

// Update Subcategory Action
export const updateSubcategory = createAsyncThunk(
  'subcategory/updateSubcategory',
  async ({ id, formData }) => {
    try {
      const response = await axios.put(`http://localhost:4000/api/updateSubCategory/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
);

// Delete Subcategory Action
export const deleteSubcategory = createAsyncThunk(
  'subcategory/deleteSubcategory',
  async (id) => {
    try {
      const response = await axios.delete(`http://localhost:4000/api/deleteSubCategory/${id}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
);

const subcategorySlice = createSlice({
  name: 'subcategory',
  initialState: {
    subcategories: [],
    selectedSubcategory: null,
    totalSubcategories: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Subcategory
      .addCase(createSubcategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(createSubcategory.fulfilled, (state, action) => {
        state.loading = false;
        state.subcategories.push(action.payload.data);
      })
      .addCase(createSubcategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Get All Subcategories
      .addCase(getAllSubcategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllSubcategories.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.subcategories = action.payload.data || [];
          state.totalSubcategories = action.payload.totalSubCategory || 0;
        } else {
          state.error = action.payload.message || 'Failed to fetch subcategories';
        }
      })
      .addCase(getAllSubcategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Get Subcategory By Id
      .addCase(getSubcategoryById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSubcategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedSubcategory = action.payload.data;
      })
      .addCase(getSubcategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Update Subcategory
      .addCase(updateSubcategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSubcategory.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.subcategories.findIndex(sub => sub._id === action.payload.data._id);
        if (index !== -1) {
          state.subcategories[index] = action.payload.data;
        }
      })
      .addCase(updateSubcategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Delete Subcategory
      .addCase(deleteSubcategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteSubcategory.fulfilled, (state, action) => {
        state.loading = false;
        state.subcategories = state.subcategories.filter(sub => sub._id !== action.meta.arg);
      })
      .addCase(deleteSubcategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearError } = subcategorySlice.actions;
export default subcategorySlice.reducer;