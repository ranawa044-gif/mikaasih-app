import React, { useState } from 'react';
import { Modal } from './Modal';

interface PartnerInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitLinkOrCode: (input: string) => void;
}

export const PartnerInputModal: React.FC<PartnerInputModalProps> = ({
  isOpen,
  onClose,
  onSubmitLinkOrCode,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleProcess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) {
      setErrorMsg('Tautan atau kode tidak boleh kosong.');
      return;
    }
    setErrorMsg(null);
    onSubmitLinkOrCode(inputValue.trim());
    setInputValue('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Masukkan Tautan Pasangan">
      <form onSubmit={handleProcess} className="space-y-4">
        <div>
          <label className="block text-xs font-medium theme-text-muted mb-2">
            Tempel tautan atau parameter hasil pasanganmu:
          </label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              if (errorMsg) setErrorMsg(null);
            }}
            placeholder="Contoh: https://mikaasih.cyou/?n=Alex&s=W9-Q8-G2-S6-T5"
            className="theme-input w-full px-4 py-3 rounded-2xl text-sm placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-rose-400 transition-all font-mono"
            autoComplete="off"
            spellCheck={false}
          />
          {errorMsg && <p className="text-xs text-rose-500 mt-2">{errorMsg}</p>}
        </div>
        <div className="flex gap-3 justify-end pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl theme-box theme-text-muted text-sm font-medium hover:text-stone-200 transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl text-white text-sm font-medium transition-opacity hover:opacity-90 shadow-sm"
            style={{ background: 'var(--primary-btn-bg)' }}
          >
            Bandingkan
          </button>
        </div>
      </form>
    </Modal>
  );
};
