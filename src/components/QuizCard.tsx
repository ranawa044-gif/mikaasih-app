// =====================================================
// MIKAASIH — QuizCard
// Shimmer progress bar, card glow on select,
// stacked card deck visual, spring physics, Full Theme Integration
// =====================================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { DimensionKey } from '../engine/types';

interface QuizOption {
  dimension: DimensionKey;
  text: string;
}

export interface QuizCardProps {
  questionNumber: number;
  totalQuestions: number;
  optionA: QuizOption;
  optionB: QuizOption;
  onSelectOption: (dimension: DimensionKey) => void;
  onPrevious: () => void;
  canGoPrevious: boolean;
}

const ACCENTS: Record<DimensionKey, { glow: string; badge: string; ring: string }> = {
  W: { glow: 'rgba(245,158,11,0.25)',  badge: 'rgba(245,158,11,0.15)',  ring: '#F59E0B' },
  Q: { glow: 'rgba(20,184,166,0.25)', badge: 'rgba(20,184,166,0.15)', ring: '#14B8A6' },
  G: { glow: 'rgba(251,191,36,0.25)', badge: 'rgba(251,191,36,0.15)', ring: '#FBBF24' },
  S: { glow: 'rgba(168,162,158,0.25)',badge: 'rgba(168,162,158,0.15)',ring: '#A8A29E' },
  T: { glow: 'rgba(251,113,133,0.25)',badge: 'rgba(251,113,133,0.15)',ring: '#FB7185' },
};

export const QuizCard: React.FC<QuizCardProps> = ({
  questionNumber,
  totalQuestions,
  optionA,
  optionB,
  onSelectOption,
  onPrevious,
  canGoPrevious,
}) => {
  const [selected, setSelected]   = useState<DimensionKey | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);

  useEffect(() => { setSelected(null); }, [questionNumber]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selected !== null) return;
      if (e.key === '1' || e.key === 'ArrowLeft')  handleChoice(optionA.dimension);
      if (e.key === '2' || e.key === 'ArrowRight') handleChoice(optionB.dimension);
      if ((e.key === 'Backspace' || e.key === 'ArrowUp') && canGoPrevious) {
        setDirection(-1);
        onPrevious();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionA, optionB, selected, canGoPrevious]);

  const handleChoice = (dimension: DimensionKey) => {
    if (selected !== null) return;
    setSelected(dimension);
    setDirection(1);
    setTimeout(() => onSelectOption(dimension), 200);
  };

  const progressPct = ((questionNumber - 1) / totalQuestions) * 100;

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6 flex flex-col min-h-[100dvh]">

      {/* ── Header ── */}
      <header className="space-y-3 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {canGoPrevious && (
              <button
                type="button"
                onClick={() => { setDirection(-1); onPrevious(); }}
                className="p-2 -ml-2 rounded-xl transition-all theme-box theme-text-subtle hover:text-stone-200"
                aria-label="Kembali"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <span
              className="text-xs font-medium tracking-wide uppercase theme-text-subtle"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
              {questionNumber} / {totalQuestions}
            </span>
          </div>

          {/* Brand mini */}
          <span className="font-serif text-sm opacity-50 theme-text-subtle">
            Mikaasih.
          </span>

          <span className="text-xs font-semibold font-mono theme-text-primary">
            {Math.round(progressPct)}%
          </span>
        </div>

        {/* Shimmer Progress Bar */}
        <div
          className="relative w-full h-1.5 rounded-full overflow-hidden"
          style={{ background: 'var(--track-bg)' }}
        >
          <motion.div
            className="relative h-full rounded-full overflow-hidden shimmer-bar bg-gradient-to-r from-rose-500 via-amber-500 to-rose-400"
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
          />
        </div>
      </header>

      {/* ── Card Area ── */}
      <div className="relative flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={questionNumber}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 32 : -32, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: direction > 0 ? -32 : 32, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="space-y-5"
          >
            {/* Question Heading */}
            <div className="text-center space-y-2 px-2">
              <p
                className="text-xs italic theme-text-subtle"
                style={{ fontFamily: 'Fraunces, Georgia, serif' }}
              >
                Pilih salah satu yang paling bermakna bagimu
              </p>
              <h2
                className="theme-text-primary"
                style={{
                  fontFamily: 'Fraunces, Georgia, serif',
                  fontSize: 'clamp(22px, 5vw, 30px)',
                  lineHeight: 1.25,
                  letterSpacing: '-0.3px',
                }}
              >
                Mana yang membuatmu lebih{' '}
                <span
                  style={{
                    fontStyle: 'italic',
                    background: 'linear-gradient(120deg, #FB7185, #F59E0B)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  merasa dicintai
                </span>?
              </h2>
            </div>

            {/* Option Cards */}
            <div className="space-y-3">
              {([
                { opt: optionA, label: 'A', key: '1' },
                { opt: optionB, label: 'B', key: '2' },
              ] as const).map(({ opt, label, key }) => {
                const isSelected      = selected === opt.dimension;
                const isOther         = selected !== null && !isSelected;
                const accent          = ACCENTS[opt.dimension];

                return (
                  <motion.button
                    key={label}
                    type="button"
                    onClick={() => handleChoice(opt.dimension)}
                    whileHover={{ scale: selected ? 1 : 1.012, y: selected ? 0 : -2 }}
                    whileTap={{ scale: 0.984 }}
                    disabled={selected !== null}
                    className="relative w-full text-left p-5 rounded-2xl transition-all duration-200 focus:outline-none glass-card"
                    style={{
                      border: isSelected
                        ? `1.5px solid ${accent.ring}`
                        : undefined,
                      boxShadow: isSelected
                        ? `0 8px 24px ${accent.glow}`
                        : undefined,
                      opacity: isOther ? 0.35 : 1,
                      filter: isOther ? 'grayscale(20%)' : 'none',
                    }}
                  >
                    <div className="flex items-start gap-4">
                      {/* Label Badge */}
                      <span
                        className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-sm font-semibold transition-all duration-150"
                        style={{
                          fontFamily: 'Fraunces, Georgia, serif',
                          background: isSelected ? accent.badge : 'var(--box-bg)',
                          color: isSelected ? accent.ring : 'var(--text-muted)',
                          border: isSelected ? `1px solid ${accent.ring}` : '1px solid var(--box-border)',
                        }}
                      >
                        {label}
                      </span>

                      {/* Text */}
                      <p
                        className={`flex-1 text-sm leading-relaxed pt-0.5 ${
                          isSelected ? 'theme-text-primary font-semibold' : 'theme-text-secondary'
                        }`}
                      >
                        {opt.text}
                      </p>

                      {/* Selected Checkmark */}
                      {isSelected && (
                        <motion.span
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="flex-shrink-0 self-center w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ background: accent.ring }}
                        >
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </motion.span>
                      )}

                      {/* Keyboard hint */}
                      {!selected && (
                        <span
                          className="hidden sm:inline-block text-[11px] self-center flex-shrink-0 font-mono px-1.5 py-0.5 rounded theme-text-subtle theme-box"
                        >
                          [{key}]
                        </span>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Footer ── */}
      <footer className="mt-8 text-center pb-2">
        <p className="text-[11px] theme-text-subtle">
          Tekan{' '}
          <span className="font-mono px-1.5 py-0.5 rounded theme-box theme-text-primary">1</span>
          {' '}atau{' '}
          <span className="font-mono px-1.5 py-0.5 rounded theme-box theme-text-primary">2</span>
          {' '}untuk memilih
        </p>
      </footer>
    </div>
  );
};
