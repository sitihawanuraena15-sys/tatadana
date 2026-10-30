"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { formatRupiah } from "@/lib/utils";
import { Wallet, TrendingUp, TrendingDown, Target } from "lucide-react";
import CountUp from "react-countup";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";

interface StatData {
  saldo_total: number;
  pemasukan_bulan: number;
  pengeluaran_bulan: number;
  budget_tersisa: number;
}

async function fetchStats(periode: string): Promise<StatData> {
  const res = await fetch(`/api/stats?periode=${periode}`);
  if (!res.ok) throw new Error("Gagal memuat statistik");
  return res.json();
}

interface StatCardsProps {
  periode: string;
}

const cards = [
  {
    key: "saldo_total" as keyof StatData,
    label: "Saldo Total",
    icon: Wallet,
    colorClass: "text-orange-500",
    bgClass: "bg-orange-50",
    description: "Semua wallet",
  },
  {
    key: "pemasukan_bulan" as keyof StatData,
    label: "Pemasukan Bulan Ini",
    icon: TrendingUp,
    colorClass: "text-green-600",
    bgClass: "bg-green-50",
    description: "Total masuk",
  },
  {
    key: "pengeluaran_bulan" as keyof StatData,
    label: "Pengeluaran Bulan Ini",
    icon: TrendingDown,
    colorClass: "text-red-500",
    bgClass: "bg-red-50",
    description: "Total keluar",
  },
  {
    key: "budget_tersisa" as keyof StatData,
    label: "Budget Tersisa",
    icon: Target,
    colorClass: "text-blue-500",
    bgClass: "bg-blue-50",
    description: "Bulan ini",
  },
];

export default function StatCards({ periode }: StatCardsProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["stats", periode],
    queryFn: () => fetchStats(periode),
    refetchInterval: 30000, // refresh tiap 30 detik
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <LoadingSkeleton key={i} variant="stat-card" />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.key}
            className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4"
          >
            <div className={`p-3 rounded-xl ${card.bgClass}`}>
              <card.icon className={`w-5 h-5 ${card.colorClass}`} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">{card.label}</p>
              <p className="text-lg font-bold text-gray-300 mt-0.5">Rp —</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const value = data[card.key];

        return (
          <div
            key={card.key}
            className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 hover:shadow-md transition-shadow"
          >
            <div className={`p-3 rounded-xl ${card.bgClass} flex-shrink-0`}>
              <Icon className={`w-5 h-5 ${card.colorClass}`} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500 font-medium truncate">
                {card.label}
              </p>
              <p className="text-lg font-bold text-gray-900 mt-0.5 tabular-nums">
                <CountUp
                  start={0}
                  end={value}
                  duration={1.2}
                  separator="."
                  prefix="Rp "
                  formattingFn={(val) => formatRupiah(val)}
                />
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{card.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
