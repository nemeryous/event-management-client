import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="flex min-h-screen bg-white">
          <div className="relative hidden overflow-hidden bg-[#F7F9FB] p-8 lg:flex lg:w-1/2">
            <div className="absolute inset-0 opacity-10">
              <div className="bg-accent absolute top-20 left-10 h-32 w-32 rounded-full"></div>
              <div className="bg-accent absolute right-16 bottom-32 h-24 w-24 rounded-full"></div>
              <div className="bg-accent absolute top-1/2 left-1/4 h-16 w-16 rounded-full"></div>
            </div>
            <div className="relative z-10 flex w-full flex-col items-start justify-center text-white">
              <div className="mb-8">
                <img src="/vku-text-logo.svg" alt="VKU Logo" />
              </div>
              <div className="max-w-lg">
                <h1 className="mb-6 text-3xl leading-tight font-bold">
                  <p className="text-[#212121]">Chào mừng đến với</p>
                  <p className="text-primary">VKU Event Portal</p>
                </h1>
                <p className="mb-8 text-lg leading-relaxed text-[#757575]">
                  Khám phá và tham gia các sự kiện thú vị tại Đại học Công nghệ
                  Thông tin và Truyền thông Việt - Hàn
                </p>
                <img
                  className="h-64 rounded-2xl"
                  src="/banner.png"
                  alt="Banner"
                />
              </div>
            </div>
          </div>
          <Outlet />
        </div>
      </Suspense>
    </div>
  );
};

export default AuthLayout;
