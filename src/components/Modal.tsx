// =====================================================
// MIKAASIH — Modal Base Component
// Backdrop blur, spring animation, ESC + backdrop close,
// 100% Dynamic Theme Integration (Light & Dark)
// =====================================================

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(8, 6, 16, 0.65)', backdropFilter: 'blur(8px)' }}
          />

          {/* Modal Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            className="theme-modal relative w-full max-w-md rounded-3xl p-6 md:p-8 space-y-5 z-10"
          >
            <div
              className="flex items-center justify-between border-b pb-4"
              style={{ borderColor: 'var(--box-border)' }}
            >
              <h3 className="font-serif text-xl theme-text-primary">{title}</h3>
              <button
                type="button"
                onClick={onClose}
                className="theme-text-subtle hover:theme-text-primary p-1.5 rounded-xl transition-colors hover:bg-stone-500/10"
                aria-label="Tutup modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
