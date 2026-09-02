// =====================================================
// MIKAASIH — HTML5 Canvas Image Generator (Ultra-Clean)
// Output: PNG 1080×1920 (9:16 — Instagram Story / WA Status)
// Zero external dependencies, document.fonts.ready guard,
// Deterministic path cleanup (zero bleed / zero path leaks)
// =====================================================

import type { AssessmentResult, DimensionKey } from '../engine/types';

const DIMENSION_PALETTES: Record<DimensionKey, { name: string; shortName: string; hex: string; bg: string }> = {
  W: { name: 'Words of Affirmation', shortName: 'Kata Pujian',     hex: '#D97706', bg: 'rgba(217,119,6,0.12)' },
  Q: { name: 'Quality Time',         shortName: 'Waktu Bersama',   hex: '#0D9488', bg: 'rgba(13,148,136,0.12)' },
  G: { name: 'Receiving Gifts',      shortName: 'Pemberian Hadiah', hex: '#D4A373', bg: 'rgba(212,163,115,0.14)' },
  S: { name: 'Acts of Service',      shortName: 'Tindakan Nyata',  hex: '#78716C', bg: 'rgba(120,113,108,0.12)' },
  T: { name: 'Physical Touch',       shortName: 'Sentuhan Fisik',  hex: '#E11D48', bg: 'rgba(225,29,72,0.12)' },
};

const DIMS_ORDER: DimensionKey[] = ['W', 'Q', 'G', 'S', 'T'];

/**
 * Helper menggambar rounded rect dengan path terisolasi (anti-leak)
 */
