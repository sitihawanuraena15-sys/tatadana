"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useProfile } from "@/hooks/useProfile";
import {
  Home,
  CreditCard,
  BarChart2,
  Target,
  Wallet,
  Settings,
  X,
  LogOut,
  ChevronRight,
  Zap,
  Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigasiItems = [
  {
    label: "Beranda",
    href: "/dashboard",
    icon: Home,
    exact: true,
  },
  {
    label: "Transaksi",
    href: "/dashboard/transaksi",
    icon: CreditCard,
  },
  {
    label: "Laporan",
    href: "/dashboard/laporan",
    icon: BarChart2,
  },
  {
    label: "Budget",
    href: "/dashboard/budget",
    icon: Target,
  },
  {
    label: "Wallet",
    href: "/dashboard/wallet",
    icon: Wallet,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const user = profile;
  const [isSubmittingPro, setIsSubmittingPro] = useState(false);

  const handleUpgradePro = async () => {
    setIsSubmittingPro(true);
    const waNumber = process.env.NEXT_PUBLIC_ADMIN_WA_NUMBER || "6289655786828";
    const proPrice = process.env.NEXT_PUBLIC_PRO_PRICE || "Rp29.000 / bulan";
    const userEmail = user?.email || "";

    try {
      await fetch("/api/pro/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user?.id,
          email: userEmail,
          full_name: user?.full_name,
        }),
      });
      toast.success("Pengajuan berhasil dikirim! Menunggu persetujuan admin.");
    } catch (err) {
      console.error("Upgrade pro error:", err);
      toast.success("Pengajuan berhasil dikirim!");
    } finally {
      setIsSubmittingPro(false);
      const waMsg = `Halo Admin TataDana, saya ingin berlangganan Akun Pro seharga ${proPrice}. Mohon info nomor rekening pembayarannya. Email akun: ${userEmail}`;
      window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(waMsg)}`, "_blank");
    }
  };

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Berhasil keluar");
      router.push("/login");
    } catch {
      toast.error("Gagal keluar, coba lagi");
    }
  };

  const planLabel = profile?.plan === "PRO" ? "PRO" : "STARTER";
  const isPro = profile?.plan === "PRO";

  return (
    <>
      {/* Sidebar Desktop */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 flex flex-col w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out",
          "lg:relative lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo & Close Button */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">TD</span>
            </div>
            <span className="text-gray-900 font-bold text-lg tracking-tight">
              TataDana
            </span>
          </Link>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Tutup sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigasi */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navigasiItems.map((item) => {
            const active = isActive(item.href, item.exact);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group relative",
                  active
                    ? "bg-orange-50 text-orange-600 border-l-[3px] border-orange-500 pl-[9px]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 flex-shrink-0 transition-colors",
                    active ? "text-orange-500" : "text-gray-400 group-hover:text-gray-600"
                  )}
                />
                <span>{item.label}</span>
                {active && (
                  <ChevronRight className="w-3.5 h-3.5 ml-auto text-orange-400" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile, Plan Badge, Price & Upgrade to Pro Button */}
        <div className="px-4 py-4 border-t border-gray-100">
          {profileLoading ? (
            <div className="flex items-center gap-3 animate-pulse">
              <div className="w-9 h-9 bg-gray-200 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 bg-gray-200 rounded w-24" />
                <div className="h-2.5 bg-gray-200 rounded w-32" />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {profile?.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profile.avatar_url}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-orange-600 font-bold text-sm">
                      {profile?.full_name?.[0]?.toUpperCase() ?? "L"}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {profile?.full_name ?? "Lisa"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {profile?.email ?? "lisa@tatadana.id"}
                  </p>
                  <span
                    className={cn(
                      "inline-block text-[10px] font-black uppercase px-2 py-0.5 rounded-full mt-0.5",
                      isPro
                        ? "bg-amber-100 text-amber-800 border border-amber-200"
                        : "bg-gray-200 text-gray-700"
                    )}
                  >
                    {isPro ? "PRO USER" : "FREE"}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0 cursor-pointer"
                  title="Keluar"
                  aria-label="Keluar dari akun"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

              {/* Di bawah teks FREE: Teks harga & Tombol Upgrade ke Pro */}
              {!isPro && (
                <div className="pt-2 border-t border-gray-100 space-y-1">
                  <div className="text-xs font-semibold text-gray-700">
                    Pro {process.env.NEXT_PUBLIC_PRO_PRICE || 'Rp29.000/bln'}
                  </div>
                  <button
                    type="button"
                    onClick={handleUpgradePro}
                    disabled={isSubmittingPro}
                    className="mt-2 w-full inline-block px-3 py-1.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white text-xs font-semibold rounded cursor-pointer transition text-center"
                  >
                    {isSubmittingPro ? "Memproses..." : "Upgrade ke Pro"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
