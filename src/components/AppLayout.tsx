// =====================================================
// MIKAASIH — AppLayout
// Animated Living Gradient background dengan 3 blob
// Mendukung Tema Terang (Warm Daylight) & Gelap (Midnight Velvet)
// Lengkap dengan Theme Toggle Button elegan
// =====================================================

import React from 'react';
import { useTheme } from '../hooks/useTheme';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { toggleTheme, isDark } = useTheme();

  return (
    <div
      className="relative min-h-[100dvh] overflow-x-hidden flex flex-col transition-colors duration-300"
      style={{
        backgroundColor: isDark ? '#0C0A14' : '#FDFBF7',
        color: isDark ? '#F5F5F4' : '#1C1917',
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      {/* ── Theme Toggle Floating Button (Top Right) ── */}
      <div className="fixed top-4 right-4 z-40">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={isDark ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
          title={isDark ? 'Beralih ke Mode Terang ☀️' : 'Beralih ke Mode Gelap 🌙'}
          className="p-2.5 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm"
          style={{
            background: isDark ? 'rgba(30, 27, 46, 0.85)' : 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(16px)',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(120, 113, 108, 0.18)',
            color: isDark ? '#FBBF24' : '#44403C',
            boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.5)' : '0 2px 10px rgba(28,25,23,0.08)',
          }}
        >
          {isDark ? (
            /* Sun Icon */
            <svg className="w-5 h-5 transition-transform duration-300 rotate-0 hover:rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            /* Moon Icon */
            <svg className="w-5 h-5 transition-transform duration-300 -rotate-12 hover:rotate-0 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </div>

      {/* ── Animated Mesh Gradient Blobs ── */}

      {/* Blob 1: Rose — Kanan Atas (dominan) */}
      <div
        className="blob-1 pointer-events-none fixed rounded-full blur-[100px] transition-opacity duration-700"
        aria-hidden="true"
        style={{
          width: '540px',
          height: '540px',
          top: '-140px',
          right: '-140px',
          background: isDark
            ? 'radial-gradient(circle, rgba(244,63,94,0.22) 0%, rgba(225,29,72,0.08) 60%, transparent 100%)'
            : 'radial-gradient(circle, rgba(244,63,94,0.18) 0%, rgba(251,113,133,0.08) 60%, transparent 100%)',
        }}
      />

      {/* Blob 2: Amber — Kiri Bawah */}
      <div
        className="blob-2 pointer-events-none fixed rounded-full blur-[90px] transition-opacity duration-700"
        aria-hidden="true"
        style={{
          width: '480px',
          height: '480px',
          bottom: '-120px',
          left: '-100px',
          background: isDark
            ? 'radial-gradient(circle, rgba(217,119,6,0.18) 0%, rgba(245,158,11,0.06) 60%, transparent 100%)'
            : 'radial-gradient(circle, rgba(217,119,6,0.14) 0%, rgba(251,191,36,0.06) 60%, transparent 100%)',
        }}
      />

      {/* Blob 3: Teal — Tengah */}
      <div
        className="blob-3 pointer-events-none fixed rounded-full blur-[120px] transition-opacity duration-700"
        aria-hidden="true"
        style={{
          width: '380px',
          height: '380px',
          top: '35%',
          left: '30%',
          background: isDark
            ? 'radial-gradient(circle, rgba(20,184,166,0.12) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(13,148,136,0.07) 0%, transparent 70%)',
        }}
      />

      {/* ── Noise Texture Overlay ── */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.025]"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
        }}
      />

      {/* ── Main Content ── */}
      <main className="relative z-10 flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
};
