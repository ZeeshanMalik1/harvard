import React from "react";

export default function Topbar({ onLogout }){
  return (
    <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding: "10px 20px", borderBottom: "1px solid #eee"}}>
      <div>Welcome Admin</div>
      <div>
        <button onClick={onLogout}>Logout</button>
      </div>
    </div>
  );
}
