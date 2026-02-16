interface RadioButtonProps {
  label: string;
  description?: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  color?: "blue" | "green" | "orange" | "purple" | "red";
  className?: string;
}

export default function RadioButton({
  label,
  description,
  value,
  checked,
  onChange,
  color = "blue",
  className = "",
}: RadioButtonProps) {
  const colorClasses = {
    blue: {
      border: checked ? "border-blue-500" : "border-zinc-700",
      bg: checked ? "bg-blue-500/10" : "bg-zinc-800/30",
      radio: checked ? "border-blue-500 bg-blue-500" : "border-zinc-400",
      hover: "hover:border-zinc-600",
    },
    green: {
      border: checked ? "border-green-500" : "border-zinc-700",
      bg: checked ? "bg-green-500/10" : "bg-zinc-800/30",
      radio: checked ? "border-green-500 bg-green-500" : "border-zinc-400",
      hover: "hover:border-zinc-600",
    },
    orange: {
      border: checked ? "border-orange-500" : "border-zinc-700",
      bg: checked ? "bg-orange-500/10" : "bg-zinc-800/30",
      radio: checked ? "border-orange-500 bg-orange-500" : "border-zinc-400",
      hover: "hover:border-zinc-600",
    },
    purple: {
      border: checked ? "border-purple-500" : "border-zinc-700",
      bg: checked ? "bg-purple-500/10" : "bg-zinc-800/30",
      radio: checked ? "border-purple-500 bg-purple-500" : "border-zinc-400",
      hover: "hover:border-zinc-600",
    },
    red: {
      border: checked ? "border-red-500" : "border-zinc-700",
      bg: checked ? "bg-red-500/10" : "bg-zinc-800/30",
      radio: checked ? "border-red-500 bg-red-500" : "border-zinc-400",
      hover: "hover:border-zinc-600",
    },
  };

  const colors = colorClasses[color];

  return (
    <div
      className={`
        p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
        ${colors.border} ${colors.bg} ${!checked ? colors.hover : ""}
        ${className}
      `}
      onClick={() => onChange(value)}
    >
      <div className="flex items-center gap-3">
        <div
          className={`
          w-5 h-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center
          ${colors.radio}
        `}
        >
          {checked && (
            <div className="w-2.5 h-2.5 rounded-full bg-white transition-all duration-200" />
          )}
        </div>
        <div className="flex-1">
          <div className="font-medium text-white">{label}</div>
          {description && (
            <div className="text-sm text-zinc-400 mt-1">{description}</div>
          )}
        </div>
      </div>
    </div>
  );
}
