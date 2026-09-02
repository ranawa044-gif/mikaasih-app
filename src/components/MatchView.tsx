// =====================================================
// MIKAASIH — MatchView
// Similarity gauge dengan gradient ring, dual bars,
// insight cards frosted glass, 1-click WhatsApp feedback,
// and Full Dynamic Theme Integration
// =====================================================

import React from 'react';
import { motion } from 'framer-motion';
import type { AssessmentResult, DimensionKey, PartnerData } from '../engine/types';

export interface MatchViewProps {
  myResult: AssessmentResult;
  myName: string;
  partner: PartnerData;
  similarityIndex: number;
  sharedStrengths: DimensionKey[];
  frictionPoints: DimensionKey[];
  onBack: () => void;
  onShareComparisonLink: () => void;
  onShareComparisonWhatsApp?: () => void;
  onExportComparisonCard: () => void;
}

const DIM_DETAILS: Record<DimensionKey, { name: string; shortName: string; myColor: string }> = {
  W: { name: 'Words of Affirmation', shortName: 'Kata Pujian',     myColor: '#F59E0B' },
  Q: { name: 'Quality Time',         shortName: 'Waktu Bersama',   myColor: '#14B8A6' },
  G: { name: 'Receiving Gifts',      shortName: 'Pemberian Hadiah', myColor: '#FBBF24' },
  S: { name: 'Acts of Service',      shortName: 'Tindakan Nyata',  myColor: '#A8A29E' },
  T: { name: 'Physical Touch',       shortName: 'Sentuhan Fisik',  myColor: '#FB7185' },
};

const DIMS: DimensionKey[] = ['W', 'Q', 'G', 'S', 'T'];

const getSimilarityMeta = (index: number) => {
  if (index >= 80) return {
    label: 'Sangat Serasi ✨',
    desc: 'Saluran ekspresi kasih kalian saling melengkapi secara natural.',
    gradient: 'linear-gradient(135deg, #059669, #10B981)',
    glow: 'rgba(5,150,105,0.28)',
  };
  if (index >= 65) return {
    label: 'Serasi 🌿',
    desc: 'Tingkat keselarasan tinggi dengan sedikit perbedaan yang mudah dijembatani.',
    gradient: 'linear-gradient(135deg, #0D9488, #14B8A6)',
    glow: 'rgba(13,148,136,0.25)',
  };
  if (index >= 50) return {
    label: 'Cukup Serasi 🌼',
    desc: 'Kalian memiliki preferensi yang seimbang, butuh sedikit penyesuaian pada beberapa area.',
    gradient: 'linear-gradient(135deg, #D97706, #F59E0B)',
    glow: 'rgba(217,119,6,0.25)',
  };
  return {
    label: 'Perlu Komunikasi 💬',
    desc: 'Perbedaan yang cukup kontras — komunikasi aktif dan saling memahami sangat penting.',
    gradient: 'linear-gradient(135deg, #E11D48, #FB7185)',
    glow: 'rgba(225,29,72,0.28)',
  };
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};
const fadeUp = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

