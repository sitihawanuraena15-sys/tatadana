'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, CheckCircle2, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

// ────────────────────────────────────────────────────────────
// Skema validasi
// ────────────────────────────────────────────────────────────
const emailLoginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email wajib diisi')
    .email('Format email tidak valid'),
  password: z
    .string()
    .min(8, 'Password minimal 8 karakter'),
})

const phoneLoginSchema = z.object({
  phone: z
    .string()
    .min(1, 'Nomor HP wajib diisi')
    .regex(
      /^(\+62|62|0)8[1-9][0-9]{6,10}$/,
      'Format nomor HP tidak valid. Contoh: 081234567890',
    ),
})

type EmailLoginInput = z.infer<typeof emailLoginSchema>
type PhoneLoginInput = z.infer<typeof phoneLoginSchema>

// ────────────────────────────────────────────────────────────
// Panel Kiri — hanya tampil di desktop
// ────────────────────────────────────────────────────────────
function BrandingPanel() {
  const fiturList = [
    'Catat pemasukan & pengeluaran otomatis',
    'Analisis keuangan berbasis AI',
    'Terintegrasi dengan Telegram Bot',
    'Laporan keuangan detail setiap bulan',
  ]

  return (
    <div className="hidden lg:flex lg:w-2/5 relative overflow-hidden flex-col justify-between p-10 bg-gradient-to-br from-orange-500 to-orange-600">
      {/* Pattern dots transparan */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Lingkaran dekoratif */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/10" />
      <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-white/10" />

      <div className="relative z-10">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-12">
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow">
            <span className="text-orange-500 font-extrabold text-lg leading-none">
              T
            </span>
          </div>
          <span className="text-white font-extrabold text-xl tracking-tight">
            TataDana
          </span>
        </div>

        {/* Tagline */}
        <h1 className="text-white font-extrabold text-4xl xl:text-5xl leading-tight mb-4">
          Keuanganmu.
          <br />
          Terkontrol.
        </h1>
        <p className="text-orange-100 text-base xl:text-lg font-medium mb-10">
          Catat setiap rupiah, kendalikan setiap hari.
        </p>

        {/* Fitur */}
        <ul className="space-y-4">
          {fiturList.map((f) => (
            <li key={f} className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-white mt-0.5 shrink-0" />
              <span className="text-orange-50 text-sm font-medium">{f}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer branding */}
      <div className="relative z-10">
        <p className="text-orange-200 text-xs">
          © {new Date().getFullYear()} TataDana. Semua hak dilindungi.
        </p>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// Komponen utama LoginForm
// ────────────────────────────────────────────────────────────
export default function LoginForm() {
  const router = useRouter()
  const supabase = createClient()

  const [loginMode, setLoginMode] = useState<'email' | 'phone'>('email')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  // Form email
  const emailForm = useForm<EmailLoginInput>({
    resolver: zodResolver(emailLoginSchema),
    defaultValues: { email: '', password: '' },
  })

  // Form phone
  const phoneForm = useForm<PhoneLoginInput>({
    resolver: zodResolver(phoneLoginSchema),
    defaultValues: { phone: '' },
  })

  // ── Login dengan email & password ──
  async function handleEmailLogin(data: EmailLoginInput) {
    setServerError(null)
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })
    if (error) {
      setServerError(
        error.message === 'Invalid login credentials'
          ? 'Email atau password salah. Periksa kembali.'
          : 'Terjadi kesalahan. Coba lagi.',
      )
      return
    }
    router.push('/dashboard')
    router.refresh()
  }

  // ── Login dengan Google OAuth ──
  async function handleGoogleLogin() {
    setIsLoadingGoogle(true)
    setServerError(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    })
    if (error) {
      setServerError('Gagal masuk dengan Google. Coba lagi.')
      setIsLoadingGoogle(false)
    }
  }

  // ── Kirim OTP ke nomor HP ──
  async function handlePhoneLogin(data: PhoneLoginInput) {
    setServerError(null)
    // Normalkan nomor ke format +62
    const normalized = data.phone.startsWith('0')
      ? '+62' + data.phone.slice(1)
      : data.phone.startsWith('62')
      ? '+' + data.phone
      : data.phone

    const { error } = await supabase.auth.signInWithOtp({
      phone: normalized,
    })
    if (error) {
      setServerError('Gagal mengirim OTP. Periksa nomor HP kamu.')
      return
    }
    // Redirect ke halaman OTP dengan nomor HP
    router.push(
      `/login/otp?phone=${encodeURIComponent(normalized)}`,
    )
  }

  return (
    <div className="min-h-screen flex">
      <BrandingPanel />

      {/* Panel Kanan */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-12">
        <div className="w-full max-w-md">
          {/* Header mobile */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center">
              <span className="text-white font-extrabold text-base leading-none">
                T
              </span>
            </div>
            <span className="text-gray-900 font-extrabold text-lg tracking-tight">
              TataDana
            </span>
          </div>

          <h2 className="text-gray-900 font-extrabold text-2xl xl:text-3xl mb-1">
            Selamat datang kembali!
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            Masuk untuk melanjutkan mengelola keuanganmu.
          </p>

          {/* Error global */}
          {serverError && (
            <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-red-700 text-sm">
              {serverError}
            </div>
          )}

          {/* Tab login mode */}
          <div className="flex gap-1 mb-6 p-1 bg-gray-100 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setLoginMode('email')
                setServerError(null)
              }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                loginMode === 'email'
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Email
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginMode('phone')
                setServerError(null)
              }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                loginMode === 'phone'
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Nomor HP
            </button>
          </div>

          {/* Form email */}
          {loginMode === 'email' && (
            <form
              onSubmit={emailForm.handleSubmit(handleEmailLogin)}
              noValidate
              className="space-y-5"
            >
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-1.5"
                >
                  Alamat Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="nama@email.com"
                  {...emailForm.register('email')}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm text-gray-900 placeholder:text-gray-400 bg-white transition-all duration-200 outline-none
                    focus:ring-2 focus:ring-orange-500 focus:border-orange-500
                    ${emailForm.formState.errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                />
                {emailForm.formState.errors.email && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {emailForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium text-orange-500 hover:text-orange-600 transition-colors"
                  >
                    Lupa password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Minimal 8 karakter"
                    {...emailForm.register('password')}
                    className={`w-full px-4 py-2.5 pr-11 rounded-xl border text-sm text-gray-900 placeholder:text-gray-400 bg-white transition-all duration-200 outline-none
                      focus:ring-2 focus:ring-orange-500 focus:border-orange-500
                      ${emailForm.formState.errors.password ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {emailForm.formState.errors.password && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {emailForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={emailForm.formState.isSubmitting}
                className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-md shadow-orange-200"
              >
                {emailForm.formState.isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  'Masuk'
                )}
              </button>
            </form>
          )}

          {/* Form nomor HP */}
          {loginMode === 'phone' && (
            <form
              onSubmit={phoneForm.handleSubmit(handlePhoneLogin)}
              noValidate
              className="space-y-5"
            >
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-semibold text-gray-700 mb-1.5"
                >
                  Nomor HP
                </label>
                <div className="flex gap-2">
                  {/* Flag Indonesia */}
                  <div className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-600 font-medium shrink-0 select-none">
                    <span>🇮🇩</span>
                    <span>+62</span>
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="081234567890"
                    {...phoneForm.register('phone')}
                    className={`flex-1 px-4 py-2.5 rounded-xl border text-sm text-gray-900 placeholder:text-gray-400 bg-white transition-all duration-200 outline-none
                      focus:ring-2 focus:ring-orange-500 focus:border-orange-500
                      ${phoneForm.formState.errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                  />
                </div>
                {phoneForm.formState.errors.phone && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {phoneForm.formState.errors.phone.message}
                  </p>
                )}
                <p className="mt-1.5 text-xs text-gray-400">
                  Kode OTP akan dikirim via SMS ke nomor ini
                </p>
              </div>

              <button
                type="submit"
                disabled={phoneForm.formState.isSubmitting}
                className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-md shadow-orange-200"
              >
                {phoneForm.formState.isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Mengirim OTP...
                  </>
                ) : (
                  'Kirim OTP'
                )}
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">
              atau login dengan
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Google OAuth */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoadingGoogle}
            className="w-full py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-60 text-gray-700 font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-3 shadow-sm"
          >
            {isLoadingGoogle ? (
              <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
            ) : (
              /* Google SVG Icon */
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
                  fill="#4285F4"
                />
                <path
                  d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
                  fill="#34A853"
                />
                <path
                  d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
                  fill="#FBBC05"
                />
                <path
                  d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
                  fill="#EA4335"
                />
              </svg>
            )}
            Masuk dengan Google
          </button>

          {/* Link ke register */}
          <p className="text-center text-sm text-gray-500 mt-8">
            Belum punya akun?{' '}
            <Link
              href="/register"
              className="font-semibold text-orange-500 hover:text-orange-600 transition-colors"
            >
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
