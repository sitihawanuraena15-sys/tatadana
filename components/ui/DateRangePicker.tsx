import React from "react";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface DateRange {
  from: Date;
  to: Date;
}

interface DateRangePickerProps {
  value: DateRange | null;
  onChange: (range: DateRange | null) => void;
  placeholder?: string;
  className?: string;
}

export default function DateRangePicker({
  value,
  onChange,
  placeholder = "Pilih rentang tanggal",
  className,
}: DateRangePickerProps) {
  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fromDate = e.target.value ? new Date(e.target.value) : new Date();
    const toDate = value?.to || fromDate;
    onChange({ from: fromDate, to: toDate });
  };

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const toDate = e.target.value ? new Date(e.target.value) : new Date();
    const fromDate = value?.from || toDate;
    onChange({ from: fromDate, to: toDate });
  };

  const fromStr = value?.from ? value.from.toISOString().split("T")[0] : "";
  const toStr = value?.to ? value.to.toISOString().split("T")[0] : "";

  return (
    <div className={cn("flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200 text-xs", className)}>
      <Calendar className="w-4 h-4 text-gray-400" />
      <input
        type="date"
        value={fromStr}
        onChange={handleFromChange}
        className="outline-none text-gray-700 bg-transparent"
        aria-label="Tanggal Awal"
      />
      <span className="text-gray-400">-</span>
      <input
        type="date"
        value={toStr}
        onChange={handleToChange}
        className="outline-none text-gray-700 bg-transparent"
        aria-label="Tanggal Akhir"
      />
    </div>
  );
}

export { DateRangePicker };
