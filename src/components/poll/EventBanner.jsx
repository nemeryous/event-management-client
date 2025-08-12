import React from "react";
import StatItem from "./StatItem";

const EventBanner = () => {
  return (
    <div className="mb-[30px] rounded-2xl bg-gradient-to-br from-[#e53935] to-[#ff6f61] p-[30px] text-white shadow-[0_8px_32px_rgba(229,57,53,0.3)]">
      <div className="grid grid-cols-1 items-center gap-5 text-center md:grid-cols-[1fr_auto] md:text-left">
        <div className="">
          <h2 className="mb-3 text-3xl">Hội thảo công nghệ 2024</h2>
          <div className="flex gap-5 text-sm opacity-90">
            <span>📅 15/12/2024 - 16/12/2024</span>
            <span>📍 Trung tâm Hội nghị Quốc gia</span>
            <span>👥 Tối đa 500 người</span>
          </div>
        </div>
        <div className="flex justify-center gap-[30px] text-center md:justify-start">
            <StatItem statNumber={100} statLabel="Người tham gia" />
            <StatItem statNumber={50} statLabel="Cuộc bình chọn" />
            <StatItem statNumber={10} statLabel="Tổng lượt video" />
        </div>
      </div>
    </div>
  );
};

export default EventBanner;
