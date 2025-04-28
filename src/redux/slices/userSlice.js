import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Create async thunk for user deletion
export const deleteUser = createAsyncThunk(
  'user/delete',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/deleteUser', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data);
      }

      return data;
    } catch (error) {
      return rejectWithValue({ message: error.message });
    }
  }
);

// Create async thunk for user registration
export const registerUser = createAsyncThunk(
  'user/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:4000/api/createUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: userData.fullName.split(' ')[0],
          lastName: userData.fullName.split(' ').slice(1).join(' '),
          email: userData.email,
          password: userData.password,
          mobileNo: userData.mobileNo // Add mobile number
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data);
      }

      // Store token and user data in localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      return rejectWithValue({ message: error.message });
    }
  }
);

// Add new async thunk for getting user data
export const updateUser = createAsyncThunk(
  'user/update',
  async (userData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      Object.keys(userData).forEach(key => {
        if (userData[key] instanceof File) {
          formData.append(key, userData[key]);
        } else {
          formData.append(key, userData[key]);
        }
      });

      const response = await fetch('http://localhost:4000/api/updateUser', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data);
      }

      return data;
    } catch (error) {
      return rejectWithValue({ message: error.message });
    }
  }
);

export const getUserData = createAsyncThunk(
  'user/getData',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
      const response = await fetch('http://localhost:4000/api/getUser', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data);
      }

      // console.log('User Data:', data); // Log the received data
      return data;
    } catch (error) {
      return rejectWithValue({ message: error.message });
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    isLoading: false,
    error: null,
    registrationSuccess: false,
    registeredEmail: null,
    userData: null, // Add new state for user data
    deleteSuccess: false
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetRegistration: (state) => {
      state.registrationSuccess = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.registrationSuccess = true;
        state.registeredEmail = action.payload.user.email;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Add new cases for getUserData
      .addCase(getUserData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userData = action.payload.data;
        state.error = null;
      })
      .addCase(getUserData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.userData = null;
      })
      // Add cases for updateUser
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userData = action.payload.data;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Add cases for deleteUser
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.deleteSuccess = false;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        state.deleteSuccess = true;
        state.userData = null;
        state.user = null;
        localStorage.removeItem('token');
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.deleteSuccess = false;
      });
  },
});

export const { clearError, resetRegistration } = userSlice.actions;
export default userSlice.reducer;