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
    <div className={`space-y-2 ${fullWidth ? "w-full" : ""}`}>
      {label && (
        <label
          className={`block text-xs font-medium text-zinc-400 ${
            isRTL ? "text-right" : "text-left"
          }`}
        >
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
          ${isRTL ? "text-right" : "text-left"}
          ${className}
        `}
        dir={isRTL ? "rtl" : "ltr"}
        {...props}
      />
      {helperText && (
        <p
          className={`text-xs ${error ? "text-red-400" : "text-zinc-300"} ${
            isRTL ? "text-right" : "text-left"
          }`}
        >
          {helperText}
        </p>
      )}
    </div>
  );
}
