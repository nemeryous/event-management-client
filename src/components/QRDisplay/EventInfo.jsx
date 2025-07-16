import React from "react";
import InfoItem from "./InfoItem";

const EventInfo = () => {
  return (
    <div className="mb-5 flex items-center gap-[10px] rounded-2xl text-[1.3rem] bg-white">
      <div className="rounded-[20px] bg-white p-10 text-center shadow-[0_10px_30px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-in-out">
        <div class="relative mx-auto mb-5 flex h-[300px] w-[300px] items-center justify-center overflow-hidden rounded-[15px] border-[4px] border-[#fbc02d] bg-[#1e88e5] text-[1.5rem] font-bold text-white">
          QR CODE
        </div>
        <div className="mb-[30px] rounded-2xl bg-[#f8f9fa] p-[30px]">
          <h3 className="mb-5 flex items-center gap-[10px] text-[1.3rem] text-[#1e88e5]">
            <span className="flex h-5 w-5 items-center justify-center text-[#1e88e5]">
              📅
            </span>{" "}
            Thông tin sự kiện
          </h3>
          <InfoItem
            icon="🎯"
            label="Tên sự kiện:"
            value="Hội thảo Công nghệ 2025"
          />
          <InfoItem
            icon="⏰"
            label="Thời gian:"
            value="10:00 - 12:00, 15/01/2025"
          />
          <InfoItem
            icon="📍"
            label="Địa điểm:"
            value="Hội trường A, Tòa nhà XYZ"
          />
          <InfoItem icon="👥" label="Đã tham gia:" value="42 người" />
        </div>
      </div>
    </div>
  );
};

export default EventInfo;
