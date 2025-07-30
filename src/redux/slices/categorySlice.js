import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Create async thunk for fetching all categories
export const fetchCategories = createAsyncThunk(
  'category/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      // alert("fetching")
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/api/allCategory`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      console.log(data,"data");
      
      return data;
    } catch (error) {
      console.error('Failed to load categories:', error);
      if (
        error.response.data.message == 'Failed to load categories. Please try again.' ||
        error.message == 'jwt expired' // add any other auth errors you want to handle
      ) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch(userLogout());
      }
      return rejectWithValue(error.response.data.message);
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