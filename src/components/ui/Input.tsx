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
    <div className={`space-y-2 ${fullWidth ? "w-full" : ""}`}>
      {label && (
        <label className="block text-xs font-medium text-zinc-400 text-start">
          {label}
        </label>
      )}
      <input
        className={`
          w-full bg-zinc-800/50 border ${
            error ? "border-red-500/50 focus:border-red-500" : "border-zinc-500/40 focus:border-blue-500"
          }
          rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500
          focus:outline-none focus:ring-2 ${
            error ? "focus:ring-red-500/20" : "focus:ring-blue-500/20"
          }
          hover:border-zinc-400/40
          transition-all duration-200
          text-start
          ${className}
        `}
        {...props}
      />
      {helperText && (
        <p
          className={`text-xs text-start ${error ? "text-red-400" : "text-zinc-300"}`}
        >
          {helperText}
        </p>
      )}
    </div>
  );
}
