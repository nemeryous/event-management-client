import React from "react";

const TimeForm = () => {
  return (
    <div class="mb-[25px]">
      <label class="mb-2 block text-[14px] font-semibold text-[#1e88e5]">
        Thời gian bắt đầu *
      </label>

      <input
        type="datetime-local"
        class="w-full rounded-[8px] border-2 border-[#e0e0e0] bg-white px-4 py-3 text-[14px] transition-all duration-300 ease-in-out"
        id="startTime"
        required
      />
    </div>
  );
};

export default TimeForm;
