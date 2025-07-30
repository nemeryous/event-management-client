import React from "react";

const StatCard = ({statNumber, statLabel}) => {
  return (
    <div class="rounded-[15px] bg-white p-5 text-center shadow-[0_5px_15px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-in-out hover:-translate-y-[3px]">
      <div class="mb-[5px] text-[2rem] font-bold text-[#1e88e5]">{statNumber}</div>
      <div class="color-[#666] text-[0.9rem]">{statLabel}</div>
    </div>
  );
};

export default StatCard;
