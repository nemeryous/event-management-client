import { Controller } from "react-hook-form";
import { useState } from "react";

const FormField = ({
  control,
  label,
  name,
  type = "text",
  error,
  isValid,
  // eslint-disable-next-line no-unused-vars
  Component,
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

            <div className="absolute top-1/2 right-4 -translate-y-1/2">
              {error && (
                <svg
                  className="h-5 w-5 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
              {!error && isValid && (
                <svg
                  className="h-5 w-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
          </>
        )}
      />
    </div>
  );
};
export default FormField;
