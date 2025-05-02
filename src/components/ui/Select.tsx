import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: boolean;
  fullWidth?: boolean;
}

export default function Select({
  label,
  helperText,
  error = false,
  fullWidth = true,
  className = "",
  children,
  ...props
}: SelectProps) {
  return (
    <div className={`space-y-1 ${fullWidth ? "w-full" : ""}`}>
      {label && (
        <label className="block text-sm font-medium text-zinc-300">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={`
            w-full bg-zinc-800/50 border ${
              error ? "border-red-500" : "border-zinc-700"
            }
            rounded-lg px-3 py-2.5 text-white
            focus:outline-none focus:border-zinc-700
            hover:border-zinc-600
            transition-colors duration-200
            appearance-none
            ${className}
          `}
          {...props}
        >
          {children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-400">
          <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      {helperText && (
        <p className={`text-xs ${error ? "text-red-400" : "text-zinc-400"}`}>
          {helperText}
        </p>
      )}
    </div>
  );
}
