import React, { forwardRef } from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: string;
  placeholder?: string;
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  id?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = "text",
      placeholder,
      value,
      defaultValue,
      onChange,
      name,
      id,
      disabled = false,
      required = false,
      className = "",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "h-[48px] w-full rounded-[16px] bg-white border border-[#E5E5E5] px-4 text-[#1F1F1F] placeholder:text-[#666666] transition-all duration-300 ease-in-out focus:border-[#A67C52] focus:ring-1 focus:ring-[#A67C52] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50";

    const combinedClassName = `${baseStyles} ${className}`.trim();

    return (
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        name={name}
        id={id}
        disabled={disabled}
        required={required}
        className={combinedClassName}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
