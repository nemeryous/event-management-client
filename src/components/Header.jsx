import React from "react";

const Header = () => {
  return (
    <header class="animate-slideDown sticky top-0 z-10 bg-white shadow-md">
      <div class="mx-auto max-w-6xl px-5">
        <div class="flex items-center py-4">
          <img
            src="/vku-text-logo.svg"
            alt="Logo"
            class="hidden h-auto w-[30vw] lg:block"
          />
          <img
            src="/mini-logo.png"
            alt="Logo"
            class="block h-auto w-[20vw] lg:hidden"
          />
          <div class="ml-auto text-sm text-[#1e88e5]">Đăng xuất</div>
        </div>
      </div>
    </header>
  );
};

export default Header;