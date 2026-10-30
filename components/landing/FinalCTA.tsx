"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 to-amber-500 p-10 sm:p-16 text-center text-white shadow-xl shadow-orange-500/20">
        <div className="max-w-2xl mx-auto space-y-6 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur text-xs font-bold uppercase tracking-wider text-white">
            <Sparkles className="w-3.5 h-3.5" />
            Mulai Hari Ini
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Kendalikan Keuanganmu Sekarang, Lebih Mudah Bersama TataDana
          </h2>
          <p className="text-sm text-white/90 leading-relaxed max-w-lg mx-auto">
            Daftar gratis dalam 1 menit. Tanpa kartu kredit, langsung terhubung dengan analitik otomatis dan asisten AI.
          </p>
          <div className="pt-2">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-orange-600 font-extrabold text-sm rounded-xl hover:bg-orange-50 transition shadow-lg"
            >
              <span>Daftar Sekarang — Gratis</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
