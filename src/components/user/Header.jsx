import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLogoutMutation } from "@api/rootApi";
import { clearToken } from "@store/slices/authSlice";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [logout] = useLogoutMutation();

  const canGoBack =
    location.pathname !== "/dashboard" &&
    window.history.state &&
    window.history.state.idx > 0;

  const handleBack = () => {
    navigate(-1);
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch {
      // ignore error
    }
    dispatch(clearToken());
    navigate("/login");
  };

  return (
    <header className="animate-slideDown sticky top-0 z-10 bg-white shadow-md">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex items-center py-4">
          <img
            src="/vku-text-logo.svg"
            alt="Logo"
            className="hidden h-auto w-[30vw] lg:block"
          />
          <img
            src="/mini-logo.png"
            alt="Logo"
            className="block h-auto w-[20vw] lg:hidden"
          />
          <button
            className="text-secondary ml-auto text-sm"
            onClick={handleLogout}
          >
            Đăng xuất
          </button>
          {canGoBack && (
            <Link
              to={"#"}
              onClick={handleBack}
              className="bg-secondary flex cursor-pointer items-center gap-2 rounded-3xl px-5 py-2 text-sm text-white shadow transition-all duration-300 ease-in-out hover:-translate-y-0.5"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              Quay lại
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
