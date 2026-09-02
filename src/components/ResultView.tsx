// =====================================================
// MIKAASIH — ResultView
// Frosted glass hero badge, staggered bars,
// interactive Do's & Don'ts tabs, Couple Invite Card, action toolbar
// Full Dynamic Theme Integration
// =====================================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { AssessmentResult, DimensionKey, DimensionResult } from '../engine/types';

export interface ResultViewProps {
  userName: string;
  result: AssessmentResult;
  onRetake: () => void;
  onShareLink: () => void;
  onShareWhatsApp?: () => void;
  onExportCard: () => void;
  onComparePartner: () => void;
  connectedPartnerName?: string | null;
}

const DIMENSION_CONFIG: Record<DimensionKey, {
  name: string; shortName: string; color: string; barColor: string;
  bgGlass: string; tagline: string; dos: string[]; donts: string[];
}> = {
  W: {
    name: 'Words of Affirmation', shortName: 'Kata Pujian',
    color: '#F59E0B', barColor: '#F59E0B',
    bgGlass: 'rgba(245,158,11,0.14)',
    tagline: 'Pujian tulus, pengakuan verbal, dan kata-kata penenang adalah sumber energi kasihmu.',
    dos: [
      'Berikan pujian spesifik atas usaha atau karakternya, bukan hanya hasil akhir.',
      'Kirimkan pesan penyemangat singkat di tengah rutinitas yang sibuk.',
      'Ucapkan terima kasih yang tulus atas hal-hal kecil yang dilakukannya.',
    ],
    donts: [
      'Menggunakan kata-kata kasar atau kritik yang menyerang kepribadian.',
      'Menerapkan silent treatment saat terjadi perselisihan.',
      'Mengabaikan pencapaian yang diceritakan dengan antusias.',
    ],
  },
  Q: {
    name: 'Quality Time', shortName: 'Waktu Bersama',
    color: '#14B8A6', barColor: '#14B8A6',
    bgGlass: 'rgba(20,184,166,0.14)',
    tagline: 'Kehadiran penuh, obrolan mendalam, dan momen berdua tanpa distraksi adalah bahasamu.',
    dos: [
      'Jaga kontak mata dan dengarkan secara aktif tanpa menyela.',
      'Jadwalkan agenda rutin berdua tanpa gangguan gawai.',
      'Lakukan aktivitas hobi atau jalan santai bersama.',
    ],
    donts: [
      'Terus menatap layar ponsel saat pasangan sedang berbicara.',
      'Membatalkan agenda berdua secara mendadak demi hal sepele.',
      'Hadir secara fisik namun pikiran terdistraksi hal lain.',
    ],
  },
  G: {
    name: 'Receiving Gifts', shortName: 'Pemberian Hadiah',
    color: '#FBBF24', barColor: '#FBBF24',
    bgGlass: 'rgba(251,191,36,0.14)',
    tagline: 'Simbol visual cinta dan buah pemikiran — niat jauh lebih berharga dari harganya.',
    dos: [
      'Bawakan oleh-oleh kecil yang menunjukkan kamu mengingatnya.',
      'Catat barang yang pernah ia sebutkan untuk kejutan di masa depan.',
      'Bungkus hadiah dengan rapi atau sertakan kartu catatan tangan.',
    ],
    donts: [
      'Melupakan hari ulang tahun atau momen peringatan penting.',
      'Memberi hadiah asal-asalan tanpa melihat preferensinya.',
      'Mengungkit atau menghitung nilai uang dari hadiah yang diberikan.',
    ],
  },
  S: {
    name: 'Acts of Service', shortName: 'Tindakan Nyata',
    color: '#A8A29E', barColor: '#A8A29E',
    bgGlass: 'rgba(168,162,158,0.14)',
    tagline: 'Aksi nyata yang meringankan beban membuktikan cinta lebih dari kata-kata.',
    dos: [
      'Ambil inisiatif membantu tugas tanpa harus diminta berulang kali.',
      'Siapkan kebutuhan praktis saat pasangan sedang lelah atau sakit.',
      'Tepati komitmen bantuan yang sudah dijanjikan sebelumnya.',
    ],
    donts: [
      'Mengumbar janji bantuan tetapi tidak pernah direalisasikan.',
      'Menunjukkan rasa kesal atau mengeluh saat dimintai tolong.',
      'Menambah beban kerja saat melihat pasangan kewalahan.',
    ],
  },
  T: {
    name: 'Physical Touch', shortName: 'Sentuhan Fisik',
    color: '#FB7185', barColor: '#FB7185',
    bgGlass: 'rgba(251,113,133,0.14)',
    tagline: 'Rasa aman, penerimaan, dan kehangatan melalui kedekatan fisik sehari-hari.',
    dos: [
      'Berikan pelukan hangat saat menyambut atau berpisah beraktivitas.',
      'Genggam tangan atau rangkul pundak saat berjalan bersama.',
      'Sentuh lengan atau punggung secara lembut saat pasangan cemas.',
    ],
    donts: [
      'Menolak kontak fisik secara dingin saat terjadi perselisihan.',
      'Mengabaikan kebutuhan kedekatan fisik dalam waktu yang lama.',
      'Bersikap kaku dan menjaga jarak fisik di situasi privat.',
    ],
  },
};

