import { configureStore } from "@reduxjs/toolkit";
import incomeReducer from "./features/incomeSlice";
import expenseReducer from "./features/expenseSlice";

export const store = configureStore({
  reducer: {
    income: incomeReducer,
    expense: expenseReducer,
  },
});
