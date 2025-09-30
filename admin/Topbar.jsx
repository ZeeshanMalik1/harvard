import React from "react";
import "../../Styles/Admin.css";

export default function Topbar({ logout }) {
  return (
    <div className="admin-topbar">
      <h1>School Admin Panel</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
