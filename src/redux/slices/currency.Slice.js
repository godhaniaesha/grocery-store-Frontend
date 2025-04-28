import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedCurrency: 'USD',
  conversionRates: {
    USD: 1,
    INR: 83.12,
    Dirham: 3.67,
    'NZ Dollar': 1.64
  },
  currencySymbols: {
    USD: '$',
    INR: '₹',
    Dirham: 'د.إ',
    'NZ Dollar': 'NZ$'
  }
};

const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {
    setSelectedCurrency: (state, action) => {
      state.selectedCurrency = action.payload;
    },
    convertPrice: (state, action) => {
      const { amount, fromCurrency = 'USD', toCurrency = state.selectedCurrency } = action.payload;
      const fromRate = state.conversionRates[fromCurrency];
      const toRate = state.conversionRates[toCurrency];
      return (amount * toRate) / fromRate;
    }
  }
});

export const { setSelectedCurrency, convertPrice } = currencySlice.actions;
export const selectCurrency = (state) => state.currency.selectedCurrency;
export const selectCurrencySymbol = (state) => state.currency.currencySymbols[state.currency.selectedCurrency];
export default currencySlice.reducer;