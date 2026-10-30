'use client'

import { useEffect, useRef, useState } from 'react'

// Data dummy untuk stat cards
const STAT_CARDS = [
  { label: 'Saldo Total', value: 'Rp2.450.000', icon: '💰', change: '+12%', positive: true },
  { label: 'Pemasukan', value: 'Rp5.200.000', icon: '📈', change: '+5%', positive: true },
  { label: 'Pengeluaran', value: 'Rp2.750.000', icon: '📉', change: '-8%', positive: false },
  { label: 'Budget Tersisa', value: 'Rp450.000', icon: '🎯', change: '35%', positive: true },
]

// Data dummy untuk bar chart (CSS-only, tanpa library)
const BAR_DATA = [
  { label: 'Sen', height: 40, amount: 'Rp180rb' },
  { label: 'Sel', height: 65, amount: 'Rp290rb' },
  { label: 'Rab', height: 30, amount: 'Rp135rb' },
  { label: 'Kam', height: 80, amount: 'Rp360rb' },
  { label: 'Jum', height: 55, amount: 'Rp245rb' },
  { label: 'Sab', height: 90, amount: 'Rp405rb' },
  { label: 'Min', height: 45, amount: 'Rp200rb' },
]

// Transaksi dummy
const TRANSACTIONS = [
  { emoji: '☕', name: 'Kopi Kenangan', category: 'Makanan', amount: '-Rp25.000', time: '13:25' },
  { emoji: '⛽', name: 'Bensin Pertamina', category: 'Transport', amount: '-Rp50.000', time: '10:10' },
  { emoji: '💳', name: 'Gaji Oktober', category: 'Pemasukan', amount: '+Rp5.200.000', time: '09:00', positive: true },
  { emoji: '🛒', name: 'Indomaret', category: 'Belanja', amount: '-Rp87.500', time: '08:30' },
  { emoji: '🎬', name: 'Netflix', category: 'Hiburan', amount: '-Rp54.000', time: 'Kemarin' },
]

// Pesan Telegram dummy
const TELEGRAM_MESSAGES = [
  { type: 'user', text: 'beli kopi 25rb' },
  {
    type: 'bot',
    text: `📅 Minggu, 18 Oktober 2026 — 13:25 WIB
💸 Pengeluaran tercatat!
├ Nominal   : Rp25.000
├ Kategori  : ☕ Makanan & Minuman
├ Dompet    : 👛 GoPay
├ Catatan   : kopi
└ Saldo     : Rp850.000

📊 Budget Makanan bulan ini:
████░░░░░░ 40% — sisa Rp180.000`,
  },
]

function useScrollReveal(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const section = ref.current
    if (!section) return

    const elements = section.querySelectorAll<HTMLElement>('[data-reveal]')

    if (mediaQuery.matches) {
      elements.forEach((el) => { el.style.opacity = '1'; el.style.transform = 'none' })
      return
    }

    elements.forEach((el, i) => {
      el.style.opacity = '0'
      el.style.transform = 'translateY(28px)'
      el.style.transition = `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`
    })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const els = section.querySelectorAll<HTMLElement>('[data-reveal]')
            els.forEach((el) => { el.style.opacity = '1'; el.style.transform = 'translateY(0)' })
            observer.unobserve(section)
          }
        })
      },
      { threshold: 0.1 }
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [ref])
}

