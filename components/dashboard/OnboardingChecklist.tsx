"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Circle, MessageCircle, Wallet, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface OnboardingStatus {
  has_telegram: boolean;
  has_wallet: boolean;
  has_budget: boolean;
}

async function fetchOnboardingStatus(): Promise<OnboardingStatus> {
  const res = await fetch("/api/onboarding-status");
  if (!res.ok) throw new Error("Gagal memuat status onboarding");
  return res.json();
}

const checklistItems = [
  {
    key: "has_telegram" as keyof OnboardingStatus,
    label: "Hubungkan Telegram Bot",
    description: "Catat transaksi langsung dari Telegram",
    href: "/dashboard/settings?tab=telegram",
    icon: MessageCircle,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    key: "has_wallet" as keyof OnboardingStatus,
    label: "Buat wallet pertama",
    description: "Dompet, rekening bank, atau e-wallet",
    href: "/dashboard/wallet",
    icon: Wallet,
    color: "text-orange-500",
    bgColor: "bg-orange-50",
  },
  {
    key: "has_budget" as keyof OnboardingStatus,
    label: "Set budget bulan ini",
    description: "Kontrol pengeluaran dengan budget",
    href: "/dashboard/budget",
    icon: Target,
    color: "text-green-500",
    bgColor: "bg-green-50",
  },
];

export default function OnboardingChecklist() {
  const { data: status, isLoading } = useQuery({
    queryKey: ["onboarding-status"],
    queryFn: fetchOnboardingStatus,
  });

  // Jika semua sudah selesai, tidak tampilkan checklist
  if (!isLoading && status) {
    const allDone = status.has_telegram && status.has_wallet && status.has_budget;
    if (allDone) return null;
  }

  const completedCount = status
    ? checklistItems.filter((item) => status[item.key]).length
    : 0;

  return (
    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-200 p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-gray-900">
            🎉 Selamat datang di TataDana!
          </h3>
          <p className="text-sm text-gray-600 mt-0.5">
            Selesaikan setup awal untuk mulai mencatat keuanganmu
          </p>
        </div>
        {!isLoading && status && (
          <span className="text-xs font-bold text-orange-600 bg-white px-2.5 py-1 rounded-full border border-orange-200">
            {completedCount}/{checklistItems.length}
          </span>
        )}
      </div>

      {/* Progress bar */}
      {!isLoading && status && (
        <div className="w-full bg-orange-100 rounded-full h-1.5 mb-4">
          <div
            className="bg-orange-500 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${(completedCount / checklistItems.length) * 100}%` }}
          />
        </div>
      )}

      {/* Illustrasi SVG */}
      <div className="flex justify-center mb-4">
        <svg
          width="120"
          height="80"
          viewBox="0 0 120 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="opacity-60"
        >
          <rect x="10" y="20" width="100" height="50" rx="8" fill="#FED7AA" />
          <rect x="20" y="30" width="80" height="8" rx="4" fill="#F97316" opacity="0.4" />
          <rect x="20" y="44" width="50" height="6" rx="3" fill="#F97316" opacity="0.3" />
          <rect x="20" y="56" width="35" height="6" rx="3" fill="#F97316" opacity="0.2" />
          <circle cx="95" cy="15" r="12" fill="#F97316" opacity="0.8" />
          <path d="M89 15L93 19L101 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Checklist Items */}
      <div className="space-y-2">
        {checklistItems.map((item) => {
          const done = status ? status[item.key] : false;
          const Icon = item.icon;

          return (
            <Link
              key={item.key}
              href={done ? "#" : item.href}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg transition-all",
                done
                  ? "bg-white/60 cursor-default"
                  : "bg-white hover:shadow-sm hover:border-orange-200 border border-transparent cursor-pointer"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                  done ? "bg-green-50" : item.bgColor
                )}
              >
                {done ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : (
                  <Icon className={`w-4 h-4 ${item.color}`} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "text-sm font-semibold",
                    done ? "text-gray-400 line-through" : "text-gray-900"
                  )}
                >
                  {item.label}
                </p>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
              {!done && (
                <span className="text-xs font-semibold text-orange-500 flex-shrink-0">
                  Setup →
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
