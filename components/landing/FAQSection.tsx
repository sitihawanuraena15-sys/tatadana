"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "Bagaimana cara menghubungkan akun TataDana ke Telegram?",
    a: "Buka menu Pengaturan di Dashboard, lalu klik 'Hubungkan ke Telegram'. Kamu akan diarahkan ke TataDanaBot dan cukup tekan Start untuk sinkronisasi otomatis.",
  },
  {
    q: "Apakah data transaksi dan keuangan saya aman?",
    a: "Ya, seluruh data tersimpan di PostgreSQL Supabase dengan perlindungan Row Level Security (RLS) berstandar industri. Hanya akun kamu yang dapat membaca datamu.",
  },
  {
    q: "Bagaimana cara melakukan upgrade ke akun Pro?",
    a: "Cukup klik tombol 'Upgrade ke Pro' pada sidebar atau modal dashboard. Kamu akan langsung dihubungkan ke WhatsApp admin untuk konfirmasi pembayaran cepat.",
  },
  {
    q: "Apakah format ekspor laporan mendukung Excel dan PDF?",
    a: "Benar! TataDana menyediakan tombol ekspor instan baik PDF berformat rapi maupun file spreadsheet Excel (.xlsx) untuk kebutuhan pembukuan lanjutan.",
  },
];

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="py-20 bg-gray-50/70 border-t border-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600 bg-orange-100/60 px-3 py-1 rounded-full">
            FAQ
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900 mt-4 tracking-tight">
            Pertanyaan yang Sering Diajukan
          </h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-gray-900 text-sm hover:text-orange-600 transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200",
                      isOpen && "rotate-180 text-orange-500"
                    )}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
