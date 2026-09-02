// =====================================================
// MIKAASIH — useCoupleMatch Hook
// Menerima partnerData langsung (override) atau baca URL
// Sehingga manualPartner / dismiss state dari App.tsx diproses akurat
// =====================================================

import { useMemo } from 'react';
import type { PartnerData, AssessmentResult, DimensionKey } from '../engine/types';
import { parsePartnerUrl } from '../utils/urlEncoder';

const DIMENSIONS: DimensionKey[] = ['W', 'Q', 'G', 'S', 'T'];

export interface CoupleMatchResult {
  partnerData: PartnerData | null;
  partnerPercentages: Record<DimensionKey, number> | null;
  similarityIndex: number | null;
  sharedStrengths: DimensionKey[];
  frictionPoints: DimensionKey[];
}

/**
 * Menghitung Similarity Index (Chapman formula):
 * Index = 100% − (0.5 × Σ|P_A − P_B|)
 *
 * @param myResult    Hasil kuis pengguna sendiri
 * @param overridePartner  Data pasangan dari App.tsx. Jika undefined, baru baca URL.
 */
export function useCoupleMatch(
  myResult: AssessmentResult | null,
  overridePartner?: PartnerData | null,
): CoupleMatchResult {

  // Prioritas: overridePartner (jika didefinisikan) > URL params
  const partnerData = useMemo<PartnerData | null>(() => {
    if (overridePartner !== undefined) return overridePartner;
    const query = window.location.search;
    if (!query) return null;
    return parsePartnerUrl(query);
  }, [overridePartner]);

  const partnerPercentages = useMemo<Record<DimensionKey, number> | null>(() => {
    if (!partnerData) return null;
    return DIMENSIONS.reduce((acc, dim) => {
      const val = partnerData.scores[dim] ?? 0;
      acc[dim] = Number(((val / 30) * 100).toFixed(1));
      return acc;
    }, {} as Record<DimensionKey, number>);
  }, [partnerData]);

  const similarityIndex = useMemo<number | null>(() => {
    if (!myResult || !partnerPercentages) return null;
    const totalDiff = DIMENSIONS.reduce((acc, dim) => {
      const myPct      = myResult.scores[dim]?.percentage ?? 0;
      const partnerPct = partnerPercentages[dim] ?? 0;
      return acc + Math.abs(myPct - partnerPct);
    }, 0);
    return Math.max(0, Math.min(100, Math.round(100 - 0.5 * totalDiff)));
  }, [myResult, partnerPercentages]);

  /**
   * Titik Temu: dimensi di mana KEDUANYA memiliki skor >= 20%
   * (setara dengan raw score >= 6 dari 30)
   * Menandakan dimensi yang sama-sama diapresiasi tinggi
   */
  const sharedStrengths = useMemo<DimensionKey[]>(() => {
    if (!myResult || !partnerPercentages) return [];
    return DIMENSIONS.filter((dim) => {
      const myPct      = myResult.scores[dim]?.percentage ?? 0;
      const partnerPct = partnerPercentages[dim] ?? 0;
      return myPct >= 20 && partnerPct >= 20;
    });
  }, [myResult, partnerPercentages]);

  /**
   * Area Miskomunikasi: dimensi dengan selisih persentase >= 13%
   * (setara dengan selisih ~4 poin raw score)
   * Menandakan ekspektasi yang berpotensi tidak terpenuhi secara mutual
   */
  const frictionPoints = useMemo<DimensionKey[]>(() => {
    if (!myResult || !partnerPercentages) return [];
    return DIMENSIONS.filter((dim) => {
      const myPct      = myResult.scores[dim]?.percentage ?? 0;
      const partnerPct = partnerPercentages[dim] ?? 0;
      return Math.abs(myPct - partnerPct) >= 13;
    });
  }, [myResult, partnerPercentages]);

  return { partnerData, partnerPercentages, similarityIndex, sharedStrengths, frictionPoints };
}
