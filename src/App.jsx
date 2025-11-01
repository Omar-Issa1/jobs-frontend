import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import JobsList from "./pages/JobsList";
import Login from "./pages/Login";
import Register from "./pages/Register";
import JobForm from "./components/JobForm";
import EditJob from "./pages/EditJob";

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <JobsList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add"
          element={
            <ProtectedRoute>
              <JobForm mode="create" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit/:id"
          element={
            <ProtectedRoute>
              <EditJob />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
