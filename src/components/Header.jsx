import React, { useState } from "react";
import { NavLink } from "react-router-dom";

// Component cho menu mobile
function MobileMenu({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex justify-end md:hidden">
      <div className="bg-white w-64 h-full shadow-lg p-6 flex flex-col gap-4 animate-slideInRight">
        <button onClick={onClose} className="self-end text-2xl text-[#c52032] font-bold mb-4">×</button>
        <NavLink to="/admin/dashboard" className={({ isActive }) => `block px-4 py-2 rounded-lg font-semibold transition ${isActive ? "bg-[#c52032] text-white" : "text-[#223b73] hover:bg-[#ffd012] hover:text-[#223b73]"}`} onClick={onClose}>Dashboard</NavLink>
        <NavLink to="/admin/events" className={({ isActive }) => `block px-4 py-2 rounded-lg font-semibold transition ${isActive ? "bg-[#223b73] text-white" : "text-[#223b73] hover:bg-[#ffd012] hover:text-[#223b73]"}`} onClick={onClose}>Quản lý sự kiện</NavLink>
        <NavLink to="/admin/users" className={({ isActive }) => `block px-4 py-2 rounded-lg font-semibold transition ${isActive ? "bg-[#ffd012] text-[#223b73]" : "text-[#223b73] hover:bg-[#ffd012] hover:text-[#223b73]"}`} onClick={onClose}>Quản lý người dùng</NavLink>
      </div>
    </div>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="bg-white shadow" style={{ padding: "12px 0" }}>
      <div className="max-w-[1200px] mx-auto flex items-center justify-between px-4">
        {/* Logo responsive: hiện vku-text-logo ở md trở lên, mini-logo ở nhỏ hơn md */}
        <div className="flex items-center">
          <img src="/vku-text-logo.svg" alt="VKU Logo" className="h-12 hidden md:block" />
          <img src="/mini-logo.png" alt="VKU Mini Logo" className="h-10 md:hidden" />
        </div>
        {/* Menu desktop */}
        <nav className="hidden md:flex gap-2 md:gap-4">
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
        {/* Hamburger menu cho mobile */}
        <button className="md:hidden flex flex-col justify-center items-center w-10 h-10" onClick={() => setMenuOpen(true)} aria-label="Mở menu">
          <span className="block w-7 h-1 bg-[#223b73] rounded mb-1"></span>
          <span className="block w-7 h-1 bg-[#223b73] rounded mb-1"></span>
          <span className="block w-7 h-1 bg-[#223b73] rounded"></span>
        </button>
        {/* Menu mobile */}
        <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      </div>
    </header>
  );
}
// CSS animation cho menu mobile (có thể thêm vào index.css hoặc file global)
// .animate-slideInRight { animation: slideInRight 0.2s ease; }
// @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } } 
