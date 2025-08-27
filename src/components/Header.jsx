import React, { useState } from "react";
import { NavLink } from "react-router-dom";

// Component cho menu mobile
function MobileMenu({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 md:hidden">
      <div className="animate-slideInRight flex h-full w-64 flex-col gap-4 bg-white p-6 shadow-lg">
        <button
          onClick={onClose}
          className="mb-4 self-end text-2xl font-bold text-[#c52032]"
        >
          ×
        </button>
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `block rounded-lg px-4 py-2 font-semibold transition ${isActive ? "bg-[#c52032] text-white" : "text-[#223b73] hover:bg-[#ffd012] hover:text-[#223b73]"}`
          }
          onClick={onClose}
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/admin/events"
          className={({ isActive }) =>
            `block rounded-lg px-4 py-2 font-semibold transition ${isActive ? "bg-[#223b73] text-white" : "text-[#223b73] hover:bg-[#ffd012] hover:text-[#223b73]"}`
          }
          onClick={onClose}
        >
          Quản lý sự kiện
        </NavLink>
        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `block rounded-lg px-4 py-2 font-semibold transition ${isActive ? "bg-[#ffd012] text-[#223b73]" : "text-[#223b73] hover:bg-[#ffd012] hover:text-[#223b73]"}`
          }
          onClick={onClose}
        >
          Quản lý người dùng
        </NavLink>
      </div>
    </div>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="bg-white shadow" style={{ padding: "12px 0" }}>
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4">
        {/* Logo responsive: hiện vku-text-logo ở md trở lên, mini-logo ở nhỏ hơn md */}
        <div className="flex items-center">
          <img
            src="/vku-text-logo.svg"
            alt="VKU Logo"
            className="hidden h-12 md:block"
          />
          <img
            src="/mini-logo.png"
            alt="VKU Mini Logo"
            className="h-10 md:hidden"
          />
        </div>
        {/* Menu desktop */}
        <nav className="hidden gap-2 md:flex md:gap-4">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `rounded-lg px-4 py-2 font-semibold transition ${isActive ? "bg-[#c52032] text-white" : "text-[#223b73] hover:bg-[#ffd012] hover:text-[#223b73]"}`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/events"
            className={({ isActive }) =>
              `rounded-lg px-4 py-2 font-semibold transition ${isActive ? "bg-[#223b73] text-white" : "text-[#223b73] hover:bg-[#ffd012] hover:text-[#223b73]"}`
            }
          >
            Quản lý sự kiện
          </NavLink>
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `rounded-lg px-4 py-2 font-semibold transition ${isActive ? "bg-[#ffd012] text-[#223b73]" : "text-[#223b73] hover:bg-[#ffd012] hover:text-[#223b73]"}`
            }
          >
            Quản lý người dùng
          </NavLink>
        </nav>
        {/* Hamburger menu cho mobile */}
        <button
          className="flex h-10 w-10 flex-col items-center justify-center md:hidden"
          onClick={() => setMenuOpen(true)}
          aria-label="Mở menu"
        >
          <span className="mb-1 block h-1 w-7 rounded bg-[#223b73]"></span>
          <span className="mb-1 block h-1 w-7 rounded bg-[#223b73]"></span>
          <span className="block h-1 w-7 rounded bg-[#223b73]"></span>
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
