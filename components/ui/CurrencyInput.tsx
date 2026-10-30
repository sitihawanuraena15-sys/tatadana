import React from "react";
import { cn } from "@/lib/utils";

interface CurrencyInputProps {
  value: number;
  onChange: (val: number) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export default function CurrencyInput({
  value,
  onChange,
  placeholder = "0",
  className,
  disabled,
}: CurrencyInputProps) {
  const formatNumber = (num: number) => {
    if (!num) return "";
    return new Intl.NumberFormat("id-ID").format(num);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/[^0-9]/g, "");
    const parsed = parseInt(rawVal, 10);
    onChange(isNaN(parsed) ? 0 : parsed);
  };

  return (
    <div className="relative flex items-center">
      <span className="absolute left-3 text-gray-500 font-semibold text-sm">Rp</span>
      <input
        type="text"
        inputMode="numeric"
        value={formatNumber(value)}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "w-full pl-10 pr-3 py-2 bg-white border border-gray-200 rounded-xl outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition text-gray-900",
          className
        )}
      />
    </div>
  );
}

export { CurrencyInput };
