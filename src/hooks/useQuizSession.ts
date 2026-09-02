// =====================================================
// RASA APP — useQuizSession Hook
// State machine: IDLE → IN_PROGRESS → RESULT_READY
// Auto-save ke localStorage, shuffle, anti-bias slot
// =====================================================

import { useState, useCallback } from 'react';
import type { QuizStatus, UserResponse, AssessmentResult, PersistedState } from '../engine/types';
import type { QuizQuestion } from '../engine/types';
import { calculateLoveLanguage } from '../engine/scoring';
import questionsData from '../data/questions.json';

const STORAGE_KEY = 'll_assessment_state_v1';
const STORAGE_VERSION = '1.0';

/** Fisher-Yates shuffle */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Simpan state ke localStorage */
function persistState(state: PersistedState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* incognito / storage full */ }
}

/** Baca state dari localStorage */
function loadPersistedState(): PersistedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: PersistedState = JSON.parse(raw);
    if (parsed.version !== STORAGE_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

const allQuestions: QuizQuestion[] = questionsData as QuizQuestion[];

export interface QuizSessionState {
  status: QuizStatus;
  userName: string;
  currentStep: number;        // 0-indexed
  totalQuestions: number;
  currentQuestion: QuizQuestion | null;
  currentQuestionDisplay: {   // slot A/B bisa diswap (anti-bias)
    optionA: QuizQuestion['option_a'];
    optionB: QuizQuestion['option_b'];
    swapped: boolean;
  } | null;
  answers: UserResponse[];
  result: AssessmentResult | null;
  hasSavedSession: boolean;
  // Actions
  startQuiz: (name: string) => void;
  resumeSession: () => void;
  clearSession: () => void;
  selectOption: (dimension: string) => void;
  goToPrevious: () => void;
}

export function useQuizSession(): QuizSessionState {
  const [status,      setStatus]      = useState<QuizStatus>('IDLE');
  const [userName,    setUserName]    = useState('');
  const [shuffledIds, setShuffledIds] = useState<number[]>([]);
  const [swapFlags,   setSwapFlags]   = useState<boolean[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers,     setAnswers]     = useState<UserResponse[]>([]);
  const [result,      setResult]      = useState<AssessmentResult | null>(null);

  const savedSession = loadPersistedState();
  const hasSavedSession = !!(savedSession && !savedSession.completed_result && savedSession.answers.length > 0);

  // Inisialisasi shuffle + swap flags baru
  const initNewSession = useCallback((name: string) => {
    const ids   = shuffle(allQuestions.map((q) => q.id));
    const flags = ids.map(() => Math.random() < 0.5);
    setShuffledIds(ids);
    setSwapFlags(flags);
    setUserName(name);
    setCurrentStep(0);
    setAnswers([]);
    setResult(null);
    setStatus('IN_PROGRESS');

    const state: PersistedState = {
      version: STORAGE_VERSION,
      last_updated: Date.now(),
      current_step: 0,
      user_name: name,
      answers: [],
      shuffled_question_ids: ids,
      completed_result: null,
    };
    persistState(state);
  }, []);

  const startQuiz = useCallback((name: string) => {
    initNewSession(name);
  }, [initNewSession]);

  const resumeSession = useCallback(() => {
    const saved = loadPersistedState();
    if (!saved) return;
    const ids   = saved.shuffled_question_ids;
    const flags = ids.map(() => Math.random() < 0.5); // re-generate flags (visual only)
    setShuffledIds(ids);
    setSwapFlags(flags);
    setUserName(saved.user_name);
    setCurrentStep(saved.current_step);
    setAnswers(saved.answers);
    setResult(null);
    setStatus('IN_PROGRESS');
  }, []);

  const clearSession = useCallback(() => {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* noop */ }
    setStatus('IDLE');
    setUserName('');
    setShuffledIds([]);
    setSwapFlags([]);
    setCurrentStep(0);
    setAnswers([]);
    setResult(null);
  }, []);

  const selectOption = useCallback((dimension: string) => {
    if (status !== 'IN_PROGRESS' || currentStep >= allQuestions.length) return;

    const qId = shuffledIds[currentStep];
    // Dimension diterima langsung dari UI (slot swap hanya visual)
    const selectedDim = dimension as UserResponse['selected_dimension'];

    const newAnswer: UserResponse = { question_id: qId, selected_dimension: selectedDim };
    const newAnswers = [...answers.filter((a) => a.question_id !== qId), newAnswer];

    const nextStep = currentStep + 1;

    if (nextStep >= allQuestions.length) {
      // Semua soal selesai — jalankan scoring engine
      try {
        const finalAnswers = newAnswers.sort((a, b) => a.question_id - b.question_id);
        const calcResult   = calculateLoveLanguage(finalAnswers);
        setAnswers(newAnswers);
        setCurrentStep(nextStep);
        setResult(calcResult);
        setStatus('RESULT_READY');

        const state: PersistedState = {
          version: STORAGE_VERSION,
          last_updated: Date.now(),
          current_step: nextStep,
          user_name: userName,
          answers: newAnswers,
          shuffled_question_ids: shuffledIds,
          completed_result: calcResult,
        };
        persistState(state);
      } catch (err) {
        console.error('Scoring error:', err);
      }
    } else {
      setAnswers(newAnswers);
      setCurrentStep(nextStep);

      const state: PersistedState = {
        version: STORAGE_VERSION,
        last_updated: Date.now(),
        current_step: nextStep,
        user_name: userName,
        answers: newAnswers,
        shuffled_question_ids: shuffledIds,
        completed_result: null,
      };
      persistState(state);
    }
  }, [status, currentStep, shuffledIds, answers, userName]);

  const goToPrevious = useCallback(() => {
    if (currentStep <= 0 || status !== 'IN_PROGRESS') return;
    const prevStep   = currentStep - 1;
    const newAnswers = answers.filter((a) => a.question_id !== shuffledIds[prevStep]);
    setCurrentStep(prevStep);
    setAnswers(newAnswers);

    const state: PersistedState = {
      version: STORAGE_VERSION,
      last_updated: Date.now(),
      current_step: prevStep,
      user_name: userName,
      answers: newAnswers,
      shuffled_question_ids: shuffledIds,
      completed_result: null,
    };
    persistState(state);
  }, [currentStep, status, shuffledIds, answers, userName]);

  // Derive current question & display (with swap)
  let currentQuestion: QuizQuestion | null = null;
  let currentQuestionDisplay: QuizSessionState['currentQuestionDisplay'] = null;

  if (status === 'IN_PROGRESS' && shuffledIds.length > 0 && currentStep < allQuestions.length) {
    const qId = shuffledIds[currentStep];
    currentQuestion = allQuestions.find((q) => q.id === qId) || null;

    if (currentQuestion) {
      const swapped = swapFlags[currentStep] ?? false;
      currentQuestionDisplay = swapped
        ? { optionA: currentQuestion.option_b as any, optionB: currentQuestion.option_a as any, swapped: true }
        : { optionA: currentQuestion.option_a, optionB: currentQuestion.option_b, swapped: false };
    }
  }

  return {
    status,
    userName,
    currentStep,
    totalQuestions: allQuestions.length,
    currentQuestion,
    currentQuestionDisplay,
    answers,
    result,
    hasSavedSession,
    startQuiz,
    resumeSession,
    clearSession,
    selectOption,
    goToPrevious,
  };
}
