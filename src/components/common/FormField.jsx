import { Controller } from "react-hook-form";
import { useState } from "react";

const FormField = ({
  control,
  label,
  name,
  type = "text",
  // eslint-disable-next-line no-unused-vars
  Component,
  isValid,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e) => {
    setIsFocused(false);
    setHasValue(e.target.value.length > 0);
  };

  const handleChange = (onChange) => (e) => {
    setHasValue(e.target.value.length > 0);
    onChange(e);
  };

  return (
    <div className="relative mb-4">
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value, name } }) => (
          <>
            <Component
              type={type}
              name={name}
              value={value}
              onChange={handleChange(onChange)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className={`peer w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base transition-all duration-300 hover:border-blue-500 focus:border-blue-500 focus:outline-none ${hasValue || isFocused || value ? "pt-6 pb-2" : ""}`}
              placeholder=" "
              {...props}
            />
            {isValid && (
              <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2">
                <svg
                  className="inline-block text-green-500"
                  width="18"
                  height="18"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.629 14.571a1 1 0 0 1-1.414 0l-3.243-3.243a1 1 0 1 1 1.414-1.414l2.536 2.536 6.95-6.95a1 1 0 1 1 1.414 1.414l-7.657 7.657z"
                    fill="currentColor"
                  />
                </svg>
              </span>
            )}
            <label
              className={`pointer-events-none absolute left-4 text-gray-500 transition-all duration-300 ${
                hasValue || isFocused || value
                  ? "top-1 text-xs font-medium text-yellow-500"
                  : "top-3 text-base"
              }`}
            >
              {label}
            </label>
          </>
        )}
      />
    </div>
  );
};
export default FormField;
