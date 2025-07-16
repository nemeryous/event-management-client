import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header class="animate-slideDown sticky top-0 z-[100] bg-white shadow-[0_2px_15px_rgba(0,0,0,0.1)]">
      <div class="mx-auto max-w-[1200px] px-5">
        <div class="flex items-center justify-between py-4">
          <img
            src="/public/logo.svg"
            alt="Logo"
            class="block h-auto w-[30vw] text-[24px] font-bold text-[#1e88e5]"
          />
          <img
            src="/public/mini-logo.png"
            alt="Logo"
            class="hidden h-auto w-[20vw]"
          />
          <Link>
            <a
              href="#"
              class="flex cursor-pointer items-center gap-2 rounded-full bg-[#1e88e5] px-5 py-2 text-sm text-white no-underline transition-all duration-300 ease-in-out hover:bg-blue-700"
              onclick="goBack()"
            >
              {" "}
              ← Quay lại{" "}
            </a>{" "}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
