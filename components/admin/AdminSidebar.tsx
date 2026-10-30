'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Bot,
  CreditCard,
  FileText,
  Download,
  Settings,
  ArrowLeft,
  Shield,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const menuItems = [
  {
    label: 'Overview',
    href: '/admin',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: 'Users',
    href: '/admin/users',
    icon: Users,
  },
  {
    label: 'AI Providers',
    href: '/admin/ai-providers',
    icon: Bot,
  },
  {
    label: 'Payments',
    href: '/admin/payments',
    icon: CreditCard,
  },
  {
    label: 'AI Logs',
    href: '/admin/logs',
    icon: FileText,
  },
  {
    label: 'Export Data',
    href: '/admin/export',
    icon: Download,
  },
  {
    label: 'Settings Admin',
    href: '/admin/settings',
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-900 flex flex-col z-50 overflow-y-auto">
      {/* Logo & Brand */}
      <div className="px-6 py-6 border-b border-gray-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">TD</span>
          </div>
          <div>
            <span className="text-white font-bold text-lg leading-tight">
              TataDana
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-orange-400" />
          <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider">
            Admin Panel
          </span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold px-3 mb-3">
          Menu
        </p>
        {menuItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href, item.exact)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                active
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              )}
            >
              <Icon className={cn('w-4.5 h-4.5 flex-shrink-0', active ? 'text-white' : 'text-gray-500')} />
              <span>{item.label}</span>
              {active && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Divider + Back to Dashboard */}
      <div className="px-3 pb-6">
        <div className="border-t border-gray-800 pt-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 flex-shrink-0 text-gray-500" />
            <span>Kembali ke Dashboard</span>
          </Link>
        </div>
      </div>
    </aside>
  )
}
