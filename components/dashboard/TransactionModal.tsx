"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useWallets } from "@/hooks/useWallets";
import { useCategories } from "@/hooks/useCategories";
import { formatTanggalIndonesia } from "@/lib/utils";
import CurrencyInput from "@/components/ui/CurrencyInput";
import {
  X,
  TrendingUp,
  TrendingDown,
  ArrowLeftRight,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const skema = z.object({
  jenis: z.enum(["pemasukan", "pengeluaran", "transfer"]),
  nominal: z.number().min(1, "Nominal harus lebih dari 0"),
  kategori_id: z.string().optional(),
  wallet_id: z.string().min(1, "Pilih wallet"),
  wallet_tujuan_id: z.string().optional(),
  tanggal: z.string().min(1, "Tanggal wajib diisi"),
  catatan: z.string().max(200, "Catatan maksimal 200 karakter").optional(),
});

type FormData = z.infer<typeof skema>;

interface TransactionModalProps {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  initialData?: Partial<FormData> & { id?: string };
}

async function createTransaction(data: FormData) {
  const res = await fetch("/api/transactions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.pesan ?? "Gagal membuat transaksi");
  }
  return res.json();
}

async function updateTransaction(id: string, data: FormData) {
  const res = await fetch(`/api/transactions/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.pesan ?? "Gagal mengubah transaksi");
  }
  return res.json();
}

export default function TransactionModal({
  open,
  onClose,
  mode,
  initialData,
}: TransactionModalProps) {
  const queryClient = useQueryClient();
  const { data: wallets = [] } = useWallets();
  const { data: categories = [] } = useCategories();
  const [activeJenis, setActiveJenis] = useState<"pemasukan" | "pengeluaran" | "transfer">(
    initialData?.jenis ?? "pengeluaran"
  );

  const todayWIB = new Date().toLocaleDateString("id-ID", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  // Format ke YYYY-MM-DD untuk input date
  const [d, m, y] = todayWIB.split("/");
  const defaultDate = `${y}-${m}-${d}`;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(skema),
    defaultValues: {
      jenis: initialData?.jenis ?? "pengeluaran",
      nominal: initialData?.nominal ?? 0,
      tanggal: initialData?.tanggal ?? defaultDate,
      catatan: initialData?.catatan ?? "",
      wallet_id: initialData?.wallet_id ?? "",
      kategori_id: initialData?.kategori_id ?? "",
    },
  });

  const walletId = watch("wallet_id");
  const walletTerpilih = wallets.find((w) => w.id === walletId);
  const nominal = watch("nominal");

  const { mutate, isPending } = useMutation({
    mutationFn: (data: FormData) =>
      mode === "edit" && initialData?.id
        ? updateTransaction(initialData.id, data)
        : createTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["transactions-recent"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
      queryClient.invalidateQueries({ queryKey: ["charts"] });
      toast.success(
        mode === "edit"
          ? "Transaksi berhasil diperbarui"
          : "Transaksi berhasil ditambahkan"
      );
      reset();
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: FormData) => {
    mutate({ ...data, jenis: activeJenis });
  };

  const handleChangeJenis = (jenis: "pemasukan" | "pengeluaran" | "transfer") => {
    setActiveJenis(jenis);
    setValue("jenis", jenis);
    setValue("kategori_id", ""); // reset kategori saat ganti jenis
  };

  const filteredCategories = categories.filter(
    (c) =>
      activeJenis === "transfer" || c.jenis === activeJenis || c.jenis === "semua"
  );

  // Preview saldo setelah transaksi
  const saldoSetelah =
    walletTerpilih && nominal
      ? activeJenis === "pemasukan"
        ? walletTerpilih.saldo + nominal
        : walletTerpilih.saldo - nominal
      : null;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">
            {mode === "edit" ? "Edit Transaksi" : "Tambah Transaksi"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
          {/* Toggle Jenis */}
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
            {(
              [
                { value: "pengeluaran", label: "Pengeluaran", icon: TrendingDown, color: "text-red-500" },
                { value: "pemasukan", label: "Pemasukan", icon: TrendingUp, color: "text-green-600" },
                { value: "transfer", label: "Transfer", icon: ArrowLeftRight, color: "text-blue-500" },
              ] as const
            ).map(({ value, label, icon: Icon, color }) => (
              <button
                key={value}
                type="button"
                onClick={() => handleChangeJenis(value)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all",
                  activeJenis === value
                    ? "bg-white shadow-sm text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                <Icon className={`w-3.5 h-3.5 ${activeJenis === value ? color : ""}`} />
                {label}
              </button>
            ))}
          </div>

          {/* Nominal */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Nominal <span className="text-red-500">*</span>
            </label>
            <CurrencyInput
              value={nominal}
              onChange={(val) => setValue("nominal", val)}
              placeholder="0"
              className={cn(
                "text-2xl font-bold",
                activeJenis === "pemasukan"
                  ? "text-green-600"
                  : activeJenis === "pengeluaran"
                  ? "text-red-500"
                  : "text-blue-500"
              )}
            />
            {errors.nominal && (
              <p className="text-xs text-red-500 mt-1">{errors.nominal.message}</p>
            )}
          </div>

          {/* Wallet */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Wallet <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                {...register("wallet_id")}
                className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 pr-8 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Pilih wallet</option>
                {wallets.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.nama} — {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(w.saldo)}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            {errors.wallet_id && (
              <p className="text-xs text-red-500 mt-1">{errors.wallet_id.message}</p>
            )}

            {/* Preview Saldo */}
            {saldoSetelah !== null && activeJenis !== "transfer" && (
              <p className="text-xs text-gray-500 mt-1">
                Saldo setelah transaksi:{" "}
                <span
                  className={cn(
                    "font-bold",
                    saldoSetelah < 0 ? "text-red-500" : "text-gray-900"
                  )}
                >
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                  }).format(saldoSetelah)}
                </span>
                {saldoSetelah < 0 && " ⚠️ Saldo tidak cukup!"}
              </p>
            )}
          </div>

          {/* Wallet Tujuan (untuk Transfer) */}
          {activeJenis === "transfer" && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Wallet Tujuan <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  {...register("wallet_tujuan_id")}
                  className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 pr-8 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Pilih wallet tujuan</option>
                  {wallets
                    .filter((w) => w.id !== walletId)
                    .map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.nama}
                      </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          )}

          {/* Kategori (tidak untuk transfer) */}
          {activeJenis !== "transfer" && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Kategori
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {filteredCategories.map((cat) => {
                  const selected = watch("kategori_id") === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setValue("kategori_id", cat.id)}
                      className={cn(
                        "flex flex-col items-center gap-1 p-2 rounded-lg border text-center transition-all",
                        selected
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 hover:border-gray-300 bg-gray-50"
                      )}
                    >
                      <span className="text-lg">{cat.emoji}</span>
                      <span className="text-xs text-gray-700 font-medium leading-tight line-clamp-1">
                        {cat.nama}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tanggal */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Tanggal <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              {...register("tanggal")}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            {errors.tanggal && (
              <p className="text-xs text-red-500 mt-1">{errors.tanggal.message}</p>
            )}
          </div>

          {/* Catatan */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Catatan
            </label>
            <textarea
              {...register("catatan")}
              placeholder="Tambahkan catatan (opsional)..."
              rows={2}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
            />
            {errors.catatan && (
              <p className="text-xs text-red-500 mt-1">{errors.catatan.message}</p>
            )}
          </div>

          {/* Tombol Aksi */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-sm font-semibold text-white transition-colors flex items-center justify-center gap-2"
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === "edit" ? "Simpan Perubahan" : "Simpan Transaksi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
