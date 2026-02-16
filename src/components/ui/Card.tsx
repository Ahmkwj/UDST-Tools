import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export default function Card({ children, className = "", title }: CardProps) {

  return (
    <section
      className={`
        bg-white/[0.02] backdrop-blur-sm rounded-xl p-5
        border border-zinc-600/50
        text-start
        ${className}
      `}
    >
      {title && (
        <h2 className="text-sm font-semibold text-white mb-5 pb-3 border-b border-zinc-600/40">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}
