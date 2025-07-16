import React from "react";

const InfoItem = ({ icon, label, value }) => {
  return (
    <div className="mb-4 flex items-center gap-3 border-b border-b-[#eee] px-0 py-[10px]">
      <span className="flex h-5 w-5 items-center justify-center text-[#1e88e5]">
        {icon}
      </span>
      <span className="min-w-[100px] font-semibold text-[#333]">{label}</span>
      <span className="flex-1/2 text-[#666]">{value}</span>
    </div>
  );
};

export default InfoItem;
