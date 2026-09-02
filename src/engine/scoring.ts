// =====================================================
// RASA APP — Psychometric Scoring Engine (Final)
// Algoritma tervalidasi: Chapman (1992), Egbert & Polk (2006),
// Surijah & Septiarly (2016)
// Zero-bug, anti-tampering, deterministic
// =====================================================

import type { DimensionKey, UserResponse, DimensionResult, AssessmentResult } from './types';

/** Matriks Kunci Pasangan Soal Resmi — Penjaga Integritas Anti-Tampering */
export const QUESTION_PAIRS: Record<number, [DimensionKey, DimensionKey]> = {
  1:  ['W', 'Q'], 2:  ['W', 'Q'], 3:  ['W', 'Q'],
  4:  ['W', 'G'], 5:  ['W', 'G'], 6:  ['W', 'G'],
  7:  ['W', 'S'], 8:  ['W', 'S'], 9:  ['W', 'S'],
  10: ['W', 'T'], 11: ['W', 'T'], 12: ['W', 'T'],
  13: ['Q', 'G'], 14: ['Q', 'G'], 15: ['Q', 'G'],
  16: ['Q', 'S'], 17: ['Q', 'S'], 18: ['Q', 'S'],
  19: ['Q', 'T'], 20: ['Q', 'T'], 21: ['Q', 'T'],
  22: ['G', 'S'], 23: ['G', 'S'], 24: ['G', 'S'],
  25: ['G', 'T'], 26: ['G', 'T'], 27: ['G', 'T'],
  28: ['S', 'T'], 29: ['S', 'T'], 30: ['S', 'T'],
};

const DIMENSION_NAMES: Record<DimensionKey, string> = {
  W: 'Words of Affirmation',
  Q: 'Quality Time',
  G: 'Receiving Gifts',
  S: 'Acts of Service',
  T: 'Physical Touch',
};

/**
 * Mesin Penilaian Psikometri Final
 * @param answers - Array 30 jawaban pengguna
 * @returns AssessmentResult - Hasil klasifikasi lengkap
 * @throws Error jika input tidak valid atau ada upaya manipulasi
 */
export function calculateLoveLanguage(answers: UserResponse[]): AssessmentResult {
  // 1. Validasi kelengkapan array
  if (!Array.isArray(answers) || answers.length !== 30) {
    throw new Error('Validasi Gagal: Input harus berisi tepat 30 butir jawaban.');
  }

  const answeredIds = new Set<number>();
  const rawScores: Record<DimensionKey, number> = { W: 0, Q: 0, G: 0, S: 0, T: 0 };
  const headToHeadMatrix: Record<string, number> = {};

  // 2. Validasi integritas setiap jawaban (anti-tampering)
  for (const item of answers) {
    const qId = item.question_id;

    if (!(qId in QUESTION_PAIRS)) {
      throw new Error(`Validasi Gagal: ID Pertanyaan ${qId} tidak valid (harus 1-30).`);
    }
    if (answeredIds.has(qId)) {
      throw new Error(`Validasi Gagal: Duplikasi jawaban pada ID ${qId}.`);
    }

    const validPair = QUESTION_PAIRS[qId];
    if (!validPair.includes(item.selected_dimension)) {
      throw new Error(
        `Inkonsistensi Data: Soal ${qId} hanya menguji [${validPair.join(', ')}], ` +
        `tetapi menerima '${item.selected_dimension}'.`
      );
    }

    answeredIds.add(qId);
    rawScores[item.selected_dimension] += 1;

    // Catat data duel langsung (Head-to-Head Tie-Breaker)
    const opponent = validPair[0] === item.selected_dimension ? validPair[1] : validPair[0];
    const duelKey = `${item.selected_dimension}_vs_${opponent}`;
    headToHeadMatrix[duelKey] = (headToHeadMatrix[duelKey] || 0) + 1;
  }

  // 3. Format hasil dasar + normalisasi persentase
  const dimensionsList: DimensionKey[] = ['W', 'Q', 'G', 'S', 'T'];
  let resultsList: DimensionResult[] = dimensionsList.map((dim) => ({
    dimension: dim,
    dimension_name: DIMENSION_NAMES[dim],
    raw_score: rawScores[dim],
    percentage: Number(((rawScores[dim] / 30) * 100).toFixed(1)),
    tier: 'Secondary',
  }));

  // 4. Pengurutan deterministik: Skor → Head-to-Head → Alfabetis
  resultsList.sort((a, b) => {
    if (b.raw_score !== a.raw_score) return b.raw_score - a.raw_score;
    const h2hA = headToHeadMatrix[`${a.dimension}_vs_${b.dimension}`] || 0;
    const h2hB = headToHeadMatrix[`${b.dimension}_vs_${a.dimension}`] || 0;
    if (h2hA !== h2hB) return h2hB - h2hA;
    return a.dimension.localeCompare(b.dimension);
  });

  const maxScore = resultsList[0].raw_score;
  const minScore = resultsList[4].raw_score;

  let profileType: AssessmentResult['profile_type'];
  let primaryDimensions: DimensionKey[] = [];

  // 5. Klasifikasi Psikometri
  if (maxScore - minScore <= 2) {
    // Kondisi A: Profil Rata / Balanced (tidak ada preferensi dominan yang signifikan)
    profileType = 'Balanced / Undifferentiated';
    resultsList.forEach((item) => (item.tier = 'Balanced'));
    primaryDimensions = resultsList.map((d) => d.dimension);
  } else {
    const absoluteTops = resultsList.filter((r) => r.raw_score === maxScore);

    if (absoluteTops.length === 1) {
      const first  = resultsList[0];
      const second = resultsList[1];
      const third  = resultsList[2];

      if (first.raw_score - second.raw_score === 1 && second.raw_score > third.raw_score) {
        // Kondisi B: Co-Primary / Bilingual (selisih 1 poin, peringkat 2 unggul mutlak dari peringkat 3)
        profileType = 'Co-Primary / Bilingual';
        first.tier  = 'Co-Primary';
        second.tier = 'Co-Primary';
        primaryDimensions = [first.dimension, second.dimension];
      } else {
        // Kondisi C: Single Primary Dominan
        profileType = 'Single Primary';
        first.tier = 'Primary';
        primaryDimensions = [first.dimension];
      }
    } else if (absoluteTops.length === 2) {
      // Kondisi D: Dua dimensi skor identik di puncak
      profileType = 'Co-Primary / Bilingual';
      absoluteTops.forEach((item) => (item.tier = 'Co-Primary'));
      primaryDimensions = absoluteTops.map((d) => d.dimension);
    } else {
      // Kondisi E: 3+ dimensi skor identik di puncak
      profileType = 'Multilingual';
      absoluteTops.forEach((item) => (item.tier = 'Co-Primary'));
      primaryDimensions = absoluteTops.map((d) => d.dimension);
    }

    // Klasifikasi dimensi sisanya
    resultsList.forEach((item) => {
      if (!primaryDimensions.includes(item.dimension)) {
        item.tier = item.raw_score <= 3 ? 'Low' : 'Secondary';
      }
    });
  }

  // 6. Buat scores map untuk akses cepat
  const scoresMap = resultsList.reduce((acc, curr) => {
    acc[curr.dimension] = curr;
    return acc;
  }, {} as Record<DimensionKey, DimensionResult>);

  return {
    total_answered: answers.length,
    profile_type: profileType,
    primary_dimensions: primaryDimensions,
    rankings: resultsList,
    scores: scoresMap,
  };
}

