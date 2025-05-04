import React from "react";
import { useLocale } from "../../context/LanguageContext";

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
  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <div className={`space-y-1 ${fullWidth ? "w-full" : ""}`}>
      {label && (
        <label
          className={`block text-sm font-medium text-zinc-300 ${
            isRTL ? "text-right" : "text-left"
          }`}
        >
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
          ${isRTL ? "text-right" : "text-left"}
          ${className}
        `}
        dir={isRTL ? "rtl" : "ltr"}
        {...props}
      />
      {helperText && (
        <p
          className={`text-xs ${error ? "text-red-400" : "text-zinc-400"} ${
            isRTL ? "text-right" : "text-left"
          }`}
        >
          {helperText}
        </p>
      )}
    </div>
  );
}
