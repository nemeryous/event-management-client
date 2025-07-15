import { faFacebookF, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import {
  faGlobe,
  faInbox,
  faLocationDot,
  faPhone,
  faPlay,
  faZ,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#2196f3] text-white pt-10 pb-10 relative overflow-hidden">
      <div className="w-full h-1 bg-[#ffd012] absolute top-0 left-0"></div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Cột 1 */}
          <div className="text-center sm:text-left flex flex-col items-center sm:items-start">
            <div className="mb-5 flex items-center gap-4 justify-center sm:justify-start">
              <img
                src="/mini-logo.png"
                alt="VKU Logo"
                className="h-auto w-20 p-1"
              />
            </div>
            <p className="text-sm leading-normal text-white/80 max-w-xs">
              Đào tạo nguồn nhân lực chất lượng cao trong lĩnh vực CNTT, hướng tới sự phát triển bền vững và hội nhập quốc tế.
            </p>
          </div>

          {/* Cột 2 */}
          <div className="text-center sm:text-left">
            <h3 className="text-[#ffd012] font-bold mb-4 pb-2 text-lg border-b-2 border-[#ffd012] inline-block">Liên kết nhanh</h3>
            <ul className="list-none space-y-1">
              {[
                "Trang chủ",
                "Giới thiệu",
                "Tin tức & Sự kiện",
                "Thư viện",
                "Hỏi đáp",
                "Liên hệ",
              ].map((item, idx) => (
                <li key={idx} className="group">
                  <a href="#" className="hover:text-[#ffd012] flex items-center gap-2 text-sm text-white/80 no-underline duration-300 group-hover:translate-x-1">
                    <span className="opacity-0 duration-300 group-hover:opacity-100">→</span>{item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 3 */}
          <div className="text-center sm:text-left">
            <h3 className="text-[#ffd012] font-bold mb-4 pb-2 text-lg border-b-2 border-[#ffd012] inline-block">Đào tạo</h3>
            <ul className="list-none space-y-1">
              {[
                "Tuyển sinh",
                "Chương trình đào tạo",
                "Đào tạo đại học",
                "Đào tạo sau đại học",
                "Đào tạo liên tục",
                "Hợp tác quốc tế",
              ].map((item, idx) => (
                <li key={idx} className="group">
                  <a href="#" className="hover:text-[#ffd012] flex items-center gap-2 text-sm text-white/80 no-underline duration-300 group-hover:translate-x-1">
                    <span className="opacity-0 duration-300 group-hover:opacity-100">→</span>{item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 4 */}
          <div className="text-center sm:text-left flex flex-col items-center sm:items-start">
            <h3 className="text-[#ffd012] font-bold mb-4 pb-2 text-lg border-b-2 border-[#ffd012] inline-block">Thông tin liên hệ</h3>
            <ul className="list-none space-y-2 w-full">
              <li className="flex items-center gap-2 text-sm text-white/80 justify-center sm:justify-start">
                <span className="bg-[#ffd012] flex size-5 shrink-0 items-center justify-center rounded-full text-xs text-[#223b73]">
                  <FontAwesomeIcon icon={faLocationDot} />
                </span>
                <span>470 Trần Đại Nghĩa, Hòa Quý, Ngũ Hành Sơn, Đà Nẵng</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-white/80 justify-center sm:justify-start">
                <span className="bg-[#ffd012] flex size-5 shrink-0 items-center justify-center rounded-full text-xs text-[#223b73]">
                  <FontAwesomeIcon icon={faPhone} />
                </span>
                <span>(0236) 3667 117</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-white/80 justify-center sm:justify-start">
                <span className="bg-[#ffd012] flex size-5 shrink-0 items-center justify-center rounded-full text-xs text-[#223b73]">
                  <FontAwesomeIcon icon={faInbox} />
                </span>
                <span>info@vku.udn.vn</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-white/80 justify-center sm:justify-start">
                <span className="bg-[#ffd012] flex size-5 shrink-0 items-center justify-center rounded-full text-xs text-[#223b73]">
                  <FontAwesomeIcon icon={faGlobe} />
                </span>
                <span>www.vku.udn.vn</span>
              </li>
            </ul>
            <div className="mt-5 flex gap-4 justify-center sm:justify-start">
              <a className="hover:bg-[#ffd012] flex size-10 items-center justify-center rounded-full bg-black/20 text-lg text-white no-underline duration-300 ease-in-out hover:-translate-y-1 hover:text-[#223b73] hover:opacity-100" href="#" title="Facebook">
                <FontAwesomeIcon icon={faFacebookF} />
              </a>
              <a className="hover:bg-[#ffd012] flex size-10 items-center justify-center rounded-full bg-black/20 text-lg text-white no-underline duration-300 ease-in-out hover:-translate-y-1 hover:text-[#223b73] hover:opacity-100" href="#" title="YouTube">
                <FontAwesomeIcon icon={faPlay} />
              </a>
              <a className="hover:bg-[#ffd012] flex size-10 items-center justify-center rounded-full bg-black/20 text-lg text-white no-underline duration-300 ease-in-out hover:-translate-y-1 hover:text-[#223b73] hover:opacity-100" href="#" title="LinkedIn">
                <FontAwesomeIcon icon={faLinkedinIn} />
              </a>
              <a className="hover:bg-[#ffd012] flex size-10 items-center justify-center rounded-full bg-black/20 text-lg text-white no-underline duration-300 ease-in-out hover:-translate-y-1 hover:text-[#223b73] hover:opacity-100" href="#" title="Zalo">
                <FontAwesomeIcon icon={faZ} />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/30 flex flex-col md:flex-row flex-wrap items-center justify-between gap-4 pt-5 text-center md:text-left">
          <p className="text-sm text-white/80">
            © 2024 Trường Đại học Công nghệ Thông tin và Truyền thông Việt – Hàn. Tất cả quyền được bảo lưu.
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-white/80 justify-center md:justify-end">
            <a href="#" className="hover:text-[#ffd012]">Chính sách bảo mật</a>
            <a href="#" className="hover:text-[#ffd012]">Điều khoản sử dụng</a>
            <a href="#" className="hover:text-[#ffd012]">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