export const MatchView: React.FC<MatchViewProps> = ({
  myResult,
  myName,
  partner,
  similarityIndex,
  sharedStrengths,
  frictionPoints,
  onBack,
  onShareComparisonLink,
  onShareComparisonWhatsApp,
  onExportComparisonCard,
}) => {
  const meta = getSimilarityMeta(similarityIndex);

  const partnerPct = (dim: DimensionKey): number =>
    Number(((partner.scores[dim] / 30) * 100).toFixed(1));

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="w-full max-w-2xl mx-auto px-4 py-8 space-y-5 pb-16"
    >

      {/* ── 1. Header ── */}
      <motion.div variants={fadeUp} className="text-center space-y-2">
        <span
          className="text-[11px] uppercase tracking-widest font-mono px-3.5 py-1 rounded-full theme-box theme-text-subtle"
        >
          Analisis Kompatibilitas
        </span>
        <h1
          className="mt-3 font-serif theme-text-primary"
          style={{ fontSize: 'clamp(24px, 6vw, 34px)' }}
        >
          {myName}{' '}
          <span className="italic font-light text-rose-500">&</span>{' '}
          {partner.name}
        </h1>
      </motion.div>

      {/* ── 2. Similarity Gauge Card ── */}
      <motion.div
        variants={fadeUp}
        className="glass-card rounded-3xl p-7 flex flex-col items-center gap-4 relative overflow-hidden"
      >
        {/* Background glow */}
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 50% 30%, ${meta.glow}, transparent 65%)` }}
        />

        {/* Gauge Circle */}
        <div className="relative flex items-center justify-center z-10">
          {/* SVG Ring */}
          <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)' }}>
            {/* Track */}
            <circle
              cx="80" cy="80" r="64"
              fill="none"
              stroke="var(--track-bg)"
              strokeWidth="10"
            />
            {/* Progress */}
            <motion.circle
              cx="80" cy="80" r="64"
              fill="none"
              stroke="url(#gaugeGrad)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 64}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 64 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 64 * (1 - similarityIndex / 100) }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            />
            <defs>
              <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={meta.gradient.match(/#[A-F0-9]{6}/gi)?.[0] ?? '#059669'} />
                <stop offset="100%" stopColor={meta.gradient.match(/#[A-F0-9]{6}/gi)?.[1] ?? '#10B981'} />
              </linearGradient>
            </defs>
          </svg>

          {/* Center Number */}
          <div className="absolute text-center">
            <span
              style={{
                fontFamily: 'Fraunces, Georgia, serif',
                fontSize: '40px',
                fontWeight: 600,
                lineHeight: 1,
                background: meta.gradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {similarityIndex}%
            </span>
          </div>
        </div>

        {/* Label & Desc */}
        <div className="text-center space-y-1.5 z-10">
          <p className="font-semibold text-sm theme-text-primary">{meta.label}</p>
          <p className="text-xs leading-relaxed max-w-xs text-center theme-text-muted">
            {meta.desc}
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-5 text-xs font-medium z-10">
          <span className="flex items-center gap-1.5 theme-text-secondary">
            <span className="w-2.5 h-2.5 rounded-full bg-stone-900 dark:bg-stone-200 inline-block" /> {myName}
          </span>
          <span className="flex items-center gap-1.5 text-rose-500">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" /> {partner.name}
          </span>
        </div>
      </motion.div>

      {/* ── 3. Side-by-Side Spectrum ── */}
      <motion.div variants={fadeUp} className="glass-card p-6 md:p-7 rounded-3xl space-y-5">
        <h2 className="font-serif text-lg theme-text-primary">
          Perbandingan Spektrum
        </h2>

        <div className="space-y-5">
          {DIMS.map((dim) => {
            const myPct = myResult.scores[dim]?.percentage || 0;
            const pPct  = partnerPct(dim);
            const d     = DIM_DETAILS[dim];
            return (
              <div key={dim} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium theme-text-secondary">{d.name}</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-semibold theme-text-primary">{myPct}%</span>
                    <span className="theme-text-subtle">/</span>
                    <span className="text-rose-500 font-semibold">{pPct}%</span>
                  </div>
                </div>
                {/* My bar */}
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--track-bg)' }}>
                  <motion.div
                    className="h-full rounded-full bg-stone-900 dark:bg-stone-100"
                    initial={{ width: 0 }}
                    animate={{ width: `${myPct}%` }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
                {/* Partner bar */}
                <div className="w-full h-2 rounded-full overflow-hidden bg-rose-500/10">
                  <motion.div
                    className="h-full rounded-full bg-rose-500 dark:bg-rose-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${pPct}%` }}
                    transition={{ duration: 0.8, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ── 4. Insight Cards ── */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Shared strengths */}
        <div className="glass-card p-5 rounded-3xl space-y-3">
          <p className="font-semibold text-sm font-serif text-emerald-500">
            🌿 Titik Temu
          </p>
          {sharedStrengths.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {sharedStrengths.map((dim) => (
                <span
                  key={dim}
                  className="text-xs font-medium px-2.5 py-1 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                >
                  {DIM_DETAILS[dim].shortName}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs leading-relaxed theme-text-muted">
              Preferensi unik masing-masing — peluang untuk saling belajar bahasa kasih baru.
            </p>
          )}
        </div>

        {/* Friction points */}
        <div className="glass-card p-5 rounded-3xl space-y-3">
          <p className="font-semibold text-sm font-serif text-amber-500">
            💡 Perlu Kesadaran
          </p>
          {frictionPoints.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {frictionPoints.map((dim) => (
                <span
                  key={dim}
                  className="text-xs font-medium px-2.5 py-1 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30"
                >
                  {DIM_DETAILS[dim].shortName}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs leading-relaxed theme-text-muted">
              Tidak ada perbedaan kontras. Distribusi preferensi kalian cenderung harmonis.
            </p>
          )}
        </div>
      </motion.div>

      {/* ── 5. Actions ── */}
      <motion.div variants={fadeUp} className="space-y-3">

        {/* Primary WhatsApp Feedback Button to Partner */}
        {onShareComparisonWhatsApp && (
          <button
            type="button"
            onClick={onShareComparisonWhatsApp}
            className="w-full py-4 px-6 rounded-2xl text-white text-sm font-semibold flex items-center justify-center gap-2.5 transition-all active:scale-[0.99] hover:opacity-95 shadow-md"
            style={{
              background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
              boxShadow: '0 4px 16px rgba(18,140,126,0.30)',
            }}
          >
            <svg className="w-5 h-5 fill-current flex-shrink-0" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
            <span>Kirim Hasil ke {partner.name} via WhatsApp 💬</span>
          </button>
        )}

        {/* Secondary: Unduh PNG & Salin Tautan */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onExportComparisonCard}
            className="py-3.5 px-4 rounded-2xl text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.99] bg-stone-900 dark:bg-stone-800 shadow-sm"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Unduh PNG</span>
          </button>

          <button
            type="button"
            onClick={onShareComparisonLink}
            className="py-3.5 px-4 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.99] theme-box theme-text-primary shadow-sm"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span>Salin Tautan</span>
          </button>
        </div>

        {/* Captions */}
        <div className="grid grid-cols-2 gap-3">
          <p className="text-center text-[10px] theme-text-subtle">
            PNG untuk WA / IG Stories
          </p>
          <p className="text-center text-[10px] theme-text-subtle">
            URL langsung ke halaman ini
          </p>
        </div>

        {/* Back button */}
        <button
          type="button"
          onClick={onBack}
          className="w-full py-3 rounded-xl text-sm font-medium transition-all theme-text-subtle hover:text-stone-200"
        >
          ← Lihat Rincian Profil Pribadiku
        </button>
      </motion.div>
    </motion.div>
  );
};
