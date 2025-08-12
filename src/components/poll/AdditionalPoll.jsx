import React from "react";

const AdditionalPoll = ({ openPopup }) => {
  return (
    <div className="animate-fadeInUP rounded-2xl bg-white p-[25px] shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition duration-300 ease-in-out hover:-translate-y-[5px] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-[1.3rem] font-semibold text-[#333]">
          Thống kê theo câu hỏi
        </h3>
        <button
          onClick={() => openPopup(true)}
          className="cursor-pointer rounded-lg border-none bg-[#1e88e5] px-5 py-2.5 text-[0.9rem] font-medium text-white transition-all duration-300 ease-in-out hover:translate-y-[-2px] hover:bg-[#1565c0]"
        >
          Chọn câu hỏi
        </button>
      </div>
      <div className="flex min-h-[200px] items-center justify-center">
        <div className="px-5 py-[60px] text-center text-[#666]">
          <div className="mb-5 text-[4rem] opacity-50">📊</div>
          <div className="text-[1.1rem] text-[#999]">
            Chọn câu hỏi để xem thống kê chi tiết
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdditionalPoll;
