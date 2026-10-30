"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useProfile } from "@/hooks/useProfile";
import {
  Menu,
  Plus,
  Bell,
  LogOut,
  User,
  Settings,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { toast } from "sonner";
import TransactionModal from "./TransactionModal";

interface HeaderProps {
  onMenuClick: () => void;
  pageTitle: string;
}

export default function Header({ onMenuClick, pageTitle }: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const router = useRouter();
  const supabase = createClientComponentClient();
  const { data: profile } = useProfile();

  const handleLogout = async () => {
    setDropdownOpen(false);
    try {
      await supabase.auth.signOut();
      toast.success("Berhasil keluar");
      router.push("/login");
    } catch {
      toast.error("Gagal keluar, coba lagi");
    }
  };

  return (
    <>
      <header className="flex items-center justify-between h-16 px-4 sm:px-6 bg-white border-b border-gray-200 sticky top-0 z-10">
        {/* Kiri: Toggle Sidebar + Judul */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="Buka menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold text-gray-900 hidden sm:block">
            {pageTitle}
          </h1>
        </div>

        {/* Kanan: Aksi */}
        <div className="flex items-center gap-2">
          {/* Tombol Tambah Transaksi Cepat */}
          <button
            onClick={() => setTransactionModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Tambah</span>
          </button>

          {/* Notifikasi */}
          <div className="relative">
            <button
              onClick={() => {
                setNotifOpen(!notifOpen);
                setDropdownOpen(false);
              }}
              className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
              aria-label="Notifikasi"
            >
              <Bell className="w-5 h-5" />
              {/* Badge unread */}
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 py-2">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="font-semibold text-gray-900 text-sm">Notifikasi</p>
                </div>
                <div className="px-4 py-8 text-center">
                  <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">Belum ada notifikasi</p>
                </div>
              </div>
            )}
          </div>

          {/* Avatar Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setDropdownOpen(!dropdownOpen);
                setNotifOpen(false);
              }}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden">
                {profile?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.avatar_url}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-orange-600 font-bold text-sm">
                    {profile?.full_name?.[0]?.toUpperCase() ?? "U"}
                  </span>
                )}
              </div>
              <ChevronDown
                className={cn(
                  "w-4 h-4 text-gray-400 transition-transform hidden sm:block",
                  dropdownOpen && "rotate-180"
                )}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-200 z-50 py-1.5">
                <div className="px-3 py-2 border-b border-gray-100 mb-1">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {profile?.full_name ?? "Pengguna"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {profile?.email ?? ""}
                  </p>
                </div>

                <Link
                  href="/dashboard/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User className="w-4 h-4 text-gray-400" />
                  Profil Saya
                </Link>

                <Link
                  href="/dashboard/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Settings className="w-4 h-4 text-gray-400" />
                  Pengaturan
                </Link>

                <hr className="my-1 border-gray-100" />

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Keluar
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modal Tambah Transaksi Cepat */}
      <TransactionModal
        open={transactionModalOpen}
        onClose={() => setTransactionModalOpen(false)}
        mode="create"
      />

      {/* Tutup dropdown ketika klik di luar */}
      {(dropdownOpen || notifOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setDropdownOpen(false);
            setNotifOpen(false);
          }}
        />
      )}
    </>
  );
}
