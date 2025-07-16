import React from "react";

const ButtonComponent = ({
  btnBackground,
  btnColor,
  title,
  icon,
  hoverColor,
  hoverRgba,
}) => {
  return (
    <button
      className={`ease-in-out" flex cursor-pointer items-center justify-center gap-[8px] rounded-[10px] bg-[${btnBackground}] px-[25px] py-[15px] text-[1rem] font-semibold text-${btnColor} no-underline transition-all duration-300 hover:-translate-y-[2px] hover:bg-[${hoverColor}] hover:shadow-[0_5px_15px_rgba(${hoverRgba})]`}
    >
      <span>{icon}</span>
      {title}
    </button>
  );
};

export default ButtonComponent;
