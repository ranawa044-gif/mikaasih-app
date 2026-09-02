// =====================================================
// MIKAASIH — OnboardingView
// Frosted glass card, stagger entrance, gradient headline,
// bilingual dimension pills (ID & EN), interactive info modal,
// dismissable partner invitation banner, and Full Theme Integration
// =====================================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AboutLoveLanguagesModal } from './AboutLoveLanguagesModal';
import type { DimensionKey } from '../engine/types';

export interface OnboardingViewProps {
  onStartQuiz: (userName: string) => void;
  onEnterPartnerCode?: () => void;
  hasSavedSession?: boolean;
  onResumeSession?: () => void;
  partnerInviteName?: string | null;
  onDismissPartnerInvite?: () => void;
}

const stagger = {
  hidden:  {},
  show:    { transition: { staggerChildren: 0.10, delayChildren: 0.15 } },
} as const;

const fadeUp = {
  hidden:  { opacity: 0, y: 22 },
  show:    { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
} as const;

const fadeIn = {
  hidden:  { opacity: 0 },
  show:    { opacity: 1, transition: { duration: 0.5 } },
} as const;

const DIMENSION_PILLS: Array<{
  key: DimensionKey;
  labelId: string;
  labelEn: string;
  color: string;
  bgLight: string;
  bgDark: string;
}> = [
  { key: 'W', labelId: 'Kata Pujian',      labelEn: 'Words of Affirmation', color: '#F59E0B', bgLight: 'rgba(217,119,6,0.10)',   bgDark: 'rgba(245,158,11,0.14)' },
  { key: 'Q', labelId: 'Waktu Bersama',   labelEn: 'Quality Time',         color: '#14B8A6', bgLight: 'rgba(13,148,136,0.10)',   bgDark: 'rgba(20,184,166,0.14)' },
  { key: 'G', labelId: 'Pemberian Hadiah', labelEn: 'Receiving Gifts',     color: '#FBBF24', bgLight: 'rgba(212,163,115,0.12)', bgDark: 'rgba(251,191,36,0.14)' },
  { key: 'S', labelId: 'Tindakan Nyata',   labelEn: 'Acts of Service',     color: '#A8A29E', bgLight: 'rgba(120,113,108,0.10)', bgDark: 'rgba(168,162,158,0.14)' },
  { key: 'T', labelId: 'Sentuhan Fisik',   labelEn: 'Physical Touch',       color: '#FB7185', bgLight: 'rgba(225,29,72,0.10)',   bgDark: 'rgba(251,113,133,0.14)' },
];

export const OnboardingView: React.FC<OnboardingViewProps> = ({
  onStartQuiz,
  onEnterPartnerCode,
  hasSavedSession,
  onResumeSession,
  partnerInviteName,
  onDismissPartnerInvite,
}) => {
  const [name, setName]                             = useState('');
  const [isFocused, setIsFocused]                   = useState(false);
  const [showAboutModal, setShowAboutModal]         = useState(false);
  const [selectedDimKey, setSelectedDimKey]         = useState<DimensionKey | 'all'>('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartQuiz(name.trim() || 'Teman');
  };

  const handleOpenSingleDimension = (key: DimensionKey) => {
    setSelectedDimKey(key);
    setShowAboutModal(true);
  };

  const handleOpenAllDimensions = () => {
    setSelectedDimKey('all');
    setShowAboutModal(true);
  };

  return (
    <div className="w-full min-h-[100dvh] flex flex-col items-center justify-center px-4 py-8">
      <AboutLoveLanguagesModal
        isOpen={showAboutModal}
        onClose={() => setShowAboutModal(false)}
        selectedDimensionKey={selectedDimKey}
      />

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="w-full max-w-md flex flex-col gap-6"
      >

        {/* ── Brand Mark ── */}
        <motion.div variants={fadeIn} className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, rgba(225,29,72,0.25), rgba(217,119,6,0.18))', border: '1px solid rgba(225,29,72,0.30)' }}
            >
              <span style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#E11D48', fontSize: '15px' }}>✦</span>
            </div>
            <span
              className="font-serif text-xl font-medium tracking-tight theme-text-primary"
            >
              Mikaasih.
            </span>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest theme-text-subtle theme-box rounded-full px-2.5 py-1">
            Psikometri v1.0
          </span>
        </motion.div>

        {/* ── Frosted Glass Hero Card ── */}
        <motion.div
          variants={fadeUp}
          className="glass-card rounded-3xl p-7 md:p-9 space-y-6"
        >

          {/* ── Partner Invitation Banner (Jika datang dari link pasangan) ── */}
          {partnerInviteName && (
            <motion.div
              variants={fadeUp}
              className="p-4 rounded-2xl flex items-start gap-3 border border-rose-400/50 bg-rose-500/10 shadow-sm relative"
            >
              <span className="text-2xl flex-shrink-0">💌</span>
              <div className="flex-1 pr-6">
                <h3 className="font-semibold text-xs theme-text-primary">
                  {partnerInviteName} Mengajakmu Mencocokkan Bahasa Kasih!
                </h3>
                <p className="text-[11.5px] leading-relaxed theme-text-muted mt-0.5">
                  Isi 30 pertanyaan singkat ini untuk mengetahui profil cintamu dan langsung melihat seberapa serasi kalian berdua.
                </p>
                {onDismissPartnerInvite && (
                  <button
                    type="button"
                    onClick={onDismissPartnerInvite}
                    className="text-[11px] font-semibold text-rose-500 hover:text-rose-400 underline underline-offset-4 mt-2.5 inline-flex items-center gap-1 transition-colors"
                  >
                    <span>✕ Mulai kuis mandiri (tanpa pencocokan)</span>
                  </button>
                )}
              </div>

              {/* Close Button Icon */}
              {onDismissPartnerInvite && (
                <button
                  type="button"
                  onClick={onDismissPartnerInvite}
                  className="absolute top-3 right-3 text-stone-400 hover:text-rose-400 p-1.5 rounded-xl transition-colors"
                  title="Abaikan undangan"
                  aria-label="Abaikan undangan"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </motion.div>
          )}

          {/* Headline */}
          <div className="space-y-3">
            <motion.div variants={fadeUp}>
              <span
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-rose-500/15 text-rose-500 border border-rose-500/25"
              >
                ✨ Tes 5 Bahasa Cinta · The 5 Love Languages
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="theme-text-primary"
              style={{
                fontFamily: 'Fraunces, Georgia, serif',
                fontSize: 'clamp(30px, 7vw, 44px)',
                lineHeight: 1.15,
                letterSpacing: '-0.5px',
              }}
            >
              Pahami caramu{' '}
              <span
                style={{
                  fontStyle: 'italic',
                  fontWeight: 300,
                  background: 'linear-gradient(120deg, #FB7185, #F59E0B)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                mengasihi
              </span>{' '}
              &amp; didengar.
            </motion.h1>

            <motion.p variants={fadeUp} className="text-sm leading-relaxed theme-text-muted">
              30 skenario komparatif objektif berbasis teori Dr. Gary Chapman untuk menemukan
              profil <em>Love Language</em> dominanmu. 100% privat &amp; bebas bias.
            </motion.p>
          </div>

          {/* Bilingual Dimension Pills & Info Trigger */}
          <motion.div variants={fadeUp} className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider theme-text-subtle">
                5 Dimensi Kasih (Pilih untuk Detail)
              </span>
              <button
                type="button"
                onClick={handleOpenAllDimensions}
                className="inline-flex items-center gap-1 text-[11px] font-medium transition-colors text-rose-500 hover:text-rose-400"
              >
                <span>ℹ️ Pelajari Semua</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {DIMENSION_PILLS.map((pill) => (
                <button
                  key={pill.key}
                  type="button"
                  onClick={() => handleOpenSingleDimension(pill.key)}
                  className="theme-box text-left text-[11px] font-medium px-2.5 py-1.5 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                  title={`Klik untuk melihat detail ${pill.labelId} (${pill.labelEn})`}
                >
                  <span className="font-semibold theme-text-primary">{pill.labelId}</span>
                  <span className="text-[10px] ml-1 font-medium" style={{ color: pill.color }}>
                    · {pill.labelEn}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Feature Stats */}
          <motion.div variants={fadeUp} className="grid grid-cols-3 gap-2">
            {[
              { top: '3–5 Mnt', sub: 'Durasi' },
              { top: '30 Soal', sub: 'Forced-Choice' },
              { top: '100%',    sub: 'Privasi Lokal' },
            ].map((stat) => (
              <div
                key={stat.sub}
                className="theme-box text-center py-3 px-2 rounded-2xl"
              >
                <div className="text-xs font-semibold font-mono theme-text-primary">{stat.top}</div>
                <div className="text-[10px] mt-0.5 theme-text-subtle">{stat.sub}</div>
              </div>
            ))}
          </motion.div>

          {/* Resume Banner */}
          {hasSavedSession && onResumeSession && (
            <motion.div
              variants={fadeUp}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/30"
            >
              <div>
                <p className="text-xs font-semibold text-amber-500">Sesi sebelumnya ditemukan</p>
                <p className="text-xs mt-0.5 theme-text-muted">Lanjutkan dari soal terakhir?</p>
              </div>
              <button
                type="button"
                onClick={onResumeSession}
                className="px-3 py-1.5 rounded-xl text-white text-xs font-medium transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #D97706, #B45309)' }}
              >
                Lanjutkan
              </button>
            </motion.div>
          )}

          {/* Form */}
          <motion.form variants={fadeUp} onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label
                htmlFor="name-input"
                className="block text-xs font-medium mb-2 ml-0.5 theme-text-muted"
              >
                Nama atau Panggilanmu
              </label>
              <input
                id="name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Contoh: Rian, Sarah..."
                maxLength={24}
                className="theme-input w-full px-4 py-3.5 text-sm outline-none transition-all duration-200 rounded-2xl"
                style={{
                  boxShadow: isFocused ? '0 0 0 3px rgba(225,29,72,0.20)' : 'none',
                }}
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 px-6 text-white text-sm font-semibold rounded-2xl transition-all duration-200 active:scale-[0.99] flex items-center justify-center gap-2 group shadow-md"
              style={{
                background: 'var(--primary-btn-bg)',
              }}
            >
              <span>{partnerInviteName ? `Mulai Kuis & Cocokkan dengan ${partnerInviteName}` : 'Mulai Kuis Sekarang'}</span>
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </motion.form>
        </motion.div>

        {/* ── Footer ── */}
        <motion.footer
          variants={fadeIn}
          className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs px-1 theme-text-subtle"
        >
          <p>Berdasarkan Model 5 Bahasa Kasih — Chapman (1992)</p>
          {onEnterPartnerCode && (
            <button
              type="button"
              onClick={onEnterPartnerCode}
              className="underline underline-offset-4 transition-colors hover:text-rose-400"
            >
              Punya tautan pasangan?
            </button>
          )}
        </motion.footer>

      </motion.div>
    </div>
  );
};
