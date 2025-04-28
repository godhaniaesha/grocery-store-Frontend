import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    searchQuery: '',
    searchResults: [],
    loading: false,
    error: null
};

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
        },
        setSearchResults: (state, action) => {
            state.searchResults = action.payload;
        },
        clearSearch: (state) => {
            state.searchQuery = '';
            state.searchResults = [];
            state.error = null;
        }
    }
});

export const { setSearchQuery, setSearchResults, clearSearch } = searchSlice.actions;
export default searchSlice.reducer; 