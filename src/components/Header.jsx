import React, { useState, useEffect } from "react";
import {
  faUser,
  faSignOutAlt,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearToken } from "@store/slices/authSlice"; // Assuming same Redux slice
import { useLogoutMutation } from "@api/authApi"; // Assuming same API slice
import { rootApi } from "@api/rootApi";

// Component for mobile menu
function MobileMenu({ open, onClose, email, handleLogout }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 md:hidden">
      <div className="animate-slideInRight flex h-full w-64 flex-col gap-4 bg-white p-6 shadow-lg">
        <button
          onClick={onClose}
          className="mb-4 self-end text-2xl font-bold text-[#c52032]"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <FontAwesomeIcon icon={faUser} className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">
              Tài khoản của tôi
            </p>
            <p className="text-xs text-gray-500">{email}</p>
          </div>
        </div>
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `block rounded-lg px-4 py-2 font-semibold transition ${
              isActive
                ? "bg-[#c52032] text-white"
                : "text-[#223b73] hover:bg-[#ffd012] hover:text-[#223b73]"
            }`
          }
          onClick={onClose}
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/admin/events"
          className={({ isActive }) =>
            `block rounded-lg px-4 py-2 font-semibold transition ${
              isActive
                ? "bg-[#223b73] text-white"
                : "text-[#223b73] hover:bg-[#ffd012] hover:text-[#223b73]"
            }`
          }
          onClick={onClose}
        >
          Quản lý sự kiện
        </NavLink>
        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `block rounded-lg px-4 py-2 font-semibold transition ${
              isActive
                ? "bg-[#ffd012] text-[#223b73]"
                : "text-[#223b73] hover:bg-[#ffd012] hover:text-[#223b73]"
            }`
          }
          onClick={onClose}
        >
          Quản lý người dùng
        </NavLink>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="h-4 w-4" />
          Đăng xuất
        </button>
      </div>
      <div
        className="bg-opacity-25 fixed inset-0 z-40 bg-black"
        onClick={onClose}
      />
    </div>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();
  const { email } = useSelector((state) => state.auth.user || {});

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".user-menu-container")) {
        setShowAdminMenu(false);
      }
      if (!event.target.closest(".mobile-menu-container")) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch {
      //
    }
    dispatch(rootApi.util.resetApiState());
    dispatch(clearToken());
    navigate("/login");
    setShowAdminMenu(false);
    setMenuOpen(false);
  };

  const toggleAdminMenu = () => {
    setShowAdminMenu(!showAdminMenu);
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-all duration-300 ${
        isScrolled ? "bg-white/95 shadow-lg backdrop-blur-sm" : "shadow-md"
      }`}
      style={{ padding: "12px 0" }}
    >
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4">
        {/* Logo responsive: show vku-text-logo on md and up, mini-logo on smaller screens */}
        <div className="flex items-center">
          <NavLink
            to="/admin/dashboard"
            className="flex items-center transition-transform hover:scale-105"
          >
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
          </NavLink>
        </div>
        {/* Desktop menu */}
        <nav className="hidden items-center gap-2 md:flex md:gap-4">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `rounded-lg px-4 py-2 font-semibold transition ${
                isActive
                  ? "bg-[#c52032] text-white"
                  : "text-[#223b73] hover:bg-[#ffd012] hover:text-[#223b73]"
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/events"
            className={({ isActive }) =>
              `rounded-lg px-4 py-2 font-semibold transition ${
                isActive
                  ? "bg-[#223b73] text-white"
                  : "text-[#223b73] hover:bg-[#ffd012] hover:text-[#223b73]"
              }`
            }
          >
            Quản lý sự kiện
          </NavLink>
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `rounded-lg px-4 py-2 font-semibold transition ${
                isActive
                  ? "bg-[#ffd012] text-[#223b73]"
                  : "text-[#223b73] hover:bg-[#ffd012] hover:text-[#223b73]"
              }`
            }
          >
            Quản lý người dùng
          </NavLink>
          <div className="user-menu-container relative">
            <button
              onClick={toggleAdminMenu}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 transition-all duration-200 hover:bg-gray-100 hover:text-gray-800"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <FontAwesomeIcon icon={faUser} className="h-4 w-4" />
              </div>
              <span className="hidden md:inline">Tài khoản</span>
            </button>
            {showAdminMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                <div className="border-b border-gray-100 px-4 py-2">
                  <p className="text-sm font-medium text-gray-800">
                    Tài khoản của tôi
                  </p>
                  <p className="text-xs text-gray-500">{email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="h-4 w-4" />
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </nav>
        {/* Hamburger menu for mobile */}
        <button
          className="mobile-menu-container flex h-10 w-10 flex-col items-center justify-center md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Mở menu"
        >
          <FontAwesomeIcon
            icon={menuOpen ? faTimes : faBars}
            className="h-4 w-4 text-gray-600"
          />
        </button>
        {/* Mobile menu */}
        <MobileMenu
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          email={email}
          handleLogout={handleLogout}
        />
      </div>
    </header>
  );
}
