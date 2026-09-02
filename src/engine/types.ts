// =====================================================
// RASA APP — Core Type Definitions
// Berdasarkan spesifikasi psikometri Chapman (1992)
// =====================================================

/** 5 Dimensi Love Language */
export type DimensionKey = 'W' | 'Q' | 'G' | 'S' | 'T';

/** Satu respons jawaban pengguna per soal */
export interface UserResponse {
  question_id: number;
  selected_dimension: DimensionKey;
}

/** Hasil per-dimensi setelah kalkulasi */
export interface DimensionResult {
  dimension: DimensionKey;
  dimension_name: string;
  raw_score: number;
  percentage: number;
  tier: 'Primary' | 'Co-Primary' | 'Secondary' | 'Low' | 'Balanced';
}

/** Output final dari scoring engine */
export interface AssessmentResult {
  total_answered: number;
  profile_type:
    | 'Single Primary'
    | 'Co-Primary / Bilingual'
    | 'Multilingual'
    | 'Balanced / Undifferentiated';
  primary_dimensions: DimensionKey[];
  rankings: DimensionResult[];
  scores: Record<DimensionKey, DimensionResult>;
}

/** Satu soal dari bank soal */
export interface QuizQuestion {
  id: number;
  pair_code: string;
  option_a: { dimension: DimensionKey; text: string };
  option_b: { dimension: DimensionKey; text: string };
}

/** Data pasangan untuk Couple Match */
export interface PartnerData {
  name: string;
  scores: Record<DimensionKey, number>;
}

/** Status sesi kuis */
export type QuizStatus =
  | 'IDLE'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'RESULT_READY';

/** State tersimpan di localStorage */
export interface PersistedState {
  version: string;
  last_updated: number;
  current_step: number;
  user_name: string;
  answers: UserResponse[];
  shuffled_question_ids: number[];
  completed_result: AssessmentResult | null;
}
