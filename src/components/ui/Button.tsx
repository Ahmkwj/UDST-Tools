import React from "react";
import { useLocale } from "../../context/LanguageContext";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  icon,
  className = "",
  ...props
}: ButtonProps) {
  const locale = useLocale();
  const isRTL = locale === "ar";

  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-md hover:shadow-lg",
    secondary:
      "bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 text-zinc-100 ring-1 ring-zinc-700 hover:ring-zinc-600",
    outline:
      "bg-transparent hover:bg-zinc-800/50 text-zinc-300 hover:text-white ring-1 ring-zinc-700 hover:ring-zinc-600",
  };

  const sizes = {
    sm: "text-sm px-3 py-1.5 rounded-lg gap-1.5",
    md: "text-sm px-4 py-2.5 rounded-lg gap-2",
    lg: "text-base px-6 py-3 rounded-xl gap-2.5",
  };

  return (
    <button
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        ${isRTL ? "flex-row-reverse" : ""}
        ${className}
      `}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
