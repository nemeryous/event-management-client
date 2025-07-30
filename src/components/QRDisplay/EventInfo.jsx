import React from "react";
import InfoItem from "./InfoItem";

const EventInfo = () => {
  return (
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
      <InfoItem icon="📍" label="Địa điểm:" value="Hội trường A, Tòa nhà XYZ" />
      <InfoItem icon="👥" label="Đã tham gia:" value="42 người" />
    </div>
  );
};

export default EventInfo;
