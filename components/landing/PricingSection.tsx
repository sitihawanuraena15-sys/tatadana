"use client";

import React from "react";
import Link from "next/link";
import { Check } from "lucide-react";

export default function PricingSection() {
  const proPrice = process.env.NEXT_PUBLIC_PRO_PRICE || "Rp29.000 / bulan";

  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
          Paket Harga
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-4 tracking-tight">
          Pilihan Paket Sederhana & Terjangkau
        </h2>
        <p className="text-sm text-gray-500 mt-3">
          Mulai secara gratis hari ini dan upgrade ke akun Pro kapan saja saat kamu membutuhkan fitur tanpa batas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
        {/* Paket Starter */}
        <div className="p-8 rounded-3xl bg-white border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Starter Free</h3>
              <p className="text-xs text-gray-500 mt-1">Cocok untuk pencatatan keuangan pribadi harian</p>
            </div>
            <div className="text-3xl font-extrabold text-gray-900">
              Rp0 <span className="text-xs font-medium text-gray-400">/ selamanya</span>
            </div>
            <ul className="space-y-3 pt-4 border-t border-gray-100 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                Maksimal 10 transaksi / bulan
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                Laporan keuangan standar
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                Dukungan Telegram Bot dasar
              </li>
            </ul>
          </div>
          <div className="mt-8">
            <Link
              href="/register"
              className="w-full block py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-center text-sm transition"
            >
              Mulai Gratis
            </Link>
          </div>
        </div>

        {/* Paket Pro */}
        <div className="p-8 rounded-3xl bg-gradient-to-b from-orange-50/50 to-amber-50/50 border-2 border-orange-500 shadow-lg relative flex flex-col justify-between">
          <div className="absolute -top-3.5 right-6 px-3 py-1 bg-orange-500 text-white text-[10px] font-black uppercase rounded-full tracking-wider">
            Paling Populer
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span>TataDana Pro</span>
                <span className="text-amber-500">👑</span>
              </h3>
              <p className="text-xs text-gray-500 mt-1">Untuk pengguna yang menginginkan kebebasan finansial penuh</p>
            </div>
            <div className="text-3xl font-extrabold text-gray-900">
              {proPrice}
            </div>
            <ul className="space-y-3 pt-4 border-t border-orange-200/60 text-sm text-gray-700 font-medium">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-orange-600 shrink-0" />
                <strong>Transaksi TANPA BATAS (Unlimited)</strong>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-orange-600 shrink-0" />
                Ekspor data & Laporan analitik mendalam
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-orange-600 shrink-0" />
                Akses prioritas AI Assistant & Multi-dompet
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-orange-600 shrink-0" />
                Dukungan prioritas WhatsApp admin
              </li>
            </ul>
          </div>
          <div className="mt-8">
            <Link
              href="/login"
              className="w-full block py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-center text-sm shadow-md shadow-orange-500/20 transition"
            >
              Langganan Pro Sekarang
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
