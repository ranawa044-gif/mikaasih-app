// =====================================================
// MIKAASIH — Root App Orchestrator
// Dengan AnimatePresence page transitions antar semua views
// =====================================================

import React, { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { AppLayout }           from './components/AppLayout';
import { OnboardingView }      from './components/OnboardingView';
import { QuizCard }            from './components/QuizCard';
import { ResultView }          from './components/ResultView';
import { MatchView }           from './components/MatchView';
import { Toast }               from './components/Toast';
import { ResetConfirmModal }   from './components/ResetConfirmModal';
import { PartnerInputModal }   from './components/PartnerInputModal';

import { useQuizSession }      from './hooks/useQuizSession';
import { useToast }            from './hooks/useToast';
import { useCoupleMatch }      from './hooks/useCoupleMatch';

import { encodePartnerUrl, copyToClipboard, parsePartnerUrl, encodeComparisonUrl, parseComparisonUrl } from './utils/urlEncoder';
import { generateShareableCard, generateComparisonCard, downloadCard } from './utils/imageGenerator';
import { reconstructResultFromRawScores } from './engine/scoring';

import type { DimensionKey } from './engine/types';

type AppView = 'onboarding' | 'quiz' | 'result' | 'match';

// ── Page Transition Variants ──────────────────────────
const pageVariants = {
  initial: { opacity: 0, y: 18, scale: 0.98 },
  animate: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.42, ease: 'easeOut' as const },
  },
  exit: {
    opacity: 0, y: -12, scale: 0.98,
    transition: { duration: 0.22, ease: 'easeIn' as const },
  },
};

