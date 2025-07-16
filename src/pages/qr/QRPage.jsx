import QRDisplay from "@components/QRDisplay";
import React from "react";

const QRPage = () => {
  return (
    // main-content
    <main className="bg-gradient-to-br from-gray-100 to-blue-200 px-0 py-10">
      <div className="mx-auto my-0 max-w-[1200px] px-5 py-0">
        <div className="mb-[30px] text-center">
          <h1 className="mb-[10px] text-[2.5rem] font-bold text-[#1e88e5]">
            Mã QR Điểm Danh/Tham Gia
          </h1>
          <p className="text-[1.1rem] text-[#666]">
            Quét mã QR để tham gia sự kiện
          </p>
        </div>
        {/* QR container */}
        <div className="mt-10 grid grid-cols-2 gap-10">
          <QRDisplay />
          <QRDisplay isStat={true} />
        </div>
      </div>
    </main>
  );
};

export default QRPage;
