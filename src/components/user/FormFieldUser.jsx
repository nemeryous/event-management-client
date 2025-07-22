import React from "react";

// eslint-disable-next-line no-unused-vars
const FormFieldUser = ({ onChange, value, label, Component }) => {
  return (
    <div class="mb-[25px]">
      <label class="mb-2 block text-[14px] font-semibold text-[#1e88e5]">
        {label} *
      </label>
      <Component />
    </div>
  );
};

export default FormFieldUser;
