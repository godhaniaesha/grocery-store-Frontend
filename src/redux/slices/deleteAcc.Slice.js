import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const deleteAcc = createAsyncThunk(
  "delete Account",
  async (password, { rejectWithValue }) => {
    console.log(password);
    
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put("http://localhost:4000/api/updateUser", {
        deactive_start: new Date(),
        password: password,      
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("response",response.data);
      if (response.data.message === "Password Not Match") {
        return rejectWithValue("Password Not Match");
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Password Not Match");
    }
  }
);

const deleteAccSlice = createSlice({
  name: "coupons",
  initialState: {
    deleteAccount: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(deleteAcc.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAcc.fulfilled, (state, action) => {
        state.loading = false;
        state.deleteAccount = action.payload.data;
      })
      .addCase(deleteAcc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default deleteAccSlice.reducer;
