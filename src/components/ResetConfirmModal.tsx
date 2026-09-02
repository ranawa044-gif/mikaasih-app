import React from 'react';
import { Modal } from './Modal';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ulangi Kuis?">
      <div className="space-y-5">
        <p className="text-sm theme-text-muted font-sans leading-relaxed">
          Seluruh progres jawaban dan hasil analisis saat ini akan dihapus dari peramban.
          Tindakan ini <strong className="theme-text-primary">tidak dapat dibatalkan</strong>.
        </p>
        <div className="flex gap-3 justify-end pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl theme-box theme-text-muted text-sm font-medium hover:text-stone-200 transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => { onConfirm(); onClose(); }}
            className="px-5 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-medium hover:bg-rose-700 transition-colors shadow-sm"
          >
            Ya, Hapus &amp; Ulangi
          </button>
        </div>
      </div>
    </Modal>
  );
};
