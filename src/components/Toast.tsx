import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ToastState } from '../hooks/useToast';

interface ToastProps {
  toast: ToastState | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  return (
    <div className="fixed top-5 inset-x-0 z-50 flex justify-center pointer-events-none px-4">
      <AnimatePresence mode="wait">
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 360, damping: 28 }}
            onClick={onClose}
            className={`
              pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl
              shadow-xl border text-xs font-medium font-sans cursor-pointer max-w-sm w-full
              ${toast.type === 'success'
                ? 'bg-stone-900 text-white border-stone-700'
                : toast.type === 'error'
                ? 'bg-rose-900 text-white border-rose-700'
                : 'bg-white text-stone-800 border-stone-200'}
            `}
            style={{ backdropFilter: 'blur(12px)' }}
          >
            {toast.type === 'success' && (
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">✓</span>
            )}
            {toast.type === 'error' && (
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-300">⚠</span>
            )}
            {toast.type === 'info' && (
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400">ℹ</span>
            )}
            <span className="flex-1">{toast.message}</span>
            <span className="flex-shrink-0 opacity-50 text-[10px]">tap to dismiss</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
