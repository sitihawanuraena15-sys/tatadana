'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { BarChart2, X, Menu } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Fitur', href: '#fitur' },
  { label: 'Harga', href: '#harga' },
  { label: 'FAQ', href: '#faq' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 10)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  // Tutup drawer saat resize ke desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setDrawerOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Cegah scroll saat drawer terbuka
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  const handleNavClick = (href: string) => {
    setDrawerOpen(false)
    // Smooth scroll ke section
    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <header
        className={[
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100'
            : 'bg-transparent',
        ].join(' ')}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 group"
              aria-label="TataDana — Halaman Utama"
            >
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center shadow-sm group-hover:bg-orange-600 transition-colors duration-200">
                <BarChart2 className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">
                Tata<span className="text-orange-500">Dana</span>
              </span>
            </Link>

            {/* Nav Desktop */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Navigasi utama">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-orange-500 rounded-lg hover:bg-orange-50 transition-all duration-200"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* CTA Desktop */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-semibold text-orange-500 border border-orange-500 rounded-full hover:bg-orange-50 transition-all duration-200"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="px-5 py-2 text-sm font-semibold text-white bg-orange-500 rounded-full hover:bg-orange-600 shadow-sm hover:shadow-md transition-all duration-200"
              >
                Coba Gratis
              </Link>
            </div>

            {/* Hamburger Mobile */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-orange-500 hover:bg-orange-50 transition-colors duration-200"
              aria-label="Buka menu navigasi"
              aria-expanded={drawerOpen}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <div
        className={[
          'fixed inset-0 z-50 md:hidden transition-all duration-300',
          drawerOpen ? 'visible' : 'invisible',
        ].join(' ')}
        aria-hidden={!drawerOpen}
      >
        {/* Backdrop */}
        <div
          className={[
            'absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300',
            drawerOpen ? 'opacity-100' : 'opacity-0',
          ].join(' ')}
          onClick={() => setDrawerOpen(false)}
        />

        {/* Drawer Panel */}
        <div
          className={[
            'absolute top-0 right-0 h-full w-72 bg-white shadow-2xl',
            'transform transition-transform duration-300 ease-out',
            'flex flex-col',
            drawerOpen ? 'translate-x-0' : 'translate-x-full',
          ].join(' ')}
        >
          {/* Header Drawer */}
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-orange-500 rounded-md flex items-center justify-center">
                <BarChart2 className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-lg font-bold text-gray-900">
                Tata<span className="text-orange-500">Dana</span>
              </span>
            </div>
            <button
              onClick={() => setDrawerOpen(false)}
              className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              aria-label="Tutup menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-col gap-1 p-4 flex-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-left px-4 py-3 text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all duration-200"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* CTA Drawer */}
          <div className="p-4 border-t border-gray-100 flex flex-col gap-3">
            <Link
              href="/login"
              onClick={() => setDrawerOpen(false)}
              className="w-full text-center py-3 text-sm font-semibold text-orange-500 border border-orange-500 rounded-full hover:bg-orange-50 transition-all duration-200"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              onClick={() => setDrawerOpen(false)}
              className="w-full text-center py-3 text-sm font-semibold text-white bg-orange-500 rounded-full hover:bg-orange-600 transition-all duration-200 shadow-sm"
            >
              Coba Gratis
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