function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  fillColor?: string,
  strokeColor?: string,
  lineWidth?: number,
) {
  if (w <= 0 || h <= 0) return;
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.arcTo(x + w, y, x + w, y + radius, radius);
  ctx.arcTo(x + w, y + h, x + w - radius, y + h, radius);
  ctx.arcTo(x, y + h, x, y + h - radius, radius);
  ctx.arcTo(x, y, x + radius, y, radius);
  ctx.closePath();

  if (fillColor) {
    ctx.fillStyle = fillColor;
    ctx.fill();
  }
  if (strokeColor && lineWidth) {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
}

/**
 * Menentukan meta label & warna indeks keserasian
 */
function getSimilarityMeta(index: number) {
  if (index >= 80) {
    return { label: 'Sangat Serasi ✨', color: '#059669', desc: 'Saluran kasih kalian saling melengkapi secara natural.' };
  }
  if (index >= 65) {
    return { label: 'Serasi 🌿', color: '#0D9488', desc: 'Tingkat keselarasan tinggi dengan sedikit perbedaan wajar.' };
  }
  if (index >= 50) {
    return { label: 'Cukup Serasi 🌼', color: '#D97706', desc: 'Preferensi seimbang, butuh penyesuaian di beberapa area.' };
  }
  return { label: 'Perlu Komunikasi 💬', color: '#E11D48', desc: 'Perbedaan kontras — komunikasi aktif sangat penting.' };
}

/**
 * 1. KARTU HASIL PROFIL TUNGGAL (Single Profile)
 */
export async function generateShareableCard(
  userName: string,
  result: AssessmentResult,
): Promise<string> {
  if ('fonts' in document) {
    await document.fonts.ready;
  }

  const canvas = document.createElement('canvas');
  const WIDTH  = 1080;
  const HEIGHT = 1920;
  canvas.width  = WIDTH;
  canvas.height = HEIGHT;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Konteks kanvas gagal diinisialisasi.');

  // ── 1. Background Warm Oatmeal ────────────────────
  ctx.fillStyle = '#FDFBF7';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Ambient Gradient Blobs
  const blob1 = ctx.createRadialGradient(920, 260, 50, 920, 260, 550);
  blob1.addColorStop(0, 'rgba(225, 29, 72, 0.12)');
  blob1.addColorStop(1, 'rgba(253, 251, 247, 0)');
  ctx.fillStyle = blob1;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  const blob2 = ctx.createRadialGradient(160, 1650, 50, 160, 1650, 500);
  blob2.addColorStop(0, 'rgba(217, 119, 6, 0.10)');
  blob2.addColorStop(1, 'rgba(253, 251, 247, 0)');
  ctx.fillStyle = blob2;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // ── 2. Card Container ─────────────────────────────
  const CARD_X = 64;
  const CARD_Y = 120;
  const CARD_W = WIDTH - 128;
  const CARD_H = HEIGHT - 240;

  drawRoundRect(ctx, CARD_X, CARD_Y, CARD_W, CARD_H, 48, '#FFFFFF', '#E7E5E4', 2);

  // ── 3. Brand Header ───────────────────────────────
  ctx.fillStyle = '#A8A29E';
  ctx.font      = '600 24px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('MIKAASIH • LAPORAN PROFIL KASIH', CARD_X + 64, CARD_Y + 80);

  // ── 4. Nama Pengguna ──────────────────────────────
  ctx.fillStyle = '#1C1917';
  ctx.font      = '600 52px "Plus Jakarta Sans", sans-serif';
  const cleanName = userName.trim() || 'Teman';
  ctx.fillText(cleanName.length > 20 ? cleanName.slice(0, 20) + '...' : cleanName, CARD_X + 64, CARD_Y + 165);

  // ── 5. Nama Dimensi Primer ────────────────────────
  const primaryKey  = result.primary_dimensions[0];
  const primaryName = DIMENSION_PALETTES[primaryKey].name;
  const primaryHex  = DIMENSION_PALETTES[primaryKey].hex;

  ctx.fillStyle = primaryHex;
  ctx.font      = 'italic 700 64px "Fraunces", Georgia, serif';

  // Word-wrap untuk nama dimensi
  const words     = primaryName.split(' ');
  let   line      = '';
  let   lineY     = CARD_Y + 265;
  const maxWidth  = CARD_W - 128;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, CARD_X + 64, lineY);
      line  = word;
      lineY += 75;
    } else {
      line = test;
    }
  }
  ctx.fillText(line, CARD_X + 64, lineY);
  lineY += 55;

  // ── 6. Tipe Profil Badge ──────────────────────────
  drawRoundRect(ctx, CARD_X + 64, lineY - 28, 380, 48, 24, DIMENSION_PALETTES[primaryKey].bg);
  ctx.fillStyle = primaryHex;
  ctx.font      = '600 24px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`Kategori: ${result.profile_type}`, CARD_X + 88, lineY + 5);

  // ── 7. Garis Pemisah ─────────────────────────────
  const DIVIDER_Y = lineY + 55;
  ctx.beginPath();
  ctx.strokeStyle = '#F5F5F4';
  ctx.lineWidth   = 2;
  ctx.moveTo(CARD_X + 64, DIVIDER_Y);
  ctx.lineTo(CARD_X + CARD_W - 64, DIVIDER_Y);
  ctx.stroke();

  // ── 8. Grafik Bar Spektrum ────────────────────────
  let currentY  = DIVIDER_Y + 64;
  const MAX_BAR = CARD_W - 128;

  ctx.fillStyle = '#1C1917';
  ctx.font      = '600 30px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Distribusi Spektrum Bahasa', CARD_X + 64, currentY);
  currentY += 54;

  for (const dim of result.rankings) {
    const palette = DIMENSION_PALETTES[dim.dimension];

    // Label & Persentase
    ctx.fillStyle = '#44403C';
    ctx.font      = '500 26px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(palette.name, CARD_X + 64, currentY);

    ctx.fillStyle = '#1C1917';
    ctx.font      = '700 26px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`${dim.percentage}%`, CARD_X + CARD_W - 64, currentY);

    // Track background
    currentY += 16;
    drawRoundRect(ctx, CARD_X + 64, currentY, MAX_BAR, 20, 10, '#F5F5F4');

    // Active bar
    const barWidth = Math.max(16, (dim.percentage / 100) * MAX_BAR);
    drawRoundRect(ctx, CARD_X + 64, currentY, barWidth, 20, 10, palette.hex);

    currentY += 66;
  }

  // ── 9. Footer Watermark ───────────────────────────
  ctx.fillStyle = '#A8A29E';
  ctx.font      = '400 24px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Kenali cara kamu mengasihi di mikaasih.cyou', WIDTH / 2, CARD_Y + CARD_H - 45);

  return canvas.toDataURL('image/png');
}

