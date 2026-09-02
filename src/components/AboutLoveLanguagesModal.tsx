// =====================================================
// MIKAASIH — AboutLoveLanguagesModal
// Penjelasan edukatif 5 Bahasa Cinta (The 5 Love Languages)
// 100% Dynamic Theme Integration (Light & Dark)
// =====================================================

import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import type { DimensionKey } from '../engine/types';

export interface AboutLoveLanguagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDimensionKey?: DimensionKey | 'all' | null;
}

interface LoveLanguageDetail {
  key: DimensionKey;
  icon: string;
  nameEn: string;
  nameId: string;
  color: string;
  summary: string;
  desc: string;
  examples: string[];
}

const LOVE_LANGUAGES_DATA: LoveLanguageDetail[] = [
  {
    key: 'W',
    icon: '💬',
    nameEn: 'Words of Affirmation',
    nameId: 'Kata Pujian',
    color: '#F59E0B',
    summary: 'Apresiasi verbal, pujian tulus, dan kata-kata penenang.',
    desc: 'Bagi pemilik bahasa kasih ini, kata-kata memiliki bobot emosional yang sangat mendalam. Pujian tulus, ucapan terima kasih atas usaha kecil, dan pengakuan verbal memberikan rasa dihargai dan aman.',
    examples: [
      'Memberikan pujian spesifik: "Aku bangga banget sama caramu menyelesaikan masalah tadi."',
      'Mengirimkan pesan singkat penyemangat di sela kesibukan hari.',
      'Mengucapkan terima kasih dengan tulus atas inisiatif pasangan.',
    ],
  },
  {
    key: 'Q',
    icon: '⏳',
    nameEn: 'Quality Time',
    nameId: 'Waktu Bersama',
    color: '#14B8A6',
    summary: 'Kehadiran utuh, obrolan mendalam, dan momen berdua.',
    desc: 'Bukan sekadar berada di ruangan yang sama, melainkan memberikan perhatian penuh (undivided attention) tanpa teralihkan gawai, kesibukan, atau obrolan setengah hati.',
    examples: [
      'Menyediakan waktu 20 menit tiap malam untuk berbincang tanpa memegang ponsel.',
      'Melakukan aktivitas atau hobi baru bersama di akhir pekan.',
      'Menjaga kontak mata dan mendengarkan aktif saat pasangan bercerita.',
    ],
  },
  {
    key: 'G',
    icon: '🎁',
    nameEn: 'Receiving Gifts',
    nameId: 'Pemberian Hadiah',
    color: '#FBBF24',
    summary: 'Simbol visual kasih sayang dan buah pemikiran tulus.',
    desc: 'Bagi penerima hadiah, yang berharga bukanlah label harga melainkan niat, usaha, dan fakta bahwa kamu mengingat mereka saat melihat benda tersebut.',
    examples: [
      'Membawakan camilan favoritnya sepulang kantor karena teringat padanya.',
      'Menyimpan catatan kecil tentang hal-hal yang pernah ia sukai untuk kejutan nanti.',
      'Memberikan hadiah buatan tangan atau disertai kartu ucapan bertuliskan tangan.',
    ],
  },
  {
    key: 'S',
    icon: '🤝',
    nameEn: 'Acts of Service',
    nameId: 'Tindakan Nyata',
    color: '#A8A29E',
    summary: 'Aksi nyata yang meringankan beban dan tanggung jawab.',
    desc: 'Tindakan berbicara lebih keras daripada kata-kata. Mengambil inisiatif membantu tanpa diminta adalah bukti cinta paling nyata yang menenangkan hatinya.',
    examples: [
      'Menyiapkan sarapan atau minuman hangat saat pasangan sedang terburu-buru/lelah.',
      'Membantu menyelesaikan tugas rumah tangga yang sedang menumpuk.',
      'Menepati janji bantuan secara sigap tanpa perlu diingatkan berulang kali.',
    ],
  },
  {
    key: 'T',
    icon: '🤍',
    nameEn: 'Physical Touch',
    nameId: 'Sentuhan Fisik',
    color: '#FB7185',
    summary: 'Sentuhan lembut, pelukan hangat, dan rasa aman fisik.',
    desc: 'Kontak fisik non-verbal mengomunikasikan kehangatan, perlindungan, dan penerimaan emosional yang tidak bisa digantikan oleh ribuan kata.',
    examples: [
      'Memberikan pelukan hangat saat menyambut pasangan pulang.',
      'Menggenggam tangannya saat berjalan bersama atau saat ia sedang cemas.',
      'Usapan lembut di punggung atau bahu sebagai bentuk dukungan moril.',
    ],
  },
];