// =====================================================
// Rekonstruksi AssessmentResult dari 5 raw scores
// Digunakan ketika membuka URL perbandingan langsung
// tanpa perlu 30 jawaban (hanya skor akhir tersedia)
// =====================================================
export function reconstructResultFromRawScores(
  rawScores: Record<DimensionKey, number>,
): AssessmentResult {
  const DIMS: DimensionKey[] = ['W', 'Q', 'G', 'S', 'T'];

  let resultsList: DimensionResult[] = DIMS.map((dim) => ({
    dimension:      dim,
    dimension_name: DIMENSION_NAMES[dim],
    raw_score:      rawScores[dim],
    percentage:     Number(((rawScores[dim] / 30) * 100).toFixed(1)),
    tier:           'Secondary' as const,
  }));

  // Sort: skor DESC, tie-break: alpha
  resultsList.sort((a, b) =>
    b.raw_score !== a.raw_score
      ? b.raw_score - a.raw_score
      : a.dimension.localeCompare(b.dimension),
  );

  const maxScore = resultsList[0].raw_score;
  const minScore = resultsList[resultsList.length - 1].raw_score;

  let profileType: AssessmentResult['profile_type'];
  let primaryDimensions: DimensionKey[] = [];

  if (maxScore - minScore <= 2) {
    profileType = 'Balanced / Undifferentiated';
    resultsList.forEach((item) => { item.tier = 'Balanced'; });
    primaryDimensions = resultsList.map((d) => d.dimension);
  } else {
    const absoluteTops = resultsList.filter((r) => r.raw_score === maxScore);

    if (absoluteTops.length >= 3) {
      profileType = 'Multilingual';
      absoluteTops.forEach((item) => { item.tier = 'Co-Primary'; });
      primaryDimensions = absoluteTops.map((d) => d.dimension);
    } else if (absoluteTops.length === 2) {
      profileType = 'Co-Primary / Bilingual';
      absoluteTops.forEach((item) => { item.tier = 'Co-Primary'; });
      primaryDimensions = absoluteTops.map((d) => d.dimension);
    } else {
      const first  = resultsList[0];
      const second = resultsList[1];
      const third  = resultsList[2];
      if (
        first.raw_score - second.raw_score === 1 &&
        second.raw_score > third.raw_score
      ) {
        profileType = 'Co-Primary / Bilingual';
        first.tier  = 'Co-Primary';
        second.tier = 'Co-Primary';
        primaryDimensions = [first.dimension, second.dimension];
      } else {
        profileType = 'Single Primary';
        first.tier  = 'Primary';
        primaryDimensions = [first.dimension];
      }
    }

    resultsList.forEach((item) => {
      if (!primaryDimensions.includes(item.dimension)) {
        item.tier = item.raw_score <= 3 ? 'Low' : 'Secondary';
      }
    });
  }

  const scoresMap = resultsList.reduce((acc, curr) => {
    acc[curr.dimension] = curr;
    return acc;
  }, {} as Record<DimensionKey, DimensionResult>);

  return {
    total_answered:    30,
    profile_type:      profileType,
    primary_dimensions: primaryDimensions,
    rankings:          resultsList,
    scores:            scoresMap,
  };
}

