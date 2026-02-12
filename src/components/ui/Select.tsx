import React from "react";
import { useLocale } from "../../context/LanguageContext";

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
      <div className="relative">
        <select
          className={`
            w-full bg-zinc-800/50 border ${
              error ? "border-red-500/50 focus:border-red-500" : "border-zinc-500/40 focus:border-blue-500"
            }
            rounded-xl px-3.5 py-2.5 text-sm text-white
            focus:outline-none focus:ring-2 ${
              error ? "focus:ring-red-500/20" : "focus:ring-blue-500/20"
            }
            hover:border-zinc-400/40
            transition-all duration-200
            appearance-none cursor-pointer
            ${isRTL ? "text-right pr-4 pl-10" : "text-left pr-10"}
            ${className}
          `}
          dir={isRTL ? "rtl" : "ltr"}
          {...props}
        >
          {children}
        </select>
        <div
          className={`pointer-events-none absolute inset-y-0 ${
            isRTL ? "left-0 pl-3.5" : "right-0 pr-3.5"
          } flex items-center text-zinc-500`}
        >
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
