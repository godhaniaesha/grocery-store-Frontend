import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const submitContactForm = createAsyncThunk(
  'contact/submitContactForm',
  async (formData) => {
    try {
      const response = await fetch('http://localhost:4000/api/createContactUs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      console.log("created contact",data)
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      return data;
    } catch (error) {
      throw error;
    }
  }
);

const initialState = {
  loading: false,
  error: null,
  success: false,
  data: null
};

const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    resetContactState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.data = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitContactForm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitContactForm.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.data = action.payload;
      })
      .addCase(submitContactForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { resetContactState } = contactSlice.actions;
export default contactSlice.reducer;