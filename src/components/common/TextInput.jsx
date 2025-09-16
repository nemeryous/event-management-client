const TextInput = ({
  onChange,
  value,
  name,
  type = "text",
  className = "",
  isValid,
  ...props
}) => {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className={className}
      data-isvalid={isValid} // Sử dụng như thuộc tính tùy chỉnh
      {...props}
    />
  );
};

export default TextInput;