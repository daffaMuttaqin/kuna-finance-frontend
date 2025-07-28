import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/dashboard";
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
