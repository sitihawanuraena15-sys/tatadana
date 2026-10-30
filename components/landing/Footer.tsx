"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center font-bold text-white text-sm">
            TD
          </div>
          <span className="text-white font-extrabold tracking-tight">TataDana</span>
          <span className="text-xs text-gray-500 ml-2">© {new Date().getFullYear()} TataDana. Seluruh hak cipta dilindungi.</span>
        </div>

        <div className="flex items-center gap-6 text-xs">
          <Link href="/login" className="hover:text-white transition">Masuk</Link>
          <Link href="/register" className="hover:text-white transition">Daftar</Link>
          <Link href="/dashboard" className="hover:text-white transition">Dashboard</Link>
          <Link href="/admin" className="hover:text-white transition">Admin Hub</Link>
        </div>
      </div>
    </footer>
  );
}
