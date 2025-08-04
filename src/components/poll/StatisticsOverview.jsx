import React from "react";

const StatisticsOverview = () => {
  return (
    <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <div class="rounded-xl bg-white p-5 text-center shadow">
        <div class="text-2xl font-bold text-blue-600">673</div>
        <div class="text-sm opacity-90">Tổng lượt bình chọn</div>
      </div>
      <div class="rounded-xl bg-white p-5 text-center shadow">
        <div class="text-2xl font-bold text-indigo-500">287</div>
        <div class="text-sm opacity-90">Người tham gia</div>
      </div>
      <div class="rounded-xl bg-white p-5 text-center shadow">
        <div class="text-2xl font-bold text-pink-500">76%</div>
        <div class="text-sm opacity-90">Tỷ lệ tham gia</div>
      </div>
      <div class="rounded-xl bg-white p-5 text-center shadow">
        <div class="text-2xl font-bold text-green-500">5</div>
        <div class="text-sm opacity-90">Cuộc bình chọn</div>
      </div>
    </div>
  );
};

export default StatisticsOverview;
