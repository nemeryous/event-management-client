import React from "react";

const CheckboxInput = ({
  onChange,
  checked,
  name,
  className = "",
  ...props
}) => {
  return (
    <input
      type="checkbox"
      name={name}
      checked={checked}
      onChange={onChange}
      className={className}
      {...props}
    />
  );
};

export default CheckboxInput;
