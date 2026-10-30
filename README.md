# TataDana (Fintech Management & Telegram Bot Integration)

Aplikasi SaaS manajemen keuangan pribadi Indonesia dengan tema modern **Orange-Putih**, terintegrasi penuh dengan Telegram Bot, arsitektur Supabase (PostgreSQL + RLS + Auth + Storage), Midtrans payment gateway, dan Multi-AI Provider Orchestration (Gemini, GPT-4o, DeepSeek).

---

## 🚀 Fitur Utama & Kepatuhan Spesifikasi

### 1. Database & Autentikasi (Supabase)
- **Skema Lengkap Migrasi**: Terletak di [`supabase/migrations/20261018000001_initial_schema.sql`](supabase/migrations/20261018000001_initial_schema.sql)
- **Timezone**: Seluruh timestamp dikunci di **WIB (Asia/Jakarta, UTC+7)**.
- **Row-Level Security (RLS)**: Enforced di semua tabel pengguna.
- **Audit Logging**: Akses transaksi user oleh admin dicatat secara ketat di tabel `admin_audit_logs`.

### 2. Integrasi Telegram Bot & Multi-AI NLP
- **Endpoint Webhook**: `/api/telegram/webhook` (Idempotent berbasis `update_id`).
- **Parsing Natural Language (Bahasa Indonesia)**: Menangani format umum (`15rb`, `25k`, `1.5jt`, `50.000`).
- **Scan Foto Struk (AI Vision)**: Khusus paket Pro — mengekstrak merchant, multi-item, dan harga satuan.
- **Voice Note Input**: STT speech-to-text pipeline dengan batas durasi 60 detik.
- **Format Balasan Real**: Lengkap dengan progress bar visual (`██████░░░░ 62%`) dan pesan motivasi.
- **Commands**: `/saldo`, `/hari ini`, `/minggu ini`, `/bulan ini`, `/budget`, `/sheet`, `/bantuan`.

### 3. User Dashboard
- **Stats Cards**: Saldo Total, Pemasukan Bulan Ini, Pengeluaran Bulan Ini, Sisa Budget.
- **Visual Charts**: Doughnut chart kategori pengeluaran & Bar chart 6 bulan perbandingan arus kas.
- **Multi-Wallet**: Dukungan banyak dompet (Bank BCA, Kas Tunai, E-Wallet GoPay/OVO) dengan 1 default Telegram.
- **Laporan & Ekspor**: Filter tabel interaktif + Ekspor instan ke file **Excel (.xlsx)** & **PDF**.
- **Settings**: Integrasi Telegram bot (tombol Test Koneksi riil), pengaturan reminder harian (maks 2x sehari).

### 4. Superadmin Control Hub
- **Multi-AI Provider Manager**: Atur Gemini 1.5 Flash, GPT-4o-mini, dan DeepSeek V3 (Single / Paralel Failover).
- **User Impersonation**: Masuk ke tampilan user untuk customer support tanpa re-login.
- **Monitoring Biaya AI**: Log pemanggilan API token dan estimasi biaya per feature call.

### 5. Landing Page
- 11 Section lengkap dengan desain referensi Fintech Orange-Putih premium.
- Pricing toggle Starter (Rp49rb/bulan) vs Pro Lifetime (Rp99rb sekali bayar).
- FAQ interaktif 7 pertanyaan umum.

---

## 🏃 Cara Menjalankan Aplikasi

Aplikasi berjalan di server lokal:
```bash
# Menjalankan server aplikasi web & API:
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000

# Menjalankan rangkaian pengujian otomatis end-to-end:
python -m tests.test_e2e
```

Akses tautan browser:
- **Landing Page**: [http://127.0.0.1:8000/](http://127.0.0.1:8000/)
- **Auth (Login / Register)**: [http://127.0.0.1:8000/login](http://127.0.0.1:8000/login)
- **User Dashboard**: [http://127.0.0.1:8000/dashboard](http://127.0.0.1:8000/dashboard)
- **Superadmin Dashboard**: [http://127.0.0.1:8000/admin](http://127.0.0.1:8000/admin)
- **API Documentation**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
