import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import InputIncome from "./pages/InputIncome";
import InputExpense from "./pages/InputExpense";
import Income from "./pages/Income";
import Expense from "./pages/Expense";
import ActivityLogs from "./pages/ActivityLogs";
import ProtectedRoutes from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Customer from "./pages/Customer";
import NoSidebarLayout from "./layouts/NoSidebarLayout";
import SidebarLayout from "./layouts/SidebarLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Tanpa Sidebar */}
        <Route
          path="/login"
          element={
            <NoSidebarLayout>
              <Login />
            </NoSidebarLayout>
          }
        />
        <Route
          path="/"
          element={
            <NoSidebarLayout>
              <Home />
            </NoSidebarLayout>
          }
        />

        {/* Routes DENGAN Sidebar */}
        <Route element={<SidebarLayout />}>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoutes>
                <Dashboard />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/customer"
            element={
              <ProtectedRoutes>
                <Customer />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/inputIncome"
            element={
              <ProtectedRoutes>
                <InputIncome />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/income"
            element={
              <ProtectedRoutes>
                <Income />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/inputExpense"
            element={
              <ProtectedRoutes>
                <InputExpense />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/expense"
            element={
              <ProtectedRoutes>
                <Expense />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/activityLogs"
            element={
              <ProtectedRoutes>
                <ActivityLogs />
              </ProtectedRoutes>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
