import React from "react";
import InfoItem from "./InfoItem";

const EventInfo = ({name, address, startTime, endTime, participants}) => {
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
        value={name}
      />
      <InfoItem
        icon="⏰"
        label="Thời gian bắt đầu:"
        value={startTime}
      />
      <InfoItem
        icon="⏰"
        label="Thời gian kết thúc:"
        value={endTime}
      />
      <InfoItem icon="📍" label="Địa điểm:" value={address} />
      <InfoItem icon="👥" label="Đã tham gia:" value={`${participants} người`} />
    </div>
  );
};

export default EventInfo;
