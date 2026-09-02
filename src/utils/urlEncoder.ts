// =====================================================
// RASA APP — URL Encoder / Parser Stateless
// Format: /match?n=Nama&s=W9-Q8-G2-S6-T5
// Validasi matematis: setiap nilai 0-12, total = 30
// =====================================================

import type { DimensionKey, PartnerData } from '../engine/types';

/**
 * Menghasilkan URL berbagi pasangan dari skor mentah pengguna
 */
export function encodePartnerUrl(
  userName: string,
  rawScores: Record<DimensionKey, number>,
  baseUrl: string = window.location.origin
): string {
  const safeName = encodeURIComponent(userName.trim() || 'Pasangan');
  const scoreString = `W${rawScores.W}-Q${rawScores.Q}-G${rawScores.G}-S${rawScores.S}-T${rawScores.T}`;
  return `${baseUrl}${window.location.pathname}?n=${safeName}&s=${scoreString}`;
}

/**
 * Mem-parsing URL atau query string menjadi PartnerData
 * @returns PartnerData jika valid, null jika format salah atau total ≠ 30
 */
export function parsePartnerUrl(urlOrQuery: string): PartnerData | null {
  try {
    let search = urlOrQuery;
    if (urlOrQuery.includes('?')) {
      search = urlOrQuery.split('?')[1];
    }
    const params = new URLSearchParams(search);
    const nameParam  = params.get('n');
    const scoreParam = params.get('s');

    if (!scoreParam) return null;

    const name = nameParam ? decodeURIComponent(nameParam) : 'Pasangan';

    // Strict regex: W{0-12}-Q{0-12}-G{0-12}-S{0-12}-T{0-12}
    const match = scoreParam.match(/^W(\d{1,2})-Q(\d{1,2})-G(\d{1,2})-S(\d{1,2})-T(\d{1,2})$/);
    if (!match) return null;

    const scores: Record<DimensionKey, number> = {
      W: parseInt(match[1], 10),
      Q: parseInt(match[2], 10),
      G: parseInt(match[3], 10),
      S: parseInt(match[4], 10),
      T: parseInt(match[5], 10),
    };

    // Validasi psikometri: setiap nilai 0-12 dan total harus tepat 30
    const total = scores.W + scores.Q + scores.G + scores.S + scores.T;
    const isValidValues = Object.values(scores).every((v) => v >= 0 && v <= 12);

    if (total !== 30 || !isValidValues) return null;

    return { name, scores };
  } catch {
    return null;
  }
}

/**
 * Menyalin teks ke clipboard dengan fallback
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    // Fallback untuk browser lama
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  } catch {
    return false;
  }
}

// =====================================================
// COMPARISON URL — Dua Profil Sekaligus
// Format: ?n=Rian&s=W7-Q8-G9-S4-T2&pn=Sari&ps=W5-Q9-G7-S6-T3
// =====================================================

/**
 * Encode URL perbandingan untuk dua profil (dari MatchView)
 */
export function encodeComparisonUrl(
  myName: string,
  myScores: Record<DimensionKey, number>,
  partnerName: string,
  partnerScores: Record<DimensionKey, number>,
  baseUrl: string = window.location.origin,
): string {
  const safeMy      = encodeURIComponent(myName.trim() || 'Aku');
  const safePartner = encodeURIComponent(partnerName.trim() || 'Pasangan');
  const myStr       = `W${myScores.W}-Q${myScores.Q}-G${myScores.G}-S${myScores.S}-T${myScores.T}`;
  const partnerStr  = `W${partnerScores.W}-Q${partnerScores.Q}-G${partnerScores.G}-S${partnerScores.S}-T${partnerScores.T}`;
  return `${baseUrl}${window.location.pathname}?n=${safeMy}&s=${myStr}&pn=${safePartner}&ps=${partnerStr}`;
}

/**
 * Parse URL perbandingan dua profil — return null jika tidak valid
 */
export function parseComparisonUrl(urlOrQuery: string): {
  me: PartnerData;
  partner: PartnerData;
} | null {
  try {
    let search = urlOrQuery;
    if (urlOrQuery.includes('?')) search = urlOrQuery.split('?')[1];
    const params = new URLSearchParams(search);
    const n  = params.get('n');
    const s  = params.get('s');
    const pn = params.get('pn');
    const ps = params.get('ps');
    if (!n || !s || !pn || !ps) return null;

    const parseScore = (raw: string): Record<DimensionKey, number> | null => {
      const m = raw.match(/^W(\d{1,2})-Q(\d{1,2})-G(\d{1,2})-S(\d{1,2})-T(\d{1,2})$/);
      if (!m) return null;
      const sc: Record<DimensionKey, number> = {
        W: parseInt(m[1], 10), Q: parseInt(m[2], 10),
        G: parseInt(m[3], 10), S: parseInt(m[4], 10), T: parseInt(m[5], 10),
      };
      const total = Object.values(sc).reduce((a, b) => a + b, 0);
      const valid = Object.values(sc).every(v => v >= 0 && v <= 12);
      if (total !== 30 || !valid) return null;
      return sc;
    };

    const myScores      = parseScore(s);
    const partnerScores = parseScore(ps);
    if (!myScores || !partnerScores) return null;

    return {
      me:      { name: decodeURIComponent(n),  scores: myScores },
      partner: { name: decodeURIComponent(pn), scores: partnerScores },
    };
  } catch {
    return null;
  }
}

