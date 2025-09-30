import React from "react";
import { Navigate, Outlet } from "react-router-dom";
// NOTE: Make sure these paths are correct in your project structure
import '../admin/pages/pages.css'
import Sidebar from "./components/Sidebar"; 
import Topbar from "./components/Topbar";

export default function ProtectedLayout() {
  const token = localStorage.getItem("token");

  // If token is missing, redirect to login page
  if (!token) {
    // The replace prop ensures the user can't hit the back button to get to the protected page
    return <Navigate to="/admin/login" replace />; 
  }

  // logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    // Hard refresh to clear all state and force a new render/redirection
    window.location.href = "/admin/login"; 
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }} className="admin">
      {/* Assuming Sidebar is a simple, presentational component */}
      <Sidebar /> 
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Assuming Topbar receives the logout handler */}
        <Topbar onLogout={handleLogout} /> 
        <div style={{ padding: 20, flexGrow: 1 }} className="adminPages">
          {/* Nested protected routes will load here */}
          <Outlet />
        </div>
      </div>
    </div>
  );
}