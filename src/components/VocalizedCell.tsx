import React from 'react';
import { stripArabicDiacritics } from '../utils/arabicText';

interface VocalizedCellProps {
  text: string;
  coloredHarakat?: boolean;
  className?: string;
}

/**
 * Komponen rendering teks Arab dengan pewarnaan harokat merah yang presisi.
 * Menggunakan teknik dual-layer overlay bersambung untuk mempertahankan
 * keutuhan text shaping (sambungan kursif initial/medial/final) dan mencegah
 * pecahan huruf terpisah maupun lingkaran titik-titik (dotted circle).
 */
export const VocalizedCell: React.FC<VocalizedCellProps> = ({
  text,
  coloredHarakat = true,
  className = '',
}) => {
  if (!text || !text.trim()) {
    return <span className="text-slate-300 font-mono select-none">—</span>;
  }

  if (!coloredHarakat) {
    return (
      <span dir="rtl" className={`${className} text-slate-900 font-normal inline-block`}>
        {text}
      </span>
    );
  }

  const stripped = stripArabicDiacritics(text);

  return (
    <span
      dir="rtl"
      className="relative inline-block leading-normal"
    >
      {/* Background Layer: Teks lengkap berharakat berwarna merah */}
      <span
        aria-hidden="true"
        className={`${className} text-rose-600 font-normal select-none pointer-events-none block`}
      >
        {text}
      </span>

      {/* Foreground Layer: Huruf dasar tanpa harakat berwarna gelap bertumpuk presisi di atasnya */}
      <span
        className={`absolute inset-0 ${className} text-slate-900 font-normal pointer-events-none block`}
      >
        {stripped}
      </span>
    </span>
  );
};
