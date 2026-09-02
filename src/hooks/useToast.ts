// =====================================================
// RASA APP — useToast Hook
// Toast notification system (success / error / info)
// Auto-dismiss setelah 2.5 detik
// =====================================================

import { useState, useCallback, useRef } from 'react';

export interface ToastState {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export function useToast() {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((
    message: string,
    type: ToastState['type'] = 'success',
    duration = 2500
  ) => {
    if (timerRef.current) clearTimeout(timerRef.current);

    setToast({ id: Date.now().toString(), type, message });

    timerRef.current = setTimeout(() => {
      setToast(null);
    }, duration);
  }, []);

  const dismissToast = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast(null);
  }, []);

  return { toast, showToast, dismissToast };
}
