"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { formatRupiah, formatTanggalIndonesia } from "@/lib/utils";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import EmptyState from "@/components/ui/EmptyState";
import { ArrowRight } from "lucide-react";

interface Transaksi {
  id: string;
  jenis: "pemasukan" | "pengeluaran";
  nominal: number;
  catatan: string;
  tanggal: string;
  kategori: {
    nama: string;
    emoji: string;
  };
  wallet: {
    nama: string;
  };
}

async function fetchRecentTransactions(): Promise<Transaksi[]> {
  const res = await fetch("/api/transactions?limit=10&sort=tanggal:desc");
  if (!res.ok) throw new Error("Gagal memuat transaksi");
  const data = await res.json();
  return data.data ?? [];
}

export default function TransactionList() {
  const { data: transaksi, isLoading, isError } = useQuery({
    queryKey: ["transactions-recent"],
    queryFn: fetchRecentTransactions,
    refetchInterval: 60000,
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-900">Transaksi Terbaru</h3>
        </div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <LoadingSkeleton key={i} variant="transaction-item" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-bold text-gray-900 mb-4">Transaksi Terbaru</h3>
        <EmptyState
          title="Gagal memuat transaksi"
          description="Tidak bisa terhubung ke server."
          size="sm"
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-gray-900">Transaksi Terbaru</h3>
        <Link
          href="/dashboard/transaksi"
          className="flex items-center gap-1 text-xs font-semibold text-orange-500 hover:text-orange-600 transition-colors"
        >
          Lihat semua
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {!transaksi || transaksi.length === 0 ? (
        <EmptyState
          title="Belum ada transaksi"
          description="Mulai catat pemasukan dan pengeluaranmu hari ini."
          size="sm"
        />
      ) : (
        <div className="space-y-1">
          {transaksi.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 py-2.5 px-2 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              {/* Emoji Kategori */}
              <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-lg flex-shrink-0">
                {item.kategori.emoji}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {item.kategori.nama}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-xs text-gray-400 truncate">
                    {item.catatan || "Tidak ada catatan"}
                  </p>
                  <span className="text-gray-200">·</span>
                  <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded font-medium flex-shrink-0">
                    {item.wallet.nama}
                  </span>
                </div>
              </div>

              {/* Nominal & Waktu */}
              <div className="text-right flex-shrink-0">
                <p
                  className={`text-sm font-bold tabular-nums ${
                    item.jenis === "pemasukan" ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {item.jenis === "pemasukan" ? "+" : "-"}
                  {formatRupiah(item.nominal)}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {formatTanggalIndonesia(item.tanggal, "short")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
