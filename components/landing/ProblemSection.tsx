'use client'

import { useEffect, useRef } from 'react'
import { ChevronDown } from 'lucide-react'

const PROBLEMS = [
  {
    emoji: '📱',
    title: 'Buka aplikasi keuangan? Nanti dulu deh...',
    description:
      'Aplikasi yang ribet dan penuh form bikin malas mencatat. Akhirnya pengeluaran menumpuk tak tercatat, dan kamu kehilangan gambaran besar keuanganmu.',
  },
  {
    emoji: '🤔',
    title: 'Kok uangnya habis ya? Padahal kayak tidak beli apa-apa',
    description:
      'Pengeluaran kecil — kopi pagi, parkir, jajan snack — terasa sepele tapi perlahan menguras saldo. Karena tidak dicatat, kamu tidak pernah sadar polanya.',
  },
  {
    emoji: '📊',
    title: 'Udah niat bikin budget, tapi seminggu lupa',
    description:
      'Membuat budget di awal bulan lalu melupakannya adalah siklus yang berulang. Budget tanpa pemantauan rutin sama saja tidak ada budget sama sekali.',
  },
]

function useScrollReveal(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const section = ref.current
    if (!section) return

    const elements = section.querySelectorAll<HTMLElement>('[data-reveal]')

    if (mediaQuery.matches) {
      elements.forEach((el) => {
        el.style.opacity = '1'
        el.style.transform = 'none'
      })
      return
    }

    elements.forEach((el, i) => {
      el.style.opacity = '0'
      el.style.transform = 'translateY(32px)'
      el.style.transition = `opacity 0.65s ease ${i * 0.12}s, transform 0.65s ease ${i * 0.12}s`
    })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const els = section.querySelectorAll<HTMLElement>('[data-reveal]')
            els.forEach((el) => {
              el.style.opacity = '1'
              el.style.transform = 'translateY(0)'
            })
            observer.unobserve(section)
          }
        })
      },
      { threshold: 0.15 }
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [ref])
}

export default function ProblemSection() {
  const sectionRef = useRef<HTMLElement>(null)
  useScrollReveal(sectionRef)

  return (
    <section
      ref={sectionRef}
      className="py-20 lg:py-28 bg-gray-50"
      aria-labelledby="problem-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div data-reveal>
            <span className="inline-block px-3 py-1 bg-red-50 border border-red-200 rounded-full text-xs font-semibold text-red-500 uppercase tracking-wider mb-4">
              Masalah yang sering terjadi
            </span>
          </div>
          <h2
            id="problem-heading"
            data-reveal
            className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight"
          >
            Kamu sendirian tidak merasa seperti ini?
          </h2>
          <p data-reveal className="mt-4 text-lg text-gray-500 leading-relaxed">
            Banyak orang punya niat mencatat keuangan, tapi gagal karena alat yang salah.
          </p>
        </div>

        {/* Problem cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {PROBLEMS.map((problem, i) => (
            <div
              key={i}
              data-reveal
              className="relative bg-white rounded-2xl p-7 shadow-sm border border-gray-200 border-l-4 hover:shadow-md transition-shadow duration-300 group"
              style={{ borderLeftColor: '#F97316' }}
            >
              {/* Emoji besar */}
              <div className="text-4xl mb-5 group-hover:scale-105 transition-transform duration-300">
                {problem.emoji}
              </div>
              <h3 className="text-base font-bold text-gray-900 leading-snug mb-3">
                {problem.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">{problem.description}</p>

              {/* Decorative corner */}
              <div
                className="absolute bottom-0 right-0 w-16 h-16 rounded-br-2xl opacity-5"
                style={{ background: 'linear-gradient(135deg, transparent 50%, #F97316 50%)' }}
                aria-hidden="true"
              />
            </div>
          ))}
        </div>

        {/* Transisi ke solusi */}
        <div className="mt-20 text-center" data-reveal>
          <div className="inline-flex flex-col items-center gap-4">
            <p className="text-xl sm:text-2xl font-bold text-gray-900">
              Bagaimana kalau mencatat keuangan{' '}
              <span className="text-orange-500">semudah kirim pesan ke teman?</span>
            </p>
            <div className="flex flex-col items-center gap-2 text-gray-400">
              <ChevronDown
                className="w-6 h-6 animate-bounce"
                style={{ animationDuration: '1.5s' }}
                aria-hidden="true"
              />
              <span className="text-base font-semibold text-gray-600">
                Introducing{' '}
                <span className="text-orange-500 font-extrabold">TataDana</span>{' '}
                ↓
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
