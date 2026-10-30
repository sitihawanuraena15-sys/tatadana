"use client";

import React from "react";
import { MessageSquare, PieChart, ShieldCheck, Zap, Bot, Download } from "lucide-react";

const FEATURES = [
  {
    icon: MessageSquare,
    title: "Catat Lewat Chat",
    desc: "Cukup ketik pengeluaran seperti 'Kopi 25rb' langsung via Telegram atau Web.",
  },
  {
    icon: Bot,
    title: "Tata AI Assistant",
    desc: "AI pintar yang otomatis mengkategorikan transaksi dan memberikan saran hemat.",
  },
  {
    icon: PieChart,
    title: "Analitik Real-time",
    desc: "Grafik donut kategori dan perbandingan pemasukan vs pengeluaran otomatis.",
  },
  {
    icon: Download,
    title: "Ekspor PDF & Excel",
    desc: "Unduh laporan keuangan rapi dan terperinci dalam format PDF maupun spreadsheet Excel.",
  },
  {
    icon: ShieldCheck,
    title: "Aman & Terenkripsi",
    desc: "Didukung Supabase PostgreSQL dengan Row Level Security untuk privasi data kamu.",
  },
  {
    icon: Zap,
    title: "Multi Dompet & Budget",
    desc: "Kelola dompet BCA, Mandiri, e-Wallet, serta batasan anggaran bulanan.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
          Fitur Unggulan
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-4 tracking-tight">
          Segala yang Kamu Butuhkan untuk Mengelola Finansial
        </h2>
        <p className="text-sm text-gray-500 mt-3">
          Tinggalkan spreadsheet rumit. TataDana memberikan pengalaman mencatat keuangan yang cepat dan cerdas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {FEATURES.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center mb-4 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
