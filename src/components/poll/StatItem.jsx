import React from "react";

const StatItem = ({ statNumber, statLabel }) => {
  return (
    <div class="rounded-xl bg-white/20 p-4 backdrop-blur-md">
      <span class="block text-2xl font-bold">{statNumber}</span>
      <span class="text-sm opacity-90">{statLabel}</span>
    </div>
  );
};

export default StatItem;
