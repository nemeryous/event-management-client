import React from "react";
import StatItem from "./StatItem";

const EventBanner = () => {
  return (
    <div class="mb-8 rounded-2xl bg-gradient-to-br from-[#e53935] to-[#ff6f61] p-8 text-white shadow-[0_8px_32px_rgba(229,57,53,0.3)]">
      <div class="grid grid-cols-1 items-center gap-5 text-center md:grid-cols-[1fr_auto] md:text-left">
        <div class="space-y-3">
          <h2 class="text-2xl font-bold md:text-3xl">
            Hội thảo Công nghệ 2024
          </h2>
          <div class="flex flex-col justify-center gap-4 text-sm opacity-90 md:flex-row md:justify-start">
            <span>📅 15/12/2024 - 16/12/2024</span>
            <span>📍 Trung tâm Hội nghị Quốc gia</span>
            <span>👥 Tối đa 500 người</span>
          </div>
        </div>
        <div class="flex flex-col justify-center gap-5 text-center sm:flex-row md:justify-end">
          <StatItem statNumber="120" statLabel="Người tham gia" />
          <StatItem statNumber="30" statLabel="Bình chọn" />
          <StatItem statNumber="5" statLabel="Sự kiện" />
        </div>
      </div>
    </div>
  );
};

export default EventBanner;