/**
 * 2. KARTU HASIL PERBANDINGAN PASANGAN (Dual Profile / Couple Match)
 */
export async function generateComparisonCard(
  myName: string,
  myResult: AssessmentResult,
  partnerName: string,
  partnerScores: Record<DimensionKey, number>,
  similarityIndex: number,
): Promise<string> {
  if ('fonts' in document) {
    await document.fonts.ready;
  }

  const canvas = document.createElement('canvas');
  const WIDTH  = 1080;
  const HEIGHT = 1920;
  canvas.width  = WIDTH;
  canvas.height = HEIGHT;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Konteks kanvas gagal diinisialisasi.');

  // ── Background ───────────────────────────────────
  ctx.fillStyle = '#FDFBF7';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Ambient Blobs
  const blob1 = ctx.createRadialGradient(900, 200, 40, 900, 200, 520);
  blob1.addColorStop(0, 'rgba(244,63,94,0.12)');
  blob1.addColorStop(1, 'rgba(253,251,247,0)');
  ctx.fillStyle = blob1;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  const blob2 = ctx.createRadialGradient(180, 1700, 40, 180, 1700, 500);
  blob2.addColorStop(0, 'rgba(13,148,136,0.10)');
  blob2.addColorStop(1, 'rgba(253,251,247,0)');
  ctx.fillStyle = blob2;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // ── Card Frame ───────────────────────────────────
  const CARD_X = 64;
  const CARD_Y = 100;
  const CARD_W = WIDTH - 128;
  const CARD_H = HEIGHT - 200;

  drawRoundRect(ctx, CARD_X, CARD_Y, CARD_W, CARD_H, 48, '#FFFFFF', '#E7E5E4', 2);

  // ── Tag Header ───────────────────────────────────
  ctx.fillStyle = '#A8A29E';
  ctx.font      = '600 22px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('MIKAASIH • ANALISIS KOMPATIBILITAS', WIDTH / 2, CARD_Y + 70);

  // ── Couple Names Title ───────────────────────────
  const safeMyName = (myName.trim() || 'Kamu');
  const safePtName = (partnerName.trim() || 'Pasangan');

  ctx.fillStyle = '#1C1917';
  ctx.font      = '700 52px "Fraunces", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText(`${safeMyName}  &  ${safePtName}`, WIDTH / 2, CARD_Y + 140);

  // ── Circular Similarity Gauge ────────────────────
  const meta   = getSimilarityMeta(similarityIndex);
  const GAUGE_CX = WIDTH / 2;
  const GAUGE_CY = CARD_Y + 310;
  const GAUGE_R  = 95;
  const LINE_W   = 16;

  // Track Circle
  ctx.beginPath();
  ctx.arc(GAUGE_CX, GAUGE_CY, GAUGE_R, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(120,113,108,0.12)';
  ctx.lineWidth   = LINE_W;
  ctx.lineCap     = 'round';
  ctx.stroke();

  // Progress Arc (dari jam 12 searah jarum jam)
  if (similarityIndex > 0) {
    const startAngle = -Math.PI / 2;
    const endAngle   = startAngle + (Math.PI * 2 * (similarityIndex / 100));
    ctx.beginPath();
    ctx.arc(GAUGE_CX, GAUGE_CY, GAUGE_R, startAngle, endAngle);
    ctx.strokeStyle = meta.color;
    ctx.lineWidth   = LINE_W;
    ctx.lineCap     = 'round';
    ctx.stroke();
  }

  // Number inside circle
  ctx.fillStyle = meta.color;
  ctx.font      = '700 60px "Fraunces", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText(`${similarityIndex}%`, GAUGE_CX, GAUGE_CY + 18);

  // Label & Subtitle di bawah gauge
  ctx.fillStyle = '#1C1917';
  ctx.font      = '700 30px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(meta.label, GAUGE_CX, GAUGE_CY + 140);

  ctx.fillStyle = '#78716C';
  ctx.font      = '400 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(meta.desc, GAUGE_CX, GAUGE_CY + 175);

  // ── Legend Bar ───────────────────────────────────
  const LEG_Y = GAUGE_CY + 225;
  // User legend (Hitam/Stone-900)
  ctx.beginPath();
  ctx.arc(WIDTH / 2 - 130, LEG_Y, 9, 0, Math.PI * 2);
  ctx.fillStyle = '#1C1917';
  ctx.fill();

  ctx.fillStyle = '#1C1917';
  ctx.font      = '600 22px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(safeMyName, WIDTH / 2 - 110, LEG_Y + 7);

  // Partner legend (Rose-400)
  ctx.beginPath();
  ctx.arc(WIDTH / 2 + 50, LEG_Y, 9, 0, Math.PI * 2);
  ctx.fillStyle = '#FB7185';
  ctx.fill();

  ctx.fillStyle = '#E11D48';
  ctx.font      = '600 22px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(safePtName, WIDTH / 2 + 70, LEG_Y + 7);

  // ── Divider ──────────────────────────────────────
  const DIVIDER_Y = GAUGE_CY + 265;
  ctx.beginPath();
  ctx.strokeStyle = '#F5F5F4';
  ctx.lineWidth   = 2;
  ctx.moveTo(CARD_X + 64, DIVIDER_Y);
  ctx.lineTo(CARD_X + CARD_W - 64, DIVIDER_Y);
  ctx.stroke();

  // ── Side-by-Side Spectrum Comparison ─────────────
  let barY = DIVIDER_Y + 55;
  const BAR_MAX_W = CARD_W - 128;
  const BAR_LEFT  = CARD_X + 64;

  ctx.fillStyle = '#1C1917';
  ctx.font      = '700 28px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Perbandingan Spektrum Bahasa', BAR_LEFT, barY);
  barY += 50;

  for (const dim of DIMS_ORDER) {
    const pal   = DIMENSION_PALETTES[dim];
    const myPct = myResult.scores[dim]?.percentage ?? 0;
    const pPct  = Number(((partnerScores[dim] / 30) * 100).toFixed(1));

    // Dimension Title
    ctx.fillStyle = '#44403C';
    ctx.font      = '600 24px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(pal.name, BAR_LEFT, barY);

    // Score comparison text: "23.3% / 16.7%"
    ctx.textAlign = 'right';
    ctx.font      = '600 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#1C1917';
    ctx.fillText(`${myPct}%`, CARD_X + CARD_W - 145, barY);

    ctx.fillStyle = '#D1C5BB';
    ctx.fillText('/', CARD_X + CARD_W - 125, barY);

    ctx.fillStyle = '#E11D48';
    ctx.fillText(`${pPct}%`, CARD_X + CARD_W - 64, barY);

    // Bar 1: My Bar (Stone-900)
    barY += 14;
    drawRoundRect(ctx, BAR_LEFT, barY, BAR_MAX_W, 14, 7, 'rgba(120,113,108,0.10)');
    const myBarW = Math.max(14, (myPct / 100) * BAR_MAX_W);
    drawRoundRect(ctx, BAR_LEFT, barY, myBarW, 14, 7, '#1C1917');

    // Bar 2: Partner Bar (Rose-400)
    barY += 20;
    drawRoundRect(ctx, BAR_LEFT, barY, BAR_MAX_W, 14, 7, 'rgba(225,29,72,0.06)');
    const pBarW = Math.max(14, (pPct / 100) * BAR_MAX_W);
    drawRoundRect(ctx, BAR_LEFT, barY, pBarW, 14, 7, '#FB7185');

    barY += 46;
  }

  // ── Watermark Footer ─────────────────────────────
  ctx.fillStyle = '#A8A29E';
  ctx.font      = '400 22px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Kenali cara kamu mengasihi di mikaasih.cyou', WIDTH / 2, CARD_Y + CARD_H - 35);

  return canvas.toDataURL('image/png');
}

/**
 * Memicu unduhan file PNG dari data URL
 */
export function downloadCard(dataUrl: string, fileName: string = 'mikaasih-profil-kasih.png'): void {
  const link    = document.createElement('a');
  link.href     = dataUrl;
  link.download = fileName;
  link.click();
}
