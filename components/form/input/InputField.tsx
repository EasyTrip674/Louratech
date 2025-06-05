import { formatCurrency } from "@/lib/utils";
import React, { FC } from "react";
import Label from "../Label";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  success?: boolean;
  error?: boolean;
  isAmount?:boolean;
  currentAmount?:number;
  currency?:string;
  label?: string;
  required?: boolean;
  hint?: string; // Optional hint text
}

const Input: FC<InputProps> = ({
  type = "text",
  id,
  name,
  placeholder,
  currency,
  label,
  defaultValue,
  onChange,
  className = "",
  min,
  max,
  step,
  currentAmount,
  disabled = false,
  success = false,
  error = false,
  hint,
  required = false,
  isAmount= false,
  ...props
}) => {
  // Determine input styles based on state (disabled, success, error)
  let inputClasses = `h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${className}`;

  // Add styles for the different states
  if (disabled) {
    inputClasses += ` text-gray-500 border-gray-300 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700`;
  } else if (error) {
    inputClasses += ` text-error-800 border-error-500 focus:ring-3 focus:ring-error-500/10  dark:text-error-400 dark:border-error-500`;
  } else if (success) {
    inputClasses += ` text-success-500 border-success-400 focus:ring-success-500/10 focus:border-success-300  dark:text-success-400 dark:border-success-500`;
  } else {
    inputClasses += ` bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800`;
  }

  return (
  <>
  {label && (
      <Label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
      {label} {required && <span className="text-error-500">*</span>}
    </Label>
  )}
    <div className="relative">
      <input
        {...props}
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className={inputClasses}
      />

      {/* Optional Hint Text */}
      {hint && (
        <p
          className={`mt-1.5 text-xs ${
            error
              ? "text-error-500"
              : success
              ? "text-success-500"
              : "text-gray-500"
          }`}
        >
          {hint}
        </p>
      )}
    </div>

  {
    isAmount && currentAmount ? 
    currentAmount > 0 && (
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {formatCurrency(currentAmount, currency)}
      </p>)
    : null
  }
  </>
  );
};

export default Input;
