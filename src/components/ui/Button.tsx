import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
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
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-950 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white focus:ring-blue-500/50",
    secondary:
      "bg-white/[0.06] hover:bg-white/[0.1] active:bg-white/[0.14] text-white border border-white/[0.06] hover:border-white/[0.1] focus:ring-white/20",
    outline:
      "bg-transparent hover:bg-white/[0.04] text-zinc-300 hover:text-white border border-white/[0.06] hover:border-white/[0.1] focus:ring-white/20",
    ghost:
      "bg-transparent hover:bg-white/[0.04] text-zinc-400 hover:text-white focus:ring-white/20",
  };

  const sizes = {
    sm: "text-xs px-3 py-1.5 rounded-lg gap-1.5",
    md: "text-sm px-4 py-2 rounded-lg gap-2",
    lg: "text-sm px-5 py-2.5 rounded-lg gap-2",
  };

  return (
    <button
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
