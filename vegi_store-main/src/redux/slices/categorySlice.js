import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Create async thunk for fetching all categories
export const fetchCategories = createAsyncThunk(
  'category/fetchAll',
  async ( { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/api/allCategory`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);



const categorySlice = createSlice({
  name: 'category',
  initialState: {
    categories: [],
    totalCategories: 0,
    isLoading: false,
    error: null,
    currentCategory: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentCategory: (state, action) => {
      state.currentCategory = action.payload;
    }
  },
  extraReducers: (builder) => {
    // Fetch categories
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload.data;
        state.totalCategories = action.payload.totalCategory;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
     
  }
});

export const { clearError, setCurrentCategory } = categorySlice.actions;
export default categorySlice.reducer;