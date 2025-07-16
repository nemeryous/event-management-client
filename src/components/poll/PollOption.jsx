import TextInputUser from "@components/user/TextInputUser";
import React from "react";

const PollOption = ({ optionNumber }) => {
  return (
    <div
      className="hover:border-secondary mb-4 flex items-center gap-4 rounded-[10px] border border-[#e9ecef] bg-[#f8f9fa] p-4 transition-all duration-300 ease-in-out hover:-translate-y-0.5"
      data-option={optionNumber}
    >
      <div className="bg-secondary flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white">
        {optionNumber}
      </div>
      <div className="grid grid-cols-[2fr_1fr] gap-4 flex-1">
        <TextInputUser type={"text"} placeholder={"Nhập nội dung lựa chọn"} />
        <TextInputUser type={"url"} placeholder={"URL hình ảnh (tùy chọn)"} />
      </div>
      <button
        type="button"
        className="bg-primary flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-0 text-[16px] text-white transition-all duration-300 ease-in-out hover:scale-[1.1] hover:bg-[#d32f2f]"
        onclick="removeOption(this)"
      >
        ×
      </button>
    </div>
  );
};

export default PollOption;
