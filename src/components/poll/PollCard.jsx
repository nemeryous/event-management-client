import React from "react";

const PollCard = ({ title, badge }) => {
  return (
    <div class="space-y-6 rounded-xl bg-white p-6 shadow-md">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-800">
          Kết quả bình chọn chi tiết
        </h3>
        <span class="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-600">
          Đang diễn ra
        </span>
      </div>
      <slot />
    </div>
  );
};

export default PollCard;
