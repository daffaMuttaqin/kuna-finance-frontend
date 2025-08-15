// src/features/expenseSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/authService";

// Ambil semua expenses
export const fetchExpenses = createAsyncThunk(
  "expense/fetchExpenses",
  async () => {
    const res = await API.get("/expenses");
    return res.data;
  }
);

// Ambil summary per kategori per bulan
export const fetchExpenseCategorySummary = createAsyncThunk(
  "expense/fetchExpenseCategorySummary",
  async ({ month, year }) => {
    const res = await API.get(
      `/expenses/summary/category?month=${month}&year=${year}`
    );
    return res.data;
  }
);

const expenseSlice = createSlice({
  name: "expense",
  initialState: {
    data: [],
    categoryData: { Produksi: 0, Operasional: 0, Marketing: 0 },
    loading: false,
    error: null,
  },
  reducers: {
    addExpense: (state, action) => {
      state.data.push(action.payload);
    },
    updateExpense: (state, action) => {
      const index = state.data.findIndex((e) => e.id === action.payload.id);
      if (index !== -1) state.data[index] = action.payload;
    },
    deleteExpense: (state, action) => {
      state.data = state.data.filter((e) => e.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchExpenseCategorySummary.fulfilled, (state, action) => {
        const updatedData = { Produksi: 0, Operasional: 0, Marketing: 0 };
        action.payload.forEach((item) => {
          updatedData[item.category] = Number(item.total);
        });
        state.categoryData = updatedData;
      });
  },
});

export const { addExpense, updateExpense, deleteExpense } =
  expenseSlice.actions;
export default expenseSlice.reducer;