export default function DashboardPreview() {
  const sectionRef = useRef<HTMLElement>(null)
  const [hoveredBar, setHoveredBar] = useState<number | null>(null)
  useScrollReveal(sectionRef)

  return (
    <section
      ref={sectionRef}
      className="py-20 lg:py-28 bg-white"
      aria-labelledby="dashboard-preview-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div data-reveal>
            <span className="inline-block px-3 py-1 bg-orange-50 border border-orange-200 rounded-full text-xs font-semibold text-orange-500 uppercase tracking-wider mb-4">
              Lihat cara kerjanya
            </span>
          </div>
          <h2
            id="dashboard-preview-heading"
            data-reveal
            className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight"
          >
            Dashboard lengkap +{' '}
            <span className="text-orange-500">Telegram yang simpel</span>
          </h2>
          <p data-reveal className="mt-4 text-lg text-gray-500 leading-relaxed">
            Catat dari mana saja via Telegram, pantau semuanya di dashboard yang rapi.
          </p>
        </div>

        {/* Two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Kolom Kiri — Dashboard Web Preview */}
          <div
            data-reveal
            className="rounded-2xl border border-gray-200 shadow-xl overflow-hidden bg-gray-50 hover:shadow-2xl transition-shadow duration-300 cursor-default"
          >
            {/* Browser chrome */}
            <div className="bg-gray-100 border-b border-gray-200 px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 mx-3 bg-white border border-gray-200 rounded-md px-3 py-1 text-xs text-gray-400 text-center">
                app.tatadana.id/dashboard
              </div>
            </div>

            <div className="p-5 space-y-4">
              {/* Stat Cards */}
              <div className="grid grid-cols-2 gap-3">
                {STAT_CARDS.map((card, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-500">{card.label}</span>
                      <span className="text-lg">{card.icon}</span>
                    </div>
                    <div className="text-base font-bold text-gray-900 leading-none">
                      {card.value}
                    </div>
                    <div
                      className={`text-xs font-medium mt-1 ${card.positive ? 'text-green-500' : 'text-red-400'}`}
                    >
                      {card.change} bulan ini
                    </div>
                  </div>
                ))}
              </div>

              {/* Bar Chart CSS only */}
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-gray-700">Pengeluaran Minggu Ini</span>
                  <span className="text-xs text-gray-400">Okt 2026</span>
                </div>
                <div className="flex items-end gap-2 h-24">
                  {BAR_DATA.map((bar, i) => (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center gap-1 group"
                      onMouseEnter={() => setHoveredBar(i)}
                      onMouseLeave={() => setHoveredBar(null)}
                    >
                      {hoveredBar === i && (
                        <div className="text-[9px] text-gray-500 font-medium whitespace-nowrap">
                          {bar.amount}
                        </div>
                      )}
                      <div
                        className="w-full rounded-t-md transition-all duration-200"
                        style={{
                          height: `${bar.height}%`,
                          background:
                            hoveredBar === i
                              ? 'linear-gradient(180deg, #F97316 0%, #EA580C 100%)'
                              : 'linear-gradient(180deg, #FED7AA 0%, #FDBA74 100%)',
                          minHeight: 4,
                        }}
                      />
                      <span className="text-[9px] text-gray-400">{bar.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transaksi */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-700">Transaksi Terbaru</span>
                  <span className="text-xs text-orange-500 font-medium">Lihat semua</span>
                </div>
                <div className="divide-y divide-gray-50">
                  {TRANSACTIONS.map((tx, i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-2.5">
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-base flex-shrink-0">
                        {tx.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-gray-800 truncate">{tx.name}</div>
                        <div className="text-[10px] text-gray-400">{tx.category} · {tx.time}</div>
                      </div>
                      <div
                        className={`text-xs font-bold flex-shrink-0 ${tx.positive ? 'text-green-500' : 'text-gray-800'}`}
                      >
                        {tx.amount}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Kanan — Telegram Bot Preview */}
          <div
            data-reveal
            className="rounded-2xl border border-gray-200 shadow-xl overflow-hidden bg-gray-50 hover:shadow-2xl transition-shadow duration-300 cursor-default"
          >
            {/* Telegram header */}
            <div
              className="px-4 py-3 flex items-center gap-3 border-b border-gray-200"
              style={{ background: 'linear-gradient(90deg, #F97316 0%, #EA580C 100%)' }}
            >
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">TD</span>
              </div>
              <div>
                <div className="text-white font-semibold text-sm">TataDana Bot</div>
                <div className="text-white/70 text-xs">online</div>
              </div>
              <div className="ml-auto flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-400" />
              </div>
            </div>

            {/* Chat messages */}
            <div className="p-4 space-y-3 min-h-[400px] bg-[#F0F0F0]" style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23E5E5E5\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M0 40L40 0H20L0 20M40 40V20L20 40\'/%3E%3C/g%3E%3C/svg%3E")',
            }}>
              {/* Pesan user */}
              <div className="flex justify-end">
                <div className="max-w-[75%] bg-[#DCF8C6] rounded-2xl rounded-tr-sm px-4 py-2.5 shadow-sm">
                  <p className="text-sm text-gray-800">{TELEGRAM_MESSAGES[0].text}</p>
                  <p className="text-[10px] text-gray-400 text-right mt-1">13:25 ✓✓</p>
                </div>
              </div>

              {/* Reply bot */}
              <div className="flex justify-start">
                <div className="max-w-[85%] bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                  <pre
                    className="text-xs text-gray-800 font-mono leading-relaxed whitespace-pre-wrap break-words"
                    style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, monospace' }}
                  >
                    {TELEGRAM_MESSAGES[1].text}
                  </pre>
                  <p className="text-[10px] text-gray-400 text-right mt-1.5">13:25</p>
                </div>
              </div>

              {/* Typing indicator hint */}
              <div className="flex justify-end opacity-60">
                <div className="bg-[#DCF8C6] rounded-2xl rounded-tr-sm px-4 py-2.5 shadow-sm">
                  <p className="text-sm text-gray-600">makan siang 35rb warteg</p>
                  <p className="text-[10px] text-gray-400 text-right mt-1">13:42 ✓✓</p>
                </div>
              </div>
            </div>

            {/* Input bar dummy */}
            <div className="bg-gray-100 border-t border-gray-200 px-3 py-2.5 flex items-center gap-2">
              <div className="flex-1 bg-white rounded-full px-4 py-2 text-xs text-gray-400 border border-gray-200">
                Ketik pesan...
              </div>
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)' }}
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-white fill-white">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
