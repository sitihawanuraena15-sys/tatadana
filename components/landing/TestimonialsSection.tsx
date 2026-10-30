"use client";

import React from "react";
import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Rian Saputra",
    role: "Freelance Designer",
    comment: "TataDana beneran mengubah cara saya ngatur duit. Tinggal chat di Telegram, langsung masuk ke dashboard dengan rapi!",
  },
  {
    name: "Siti Rahma",
    role: "Karyawan Swasta",
    comment: "Fitur budget dan sisa saldo riil ngebantu banget biar nggak boncos di akhir bulan. Ekspor PDF-nya juga super clean.",
  },
  {
    name: "Dimas Anggara",
    role: "Pemilik Usaha F&B",
    comment: "Akun Pro tanpa batas pencatatan sangat pas buat catat arus kas harian kedai saya. Rekomendasi banget!",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-gray-50/70 border-y border-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600 bg-orange-100/60 px-3 py-1 rounded-full">
            Testimoni Pengguna
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-4 tracking-tight">
            Dipercaya Oleh Ribuan Pengguna Aktif
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 italic">"{t.comment}"</p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-sm font-bold text-gray-900">{t.name}</p>
                <p className="text-xs text-gray-400">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
