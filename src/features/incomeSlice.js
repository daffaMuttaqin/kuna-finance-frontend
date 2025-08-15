import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/authService";

// Async thunk untuk ambil data incomes
export const fetchIncomes = createAsyncThunk(
  "income/fetchIncomes",
  async () => {
    const res = await API.get("/incomes");
    return res.data;
  }
);

const incomeSlice = createSlice({
  name: "income",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {
    addIncome: (state, action) => {
      state.data.push(action.payload);
    },
    updateIncome: (state, action) => {
      const index = state.data.findIndex((i) => i.id === action.payload.id);
      if (index !== -1) state.data[index] = action.payload;
    },
    deleteIncome: (state, action) => {
      state.data = state.data.filter((i) => i.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIncomes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchIncomes.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchIncomes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { addIncome, updateIncome, deleteIncome } = incomeSlice.actions;
export default incomeSlice.reducer;
