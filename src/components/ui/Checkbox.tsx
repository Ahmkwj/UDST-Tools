import React from "react";

interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  description?: string;
}

export default function Checkbox({
  label,
  description,
  className = "",
  ...props
}: CheckboxProps) {
  return (
    <label className="relative flex items-start cursor-pointer group">
      <div className="flex items-center h-5">
        <input
          type="checkbox"
          className={`
            appearance-none h-5 w-5 rounded 
            border border-zinc-700 bg-zinc-800/50
            checked:bg-blue-600 checked:border-blue-600
            hover:border-zinc-600
            focus:outline-none
            transition-colors duration-200
            ${className}
          `}
          {...props}
        />
        <div className="absolute text-white left-0 top-0 h-5 w-5 flex items-center justify-center pointer-events-none opacity-0 transition-opacity duration-200 peer-checked:opacity-100">
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 3L4.5 8.5L2 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      {(label || description) && (
        <div className="ml-3">
          {label && (
            <div className="text-sm font-medium text-zinc-300">{label}</div>
          )}
          {description && (
            <div className="text-xs text-zinc-400">{description}</div>
          )}
        </div>
      )}
    </label>
  );
}