const DIMS: DimensionKey[] = ['W', 'Q', 'G', 'S', 'T'];

const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.09 } },
};
const fadeUp = {
  hidden:  { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

export const ResultView: React.FC<ResultViewProps> = ({
  userName,
  result,
  onRetake,
  onShareLink,
  onShareWhatsApp,
  onExportCard,
  onComparePartner,
  connectedPartnerName,
}) => {
  const primaryDim = result.primary_dimensions[0];
  const cfg        = DIMENSION_CONFIG[primaryDim];
  const [activeTab, setActiveTab] = useState<DimensionKey>(primaryDim);

  const getProfileTitle = () => {
    if (result.profile_type === 'Single Primary')       return cfg.name;
    if (result.profile_type === 'Co-Primary / Bilingual')
      return `${DIMENSION_CONFIG[result.primary_dimensions[0]].name} & ${DIMENSION_CONFIG[result.primary_dimensions[1]].name}`;
    if (result.profile_type === 'Balanced / Undifferentiated') return 'Profil Seimbang';
    return 'Profil Multimodal';
  };

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="w-full max-w-2xl mx-auto px-4 py-8 space-y-5 pb-16"
    >

      {/* ── 0. Connected Partner Alert Banner ── */}
      {connectedPartnerName && (
        <motion.div
          variants={fadeUp}
          className="glass-card p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 border border-rose-400/40 bg-rose-500/10 shadow-sm"
        >
          <div className="flex items-center gap-3 text-left">
            <span className="text-2xl flex-shrink-0">💑</span>
            <div>
              <p className="text-xs font-semibold theme-text-primary">
                Kamu Terhubung dengan {connectedPartnerName}!
              </p>
              <p className="text-[11px] theme-text-muted">
                Skor bahasa kasih kalian sudah siap dibandingkan.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onComparePartner}
            className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold text-white transition-opacity hover:opacity-90 flex-shrink-0 shadow-sm"
            style={{ background: 'linear-gradient(135deg, #E11D48, #BE123C)' }}
          >
            Lihat Hasil Keserasian ✨
          </button>
        </motion.div>
      )}

      {/* ── 1. Hero Profile Badge (Frosted Glass) ── */}
      <motion.div
        variants={fadeUp}
        className="glass-card rounded-3xl p-7 md:p-8 text-center space-y-4 overflow-hidden relative"
      >
        {/* Dimension-colored glow behind */}
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${cfg.color}40, transparent 70%)`,
          }}
        />

        <div className="relative space-y-3">
          {/* Profile type chip */}
          <div className="flex items-center justify-center">
            <span
              className="text-[11px] font-medium uppercase tracking-widest px-3 py-1.5 rounded-full font-mono"
              style={{
                background: cfg.bgGlass,
                color: cfg.color,
                border: `1px solid ${cfg.color}40`,
              }}
            >
              {result.profile_type}
            </span>
          </div>

          {/* User name */}
          {userName && (
            <p className="text-xs font-medium theme-text-subtle">
              Profil Kasih · {userName}
            </p>
          )}

          {/* Primary dimension name */}
          <h1
            style={{
              fontFamily: 'Fraunces, Georgia, serif',
              fontSize: 'clamp(26px, 6vw, 38px)',
              lineHeight: 1.15,
              letterSpacing: '-0.4px',
              color: cfg.color,
              fontStyle: 'italic',
            }}
          >
            {getProfileTitle()}
          </h1>

          {/* Tagline */}
          <p className="text-sm leading-relaxed max-w-md mx-auto theme-text-secondary">
            {cfg.tagline}
          </p>

          {/* Primary dimension pills */}
          <div className="flex items-center justify-center gap-2 flex-wrap pt-1">
            {result.primary_dimensions.map((dim) => (
              <span
                key={dim}
                className="text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{
                  background: DIMENSION_CONFIG[dim].bgGlass,
                  color: DIMENSION_CONFIG[dim].color,
                  border: `1px solid ${DIMENSION_CONFIG[dim].color}40`,
                }}
              >
                ✦ {DIMENSION_CONFIG[dim].shortName}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── 2. Spectrum Bars ── */}
      <motion.div
        variants={fadeUp}
        className="glass-card p-6 md:p-7 rounded-3xl space-y-5"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg theme-text-primary">
            Distribusi Bahasa Kasih
          </h2>
          <span className="text-xs font-mono theme-text-subtle">30 poin total</span>
        </div>

        <div className="space-y-4">
          {result.rankings.map((item: DimensionResult, index: number) => {
            const c = DIMENSION_CONFIG[item.dimension];
            return (
              <div key={item.dimension} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono w-5 theme-text-subtle">#{index + 1}</span>
                    <span className="font-medium theme-text-secondary">{c.name}</span>
                    {(item.tier === 'Primary' || item.tier === 'Co-Primary') && (
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded font-semibold"
                        style={{ background: c.bgGlass, color: c.color }}
                      >
                        {item.tier === 'Primary' ? 'Utama' : 'Setara'}
                      </span>
                    )}
                    {item.tier === 'Balanced' && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-teal-500/15 text-teal-400">Seimbang</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="theme-text-subtle">{item.raw_score} poin</span>
                    <span className="font-bold w-12 text-right theme-text-primary">{item.percentage}%</span>
                  </div>
                </div>

                {/* Bar Track */}
                <div
                  className="w-full h-2 rounded-full overflow-hidden"
                  style={{ background: 'var(--track-bg)' }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: c.barColor }}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ duration: 0.9, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ── 3. Do's & Don'ts Tabs ── */}
      <motion.div variants={fadeUp} className="glass-card p-6 md:p-7 rounded-3xl space-y-5">
        <div>
          <h2 className="font-serif text-lg theme-text-primary">
            Panduan untuk Pasangan
          </h2>
          <p className="text-xs mt-1 theme-text-subtle">
            Pilih dimensi untuk membaca panduan tindakan yang tepat
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {DIMS.map((dim) => {
            const dc = DIMENSION_CONFIG[dim];
            return (
              <button
                key={dim}
                type="button"
                onClick={() => setActiveTab(dim)}
                className="px-3 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap flex-shrink-0"
                style={{
                  background: activeTab === dim ? dc.color : 'var(--box-bg)',
                  color: activeTab === dim ? '#fff' : 'var(--text-muted)',
                  border: activeTab === dim ? `1px solid ${dc.color}` : '1px solid var(--box-border)',
                  boxShadow: activeTab === dim ? `0 2px 8px ${dc.color}50` : 'none',
                }}
              >
                {dc.shortName}
              </button>
            );
          })}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div
            className="p-5 rounded-2xl space-y-3 bg-emerald-500/10 border border-emerald-500/30"
          >
            <div className="flex items-center gap-2 text-sm font-medium text-emerald-400">
              <span className="text-base">✅</span>
              <span>Do's — Sangat Berarti</span>
            </div>
            <ul className="space-y-2.5">
              {DIMENSION_CONFIG[activeTab].dos.map((d, i) => (
                <li key={i} className="flex items-start gap-2 text-xs leading-relaxed theme-text-secondary">
                  <span className="text-emerald-500 font-bold mt-0.5 flex-shrink-0">•</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="p-5 rounded-2xl space-y-3 bg-rose-500/10 border border-rose-500/30"
          >
            <div className="flex items-center gap-2 text-sm font-medium text-rose-400">
              <span className="text-base">🚫</span>
              <span>Don'ts — Hindari Ini</span>
            </div>
            <ul className="space-y-2.5">
              {DIMENSION_CONFIG[activeTab].donts.map((d, i) => (
                <li key={i} className="flex items-start gap-2 text-xs leading-relaxed theme-text-secondary">
                  <span className="text-rose-500 font-bold mt-0.5 flex-shrink-0">•</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* ── 4. Couple Match Invitation Card ── */}
      <motion.div
        variants={fadeUp}
        className="glass-card p-6 md:p-7 rounded-3xl space-y-4 border border-rose-500/25 relative overflow-hidden"
      >
        <div className="flex items-start gap-3.5">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 text-xl"
            style={{ background: 'rgba(225,29,72,0.15)', border: '1px solid rgba(225,29,72,0.30)' }}
          >
            💌
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-lg theme-text-primary">
              Penasaran Seberapa Cocok dengan Pasanganmu?
            </h3>
            <p className="text-xs leading-relaxed theme-text-muted">
              Ajak pasanganmu mengisi kuis ini. Begitu dia selesai, kalian bisa langsung melihat <strong>Indeks Keserasian</strong>, titik temu, dan panduan komunikasi berdua!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {onShareWhatsApp && (
            <button
              type="button"
              onClick={onShareWhatsApp}
              className="py-3.5 px-4 rounded-2xl text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.99] hover:opacity-95 shadow-md"
              style={{
                background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                boxShadow: '0 4px 14px rgba(18,140,126,0.30)',
              }}
            >
              <svg className="w-4 h-4 fill-current flex-shrink-0" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span>Kirim ke WhatsApp</span>
            </button>
          )}

          <button
            type="button"
            onClick={onShareLink}
            className="py-3.5 px-4 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.99] theme-box theme-text-primary"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span>Salin Tautan Undangan</span>
          </button>
        </div>
      </motion.div>

      {/* ── 5. Secondary Action Toolbar ── */}
      <motion.div variants={fadeUp} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onComparePartner}
            className="py-3.5 px-4 rounded-2xl text-sm font-medium flex items-center justify-center gap-2 transition-all hover:scale-[1.01] theme-box theme-text-primary shadow-sm"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
            </svg>
            <span>{connectedPartnerName ? 'Hasil Keserasian' : 'Input Tautan Pasangan'}</span>
          </button>

          <button
            type="button"
            onClick={onExportCard}
            className="py-3.5 px-4 rounded-2xl text-sm font-medium flex items-center justify-center gap-2 transition-all hover:scale-[1.01] theme-box theme-text-primary shadow-sm"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Unduh PNG</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onRetake}
          className="w-full py-3 rounded-xl text-sm transition-all theme-text-subtle hover:text-stone-200"
        >
          Ulangi Kuis dari Awal
        </button>
      </motion.div>
    </motion.div>
  );
};