export default function App() {
  const quiz               = useQuizSession();
  const { toast, showToast, dismissToast } = useToast();

  const [view,              setView]             = useState<AppView>('onboarding');
  const [showResetModal,    setShowResetModal]   = useState(false);
  const [showPartnerModal,  setShowPartnerModal] = useState(false);
  const [isExporting,       setIsExporting]      = useState(false);
  const [manualPartner,     setManualPartner]    = useState<ReturnType<typeof parsePartnerUrl>>(null);
  const [dismissedInvite,   setDismissedInvite]  = useState(false);

  // State untuk flow URL perbandingan dua profil (tanpa kuis)
  const [viewerName,       setViewerName]       = useState<string>('');
  const [viewerResult,     setViewerResult]     = useState<import('./engine/types').AssessmentResult | null>(null);

  // Deteksi URL dua profil saat pertama kali dimuat
  // Format: ?n=Rian&s=W7-Q8-G9-S4-T2&pn=Sari&ps=W5-Q9-G7-S6-T3
  const comparisonFromUrl = React.useMemo(() => parseComparisonUrl(window.location.search), []);

  // Deteksi jika pengguna diundang oleh pasangan lewat URL tunggal
  // Format: ?n=Rian&s=W7-Q8-G9-S4-T2
  const singlePartnerFromUrl = React.useMemo(() => {
    const search = window.location.search;
    if (!search || search.includes('&ps=')) return null;
    return parsePartnerUrl(search);
  }, []);

  React.useEffect(() => {
    const search = window.location.search;
    if (!search) return;

    const params = new URLSearchParams(search);
    const hasComparisonParams = params.has('n') && params.has('s') && params.has('pn') && params.has('ps');
    const hasSinglePartnerParams = params.has('s') && !params.has('ps');

    if (hasComparisonParams) {
      if (comparisonFromUrl) {
        const reconstructed = reconstructResultFromRawScores(comparisonFromUrl.me.scores);
        setViewerName(comparisonFromUrl.me.name);
        setViewerResult(reconstructed);
        setManualPartner(comparisonFromUrl.partner);
        setView('match');
      } else {
        // Terdeteksi manipulasi URL perbandingan (skor tidak valid / total ≠ 30)
        showToast('Tautan perbandingan tidak valid atau skor dimanipulasi (Total skor harus 30 poin) ⚠️', 'error', 6000);
      }
    } else if (hasSinglePartnerParams) {
      if (singlePartnerFromUrl) {
        showToast(`Tautan dari ${singlePartnerFromUrl.name} terhubung! Selesaikan kuis untuk melihat keserasian kalian ✨`, 'info', 5000);
      } else {
        // Terdeteksi manipulasi URL pasangan tunggal (skor tidak valid / total ≠ 30)
        showToast('Tautan pasangan tidak valid atau skor dimanipulasi (Total skor harus 30 poin) ⚠️', 'error', 6000);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handler jika user mengabaikan undangan pasangan dan ingin kuis mandiri
  const handleDismissPartnerInvite = useCallback(() => {
    setDismissedInvite(true);
    setManualPartner(null);
    // Bersihkan parameter URL di address bar tanpa reload
    if (window.history.replaceState) {
      window.history.replaceState({}, '', window.location.pathname);
    }
    showToast('Undangan pasangan diabaikan. Kamu memulai kuis mandiri.', 'info', 3000);
  }, [showToast]);

  // Hasil dan nama yang ditampilkan: URL viewer > quiz result
  const displayResult = viewerResult ?? quiz.result;
  const displayName   = viewerName   || quiz.userName || 'Kamu';

  // Partner aktif: jika user dismiss undangan, jadikan null secara eksplisit
  const effectivePartner = dismissedInvite ? null : (manualPartner ?? singlePartnerFromUrl);

  // Pass effectivePartner langsung ke hook agar kalkulasi pakai data yang benar
  const coupleMatch = useCoupleMatch(displayResult, effectivePartner);

  // ── Navigation ─────────────────────────────────────

  const handleStartQuiz = useCallback((name: string) => {
    quiz.startQuiz(name);
    setView('quiz');
  }, [quiz]);

  const handleResumeSession = useCallback(() => {
    quiz.resumeSession();
    setView('quiz');
  }, [quiz]);

  const handleSelectOption = useCallback((dimension: DimensionKey) => {
    quiz.selectOption(dimension);
  }, [quiz]);

  // Detect quiz completion → navigate to result
  React.useEffect(() => {
    if (quiz.status === 'RESULT_READY' && view === 'quiz') {
      setTimeout(() => {
        // Jika ada data pasangan, langsung tampilkan toast selebrasi
        if (coupleMatch.partnerData) {
          showToast(`Kuis selesai! Hasil keserasian dengan ${coupleMatch.partnerData.name} siap dilihat 🎉`, 'success', 4500);
        }
        setView('result');
      }, 250);
    }
  }, [quiz.status, view, coupleMatch.partnerData, showToast]);

  // ── Actions ────────────────────────────────────────

  const handleShareLink = useCallback(async () => {
    if (!displayResult) return;
    const rawScores = {
      W: displayResult.scores.W.raw_score,
      Q: displayResult.scores.Q.raw_score,
      G: displayResult.scores.G.raw_score,
      S: displayResult.scores.S.raw_score,
      T: displayResult.scores.T.raw_score,
    };
    const url = encodePartnerUrl(displayName, rawScores);
    const ok  = await copyToClipboard(url);
    showToast(
      ok ? 'Tautan undangan disalin! Kirimkan ke pasanganmu 📋' : 'Gagal menyalin — coba salin URL manual.',
      ok ? 'success' : 'error'
    );
  }, [displayResult, displayName, showToast]);

  /**
   * 1-Click Share ke WhatsApp dengan template pesan manis
   */
  const handleShareWhatsApp = useCallback(() => {
    if (!displayResult) return;
    const rawScores = {
      W: displayResult.scores.W.raw_score,
      Q: displayResult.scores.Q.raw_score,
      G: displayResult.scores.G.raw_score,
      S: displayResult.scores.S.raw_score,
      T: displayResult.scores.T.raw_score,
    };
    const url = encodePartnerUrl(displayName, rawScores);
    const primaryName = displayResult.rankings[0]?.dimension_name || 'Love Language';
    const text = `Hai! Aku baru aja cek Love Language di Mikaasih dan bahasa kasih utamaku adalah *${primaryName}*. Yuk isi kuisnya juga biar kita bisa lihat seberapa cocok bahasa kasih kita berdua: ${url}`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
    showToast('Membuka WhatsApp... 💬', 'success');
  }, [displayResult, displayName, showToast]);

  const handleExportCard = useCallback(async () => {
    if (!displayResult || isExporting) return;
    setIsExporting(true);
    showToast('Kartu sedang disiapkan... 🎨', 'info', 3500);
    try {
      const dataUrl = await generateShareableCard(displayName, displayResult);
      downloadCard(dataUrl, `mikaasih-profil-${displayName.toLowerCase().replace(/\s+/g, '-')}.png`);
      showToast('Kartu berhasil diunduh! ✨', 'success');
    } catch {
      showToast('Gagal membuat kartu. Coba lagi.', 'error');
    } finally {
      setIsExporting(false);
    }
  }, [displayResult, displayName, isExporting, showToast]);

  const handlePartnerLinkSubmit = useCallback((input: string) => {
    const parsed = parsePartnerUrl(input);
    if (!parsed) {
      showToast('Format tautan tidak valid atau total skor salah ⚠️', 'error');
      return;
    }
    setDismissedInvite(false);
    setManualPartner(parsed);
    if (quiz.status === 'RESULT_READY') {
      setView('match');
    } else {
      showToast(`Tautan ${parsed.name} tersimpan! Selesaikan kuis terlebih dahulu.`, 'info');
    }
  }, [quiz.status, showToast]);

  // activePartner dideklarasikan di sini supaya tersedia untuk handler di bawah
  const activePartner = coupleMatch.partnerData;

  /**
   * Salin URL perbandingan dua profil — siapapun buka langsung ke MatchView
   */
  const handleShareComparisonLink = useCallback(async () => {
    if (!displayResult || !activePartner) return;
    const myScores = {
      W: displayResult.scores.W.raw_score,
      Q: displayResult.scores.Q.raw_score,
      G: displayResult.scores.G.raw_score,
      S: displayResult.scores.S.raw_score,
      T: displayResult.scores.T.raw_score,
    };
    const partnerScores = {
      W: activePartner.scores.W,
      Q: activePartner.scores.Q,
      G: activePartner.scores.G,
      S: activePartner.scores.S,
      T: activePartner.scores.T,
    };
    const url = encodeComparisonUrl(displayName, myScores, activePartner.name, partnerScores);
    const ok  = await copyToClipboard(url);
    showToast(
      ok ? 'Tautan perbandingan disalin! Siapapun buka ini akan langsung melihat hasil kalian 🔗' : 'Gagal menyalin.',
      ok ? 'success' : 'error'
    );
  }, [displayResult, displayName, activePartner, showToast]);

  /**
   * 1-Click Kirim Balik Hasil Perbandingan ke Pasangan via WhatsApp
   */
  const handleShareComparisonWhatsApp = useCallback(() => {
    if (!displayResult || !activePartner) return;
    const myScores = {
      W: displayResult.scores.W.raw_score,
      Q: displayResult.scores.Q.raw_score,
      G: displayResult.scores.G.raw_score,
      S: displayResult.scores.S.raw_score,
      T: displayResult.scores.T.raw_score,
    };
    const partnerScores = {
      W: activePartner.scores.W,
      Q: activePartner.scores.Q,
      G: activePartner.scores.G,
      S: activePartner.scores.S,
      T: activePartner.scores.T,
    };
    const url = encodeComparisonUrl(displayName, myScores, activePartner.name, partnerScores);
    const scorePct = coupleMatch.similarityIndex ?? 0;
    const text = `Hai ${activePartner.name}! Aku udah selesai isi kuis Love Language di Mikaasih. Ternyata indeks keserasian kita *${scorePct}%*! Yuk buka tautan ini buat lihat detail kecocokan bahasa kasih kita berdua: ${url}`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
    showToast(`Membuka WhatsApp untuk mengirim hasil ke ${activePartner.name}... 💬`, 'success');
  }, [displayResult, displayName, activePartner, coupleMatch.similarityIndex, showToast]);

  /**
   * Unduh PNG perbandingan dua profil
   */
  const handleExportComparisonCard = useCallback(async () => {
    if (!displayResult || !activePartner || isExporting) return;
    setIsExporting(true);
    showToast('Kartu perbandingan sedang disiapkan... 🎨', 'info', 3500);
    try {
      const partnerScores = {
        W: activePartner.scores.W,
        Q: activePartner.scores.Q,
        G: activePartner.scores.G,
        S: activePartner.scores.S,
        T: activePartner.scores.T,
      };
      const dataUrl = await generateComparisonCard(
        displayName,
        displayResult,
        activePartner.name,
        partnerScores,
        coupleMatch.similarityIndex ?? 0,
      );
      downloadCard(dataUrl, `mikaasih-perbandingan-${displayName.toLowerCase()}-${activePartner.name.toLowerCase()}.png`);
      showToast('Kartu perbandingan berhasil diunduh! ✨', 'success');
    } catch {
      showToast('Gagal membuat kartu. Coba lagi.', 'error');
    } finally {
      setIsExporting(false);
    }
  }, [displayResult, displayName, activePartner, isExporting, coupleMatch.similarityIndex, showToast]);

  const handleReset = useCallback(() => {
    quiz.clearSession();
    setManualPartner(null);
    setDismissedInvite(false);
    setViewerName('');
    setViewerResult(null);
    if (window.history.replaceState) {
      window.history.replaceState({}, '', window.location.pathname);
    }
    setView('onboarding');
  }, [quiz]);

  // ── Render ─────────────────────────────────────────
  return (
    <AppLayout>
      <Toast toast={toast} onClose={dismissToast} />

      <ResetConfirmModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={handleReset}
      />
      <PartnerInputModal
        isOpen={showPartnerModal}
        onClose={() => setShowPartnerModal(false)}
        onSubmitLinkOrCode={handlePartnerLinkSubmit}
      />

      {/* ── Animated Page Transitions ── */}
      <AnimatePresence mode="wait">

        {view === 'onboarding' && (
          <motion.div key="onboarding" {...pageVariants} className="flex-1 flex flex-col">
            <OnboardingView
              onStartQuiz={handleStartQuiz}
              onEnterPartnerCode={() => setShowPartnerModal(true)}
              hasSavedSession={quiz.hasSavedSession}
              onResumeSession={handleResumeSession}
              partnerInviteName={dismissedInvite ? null : singlePartnerFromUrl?.name}
              onDismissPartnerInvite={singlePartnerFromUrl && !dismissedInvite ? handleDismissPartnerInvite : undefined}
            />
          </motion.div>
        )}

        {view === 'quiz' && quiz.currentQuestionDisplay && (
          <motion.div key="quiz" {...pageVariants} className="flex-1 flex flex-col">
            <QuizCard
              questionNumber={quiz.currentStep + 1}
              totalQuestions={quiz.totalQuestions}
              optionA={quiz.currentQuestionDisplay.optionA}
              optionB={quiz.currentQuestionDisplay.optionB}
              onSelectOption={handleSelectOption}
              onPrevious={quiz.goToPrevious}
              canGoPrevious={quiz.currentStep > 0}
            />
          </motion.div>
        )}

        {view === 'result' && displayResult && (
          <motion.div key="result" {...pageVariants} className="flex-1 flex flex-col">
            <ResultView
              userName={displayName}
              result={displayResult}
              onRetake={() => setShowResetModal(true)}
              onShareLink={handleShareLink}
              onShareWhatsApp={handleShareWhatsApp}
              onExportCard={handleExportCard}
              connectedPartnerName={activePartner?.name}
              onComparePartner={() => {
                if (activePartner) setView('match');
                else setShowPartnerModal(true);
              }}
            />
          </motion.div>
        )}

        {view === 'match' && displayResult && activePartner && (
          <motion.div key="match" {...pageVariants} className="flex-1 flex flex-col">
            <MatchView
              myResult={displayResult}
              myName={displayName}
              partner={activePartner}
              similarityIndex={coupleMatch.similarityIndex ?? 0}
              sharedStrengths={coupleMatch.sharedStrengths}
              frictionPoints={coupleMatch.frictionPoints}
              onBack={() => setView('result')}
              onShareComparisonLink={handleShareComparisonLink}
              onShareComparisonWhatsApp={handleShareComparisonWhatsApp}
              onExportComparisonCard={handleExportComparisonCard}
            />
          </motion.div>
        )}

      </AnimatePresence>
    </AppLayout>
  );
}
