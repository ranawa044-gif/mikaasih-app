# Mikaasih — Kenali Cara Kamu Mengasihi 🌸

> **Mikaasih** (*Sundanese: mengasihi / mencintai*) adalah aplikasi web psikometri modern untuk mengenali profil bahasa cinta (*The 5 Love Languages*) dan mengukur kompatibilitas keserasian bahasa kasih antar pasangan secara 100% privat dan bebas bias.

🌐 **Website Resmi:** [mikaasih.cyou](https://mikaasih.cyou/)

---

## ✨ Fitur Utama

- **30 Skenario Komparatif (*Forced-Choice*):** Dirancang dengan metodologi psikometri berpasangan (*ipsative scoring*) untuk mengeliminasi bias respons sosial.
- **Dual Mode Tema (Warm Daylight ☀️ & Midnight Obsidian 🌙):** Pengalaman visual elegan dengan *Living Gradient* dan *Frosted Glass* yang nyaman untuk penggunaan siang maupun malam hari.
- **Analisis Keserasian Pasangan (*Couple Match*):** Mengukur indeks kompatibilitas pasangan menggunakan *Chapman Distance Formula*, memetakan titik temu (*Shared Strengths*) dan area yang memerlukan komunikasi (*Friction Points*).
- **Alur Berbagi 1-Klik WhatsApp (*Feedback Share Loop*):** Bagikan hasil perbandingan langsung ke chat WhatsApp pasangan dengan tautan instan tanpa perlu registrasi/login.
- **Generator Kartu Visual HD (1080×1920 PNG):** Unduh kartu profil pribadi dan kartu perbandingan pasangan beresolusi tinggi siap bagikan untuk Instagram Story / WhatsApp Status.
- **100% Client-Side & Serverless:** Tidak menyimpan data pribadi di database server cloud, seluruh skor terenkripsi langsung di URL dan penyimpanan lokal peramban.

---

## 🛠️ Tech Stack

- **Framework:** React 19 + TypeScript
- **Bundler:** Vite
- **Styling:** Tailwind CSS + Custom Frosted Glass System
- **Animations:** Framer Motion (Page Transitions & Spring Physics)
- **Canvas Rendering:** HTML5 Canvas API (High-DPI 2x Retina Export)
- **Deployment:** Tencent Cloud EdgeOne Pages

---

## 🚀 Menjalankan Secara Lokal

```bash
# 1. Clone repositori
git clone https://github.com/USERNAME/REPO_NAME.git
cd REPO_NAME

# 2. Instal dependensi
npm install

# 3. Jalankan server pengembangan
npm run dev

# 4. Build untuk produksi
npm run build
```

---

## ☁️ Deployment ke Tencent EdgeOne Pages

1. Masuk ke console **Tencent Cloud EdgeOne Pages**.
2. Hubungkan repositori GitHub ini.
3. Konfigurasi build:
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Hubungkan domain kustom **`mikaasih.cyou`** pada menu *Custom Domains*.

---

© 2026 Mikaasih. Dikembangkan dengan penuh kasih.
