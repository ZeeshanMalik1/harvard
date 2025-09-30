import React from "react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/admin/events", label: "Events" },
  { to: "/admin/teachers", label: "Teachers" },
  { to: "/admin/gallery", label: "Gallery" },
  { to: "/admin/site-settings", label: "Slider" },
];

export default function Sidebar() {
  return (
    <aside style={{ width: 220, background: "#1f2937", color: "#fff", minHeight: "100vh", padding: 20 ,height:"100vh"}}>
      <h2 style={{ marginBottom: 20 }}>School Admin</h2>
      <nav>
        {links.map((l) => (
          <div key={l.to} style={{ margin: "10px 0" }}>
            <NavLink
              to={l.to}
              style={({ isActive }) => ({
                color: isActive ? "#60a5fa" : "#fff",
                textDecoration: "none",
              })}
            >
              {l.label}
            </NavLink>
          </div>
        ))}
      </nav>
    </aside>
  );
}
