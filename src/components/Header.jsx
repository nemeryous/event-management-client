import React from "react";
import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header style={{ background: "#fff", padding: "12px 0", boxShadow: "0 2px 8px #eee" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <img src="/vku-text-logo.svg" alt="VKU Logo" style={{ height: 48 }} />
        <nav className="flex gap-2 md:gap-4">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg font-semibold transition ${isActive ? "bg-[#c52032] text-white" : "text-[#223b73] hover:bg-[#ffd012] hover:text-[#223b73]"}`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/events"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg font-semibold transition ${isActive ? "bg-[#223b73] text-white" : "text-[#223b73] hover:bg-[#ffd012] hover:text-[#223b73]"}`
            }
          >
            Quản lý sự kiện
          </NavLink>
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg font-semibold transition ${isActive ? "bg-[#ffd012] text-[#223b73]" : "text-[#223b73] hover:bg-[#ffd012] hover:text-[#223b73]"}`
            }
          >
            Quản lý người dùng
          </NavLink>
        </nav>
      </div>
    </header>
  );
} 