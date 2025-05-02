import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: boolean;
  fullWidth?: boolean;
}

export default function Input({
  label,
  helperText,
  error = false,
  fullWidth = true,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className={`space-y-1 ${fullWidth ? "w-full" : ""}`}>
      {label && (
        <label className="block text-sm font-medium text-zinc-300">
          {label}
        </label>
      )}
      <input
        className={`
          w-full bg-zinc-800/50 border ${
            error ? "border-red-500" : "border-zinc-700"
          }
          rounded-lg px-3 py-2.5 text-white placeholder-zinc-500
          focus:outline-none focus:border-zinc-700
          hover:border-zinc-600
          transition-colors duration-200
          ${className}
        `}
        {...props}
      />
      {helperText && (
        <p className={`text-xs ${error ? "text-red-400" : "text-zinc-400"}`}>
          {helperText}
        </p>
      )}
    </div>
  );
}
