import React from "react";

const SelectInputUser = ({ name, options }) => {
  return (
    <select
      className="focus:border-secondary w-full rounded-[8px] border border-[#e0e0e0] bg-white px-4 py-3 text-sm transition-all duration-300 ease-in-out focus:shadow focus:outline-0"
      name={name}
    >
      {options.map((option) => (
        <option value={option.id}>{option.name}</option>
      ))}
    </select>
  );
};

export default SelectInputUser;
