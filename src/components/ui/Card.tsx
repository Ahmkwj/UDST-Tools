import React from "react";
import { useLocale } from "../../context/LanguageContext";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export default function Card({ children, className = "", title }: CardProps) {
  const locale = useLocale();

  return (
    <section
      className={`
        bg-zinc-900/70 backdrop-blur-sm rounded-xl p-6 
        shadow-lg ring-1 ring-zinc-800/50
        ${locale === "ar" ? "text-right" : "text-left"}
        ${className}
      `}
    >
      {title && (
        <h2 className="text-xl font-bold mb-4 text-blue-400">{title}</h2>
      )}
      {children}
    </section>
  );
}
