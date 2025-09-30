import React from "react";
import { NavLink } from "react-router-dom";
import "../../Styles/Admin.css";

export default function Sidebar() {
  return (
    <div className="admin-sidebar">
      <h2>Admin Panel</h2>
      <NavLink to="/admin" end>Dashboard</NavLink>
      <NavLink to="/admin/news">News</NavLink>
      <NavLink to="/admin/gallery">Gallery</NavLink>
    </div>
  );
}
