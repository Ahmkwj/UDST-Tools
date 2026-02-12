import React from "react";
import { useLocale } from "../../context/LanguageContext";

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
  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <label
      className={`relative flex items-start cursor-pointer group ${
        isRTL ? "flex-row-reverse justify-end" : ""
      }`}
    >
      <div className="relative flex items-center h-5">
        <input
          type="checkbox"
          className={`
            peer appearance-none h-4 w-4 rounded 
            border border-zinc-500/60 bg-zinc-800/65
            checked:bg-blue-500 checked:border-blue-500
            hover:border-zinc-400/50
            focus:outline-none focus:ring-2 focus:ring-blue-500/20
            transition-all duration-200
            ${className}
          `}
          {...props}
        />
        <div className="absolute inset-0 flex items-center justify-center text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity duration-200">
          <svg
            className="h-3 w-3"
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
        <div className={`${isRTL ? "mr-2.5 text-right" : "ml-2.5 text-left"} flex-1`}>
          {label && (
            <div className="text-xs font-medium text-zinc-300">{label}</div>
          )}
          {description && (
            <div className="text-[11px] text-zinc-500">{description}</div>
          )}
        </div>
      )}
    </label>
  );
}
