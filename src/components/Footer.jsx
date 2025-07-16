import React from "react";

const Footer = () => {
  return (
    <footer class="bg-[#2c3e50] text-white py-10 text-center mt-[60px]">
      <div class="mx-auto max-w-[1200px] px-5">
        <div class="flex justify-between items-center flex-wrap gap-5">
          <div>© 2025 Công ty XYZ. Hỗ trợ: support@example.com</div>
          <div class="flex gap-[30px]">
            <a href="#">Chính sách bảo mật</a>
            <a href="#">Điều khoản sử dụng</a>
            <a href="#">Hỗ trợ</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
