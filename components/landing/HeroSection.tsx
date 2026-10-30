'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { Sparkles, ArrowRight, Play } from 'lucide-react'

const STATS = [
  { value: '10.000+', label: 'pengguna aktif' },
  { value: '4.9★', label: 'rating pengguna' },
  { value: '99.9%', label: 'uptime' },
]

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    // Respektif terhadap prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mediaQuery.matches) return

    const children = sectionRef.current?.querySelectorAll<HTMLElement>('[data-animate]')
    if (!children) return

    children.forEach((el, i) => {
      el.style.opacity = '0'
      el.style.transform = 'translateY(24px)'
      el.style.transition = `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`
    })

    // Trigger animasi setelah mount
    const timer = setTimeout(() => {
      children.forEach((el) => {
        el.style.opacity = '1'
        el.style.transform = 'translateY(0)'
      })
    }, 50)

    return () => clearTimeout(timer)
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Background decorative blobs */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full opacity-[0.06] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, #F97316 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute top-1/4 -left-40 w-80 h-80 rounded-full opacity-[0.04] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, #F97316 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center gap-6">
        {/* Badge */}
        <div
          data-animate
          className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-200 rounded-full text-sm font-medium text-orange-600"
        >
          <Sparkles className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
          <span>Catat keuangan langsung dari Telegram</span>
        </div>

        {/* Heading */}
        <h1
          id="hero-heading"
          data-animate
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight"
        >
          Gaji habis sebelum akhir bulan?
          <br />
          Sudah saatnya kamu tahu ke mana{' '}
          <span
            className="inline-block"
            style={{
              background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            uangmu pergi.
          </span>
        </h1>

        {/* Subheading */}
        <p
          data-animate
          className="text-lg sm:text-xl text-gray-500 max-w-2xl leading-relaxed"
        >
          TataDana mencatat setiap pengeluaranmu langsung dari chat Telegram atau foto
          struk — sisanya kami yang urus.
        </p>

        {/* CTA Buttons */}
        <div data-animate className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-7 py-3.5 text-base font-semibold text-white bg-orange-500 rounded-full hover:bg-orange-600 shadow-lg hover:shadow-orange-200 hover:shadow-xl transition-all duration-200"
          >
            Mulai Gratis Sekarang
          </Link>
          <button
            onClick={() => {
              document.querySelector('#fitur')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="inline-flex items-center gap-2 px-6 py-3.5 text-base font-semibold text-gray-700 hover:text-orange-500 transition-colors duration-200 group"
          >
            Lihat cara kerjanya
            <ArrowRight
              className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"
              aria-hidden="true"
            />
          </button>
        </div>

        {/* Stats */}
        <div
          data-animate
          className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mt-2"
          aria-label="Statistik pengguna TataDana"
        >
          {STATS.map((stat, i) => (
            <div key={i} className="flex flex-col items-center gap-0.5">
              <span className="text-xl font-bold text-gray-900">{stat.value}</span>
              <span className="text-sm text-gray-500">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Hero Video Placeholder */}
        {/* TODO: Ganti dengan video demo asli setelah tersedia */}
        <div
          data-animate
          className="w-full max-w-3xl mt-4 rounded-2xl overflow-hidden shadow-2xl border border-gray-100"
          style={{ aspectRatio: '16/9' }}
          aria-label="Placeholder video demo TataDana"
        >
          <div
            className="w-full h-full flex flex-col items-center justify-center relative"
            style={{
              background: 'linear-gradient(135deg, #F97316 0%, #F59E0B 50%, #EA580C 100%)',
            }}
          >
            {/* Decorative grid */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,0.3) 39px, rgba(255,255,255,0.3) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(255,255,255,0.3) 39px, rgba(255,255,255,0.3) 40px)',
              }}
              aria-hidden="true"
            />
            {/* Play button */}
            <button
              className="relative z-10 group flex flex-col items-center gap-4 cursor-pointer"
              aria-label="Putar video demo TataDana"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm border-2 border-white/60 rounded-full flex items-center justify-center group-hover:bg-white/30 group-hover:scale-105 transition-all duration-300">
                <Play
                  className="w-7 h-7 sm:w-8 sm:h-8 text-white fill-white ml-1"
                  aria-hidden="true"
                />
              </div>
              <span className="text-white font-semibold text-lg sm:text-xl tracking-wide drop-shadow-sm">
                Demo TataDana
              </span>
              <span className="text-white/70 text-sm">Video demo segera hadir</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