export const AboutLoveLanguagesModal: React.FC<AboutLoveLanguagesModalProps> = ({
  isOpen,
  onClose,
  selectedDimensionKey = 'all',
}) => {
  const [activeKey, setActiveKey] = useState<DimensionKey | 'all'>(selectedDimensionKey ?? 'all');

  // Sinkronkan state saat props berubah
  useEffect(() => {
    if (isOpen) {
      setActiveKey(selectedDimensionKey ?? 'all');
    }
  }, [isOpen, selectedDimensionKey]);

  const focusedItem = LOVE_LANGUAGES_DATA.find((item) => item.key === activeKey);

  const getTitle = () => {
    if (activeKey === 'all' || !focusedItem) return 'Mengenal 5 Bahasa Kasih';
    return `${focusedItem.icon} ${focusedItem.nameEn}`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getTitle()}>
      <div className="space-y-4 max-h-[68vh] overflow-y-auto pr-1 scrollbar-none">

        {/* ── Switcher Tabs ── */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveKey('all')}
            className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap flex-shrink-0"
            style={{
              background: activeKey === 'all' ? '#E11D48' : 'var(--box-bg)',
              color: activeKey === 'all' ? '#FFFFFF' : 'var(--text-muted)',
              border: activeKey === 'all' ? '1px solid #E11D48' : '1px solid var(--box-border)',
            }}
          >
            🌐 Semua (5)
          </button>
          {LOVE_LANGUAGES_DATA.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setActiveKey(item.key)}
              className="px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap flex-shrink-0 flex items-center gap-1"
              style={{
                background: activeKey === item.key ? item.color : 'var(--box-bg)',
                color: activeKey === item.key ? '#FFFFFF' : 'var(--text-muted)',
                border: activeKey === item.key ? `1px solid ${item.color}` : '1px solid var(--box-border)',
              }}
            >
              <span>{item.icon}</span>
              <span>{item.nameId}</span>
            </button>
          ))}
        </div>

        {/* ── VIEW 1: FOCUSED SINGLE DIMENSION ── */}
        {activeKey !== 'all' && focusedItem && (
          <div className="space-y-3.5">
            <div
              className="theme-box p-4 rounded-2xl space-y-2.5"
              style={{
                borderColor: `${focusedItem.color}50`,
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-sm theme-text-primary">
                    {focusedItem.nameEn}
                  </h4>
                  <p className="text-xs font-medium" style={{ color: focusedItem.color }}>
                    Bahasa Indonesia: <strong>{focusedItem.nameId}</strong>
                  </p>
                </div>
                <span className="text-2xl">{focusedItem.icon}</span>
              </div>

              <p className="text-xs leading-relaxed theme-text-secondary">
                {focusedItem.desc}
              </p>
            </div>

            {/* Contoh Nyata */}
            <div className="theme-box p-4 rounded-2xl space-y-2">
              <p className="text-xs font-semibold theme-text-primary">
                ✨ Contoh Tindakan Bermakna:
              </p>
              <ul className="space-y-1.5">
                {focusedItem.examples.map((ex, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs leading-relaxed theme-text-secondary">
                    <span className="font-bold flex-shrink-0" style={{ color: focusedItem.color }}>•</span>
                    <span>{ex}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* ── VIEW 2: ALL 5 DIMENSIONS ── */}
        {activeKey === 'all' && (
          <div className="space-y-2.5">
            <p className="text-xs leading-relaxed theme-text-muted">
              Teori <strong>The 5 Love Languages</strong> oleh Dr. Gary Chapman (1992) menyatakan setiap orang memiliki cara khas dalam memberi dan menerima kasih:
            </p>

            {LOVE_LANGUAGES_DATA.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setActiveKey(item.key)}
                className="theme-box w-full text-left p-3.5 rounded-2xl transition-all hover:scale-[1.01] active:scale-[0.99] space-y-1 block"
                style={{
                  borderLeft: `4px solid ${item.color}`,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{item.icon}</span>
                    <span className="font-semibold text-xs theme-text-primary">{item.nameEn}</span>
                    <span className="text-[11px] font-medium" style={{ color: item.color }}>
                      ({item.nameId})
                    </span>
                  </div>
                  <span className="text-[10px] theme-text-subtle">Rincian →</span>
                </div>
                <p className="text-[11.5px] leading-relaxed theme-text-secondary pl-6">
                  {item.summary}
                </p>
              </button>
            ))}
          </div>
        )}

        {/* ── Footer Actions ── */}
        <div
          className="pt-2 border-t flex items-center justify-between"
          style={{ borderColor: 'var(--box-border)' }}
        >
          {activeKey !== 'all' ? (
            <button
              type="button"
              onClick={() => setActiveKey('all')}
              className="text-xs font-medium theme-text-muted hover:theme-text-primary underline underline-offset-4"
            >
              ← Lihat Semua 5 Dimensi
            </button>
          ) : (
            <span className="text-[10px] theme-text-subtle">Model Psikometri Chapman</span>
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white transition-opacity hover:opacity-90 ml-auto shadow-sm"
            style={{ background: 'linear-gradient(135deg, #E11D48, #BE123C)' }}
          >
            Tutup
          </button>
        </div>

      </div>
    </Modal>
  );
};
