import React from 'react';
import {
  TypographySettings,
  TextScale,
  ArabicFontFamily,
} from '../types/tashrif';
import {
  Type,
  ZoomIn,
  ZoomOut,
  Palette,
  Sparkles,
  ArrowLeftRight,
  RotateCcw,
} from 'lucide-react';

interface TypographyBarProps {
  settings: TypographySettings;
  onChange: (newSettings: TypographySettings) => void;
  coloredHarakat?: boolean;
  onToggleColoredHarakat?: () => void;
  onReset?: () => void;
  className?: string;
}

const SCALE_OPTIONS: { id: TextScale; label: string; desc: string }[] = [
  { id: 'sm', label: 'A-', desc: 'Kecil (88%)' },
  { id: 'md', label: 'A', desc: 'Normal (100%)' },
  { id: 'lg', label: 'A+', desc: 'Besar (118%)' },
  { id: 'xl', label: 'A++', desc: 'Sangat Besar (138%)' },
];

const FONT_OPTIONS: { id: ArabicFontFamily; name: string; sample: string }[] = [
  { id: 'noto', name: 'Noto Naskh', sample: 'نَسْخ' },
  { id: 'amiri', name: 'Amiri', sample: 'أَمِيرِي' },
  { id: 'scheherazade', name: 'Scheherazade', sample: 'شَهْرَزَاد' },
];

export const TypographyBar: React.FC<TypographyBarProps> = ({
  settings,
  onChange,
  coloredHarakat,
  onToggleColoredHarakat,
  onReset,
  className = '',
}) => {
  const isColoredHarakat =
    coloredHarakat !== undefined ? coloredHarakat : settings.coloredHarakat;

  const handleScaleChange = (scale: TextScale) => {
    onChange({ ...settings, scale });
  };

  const handleFontChange = (fontFamily: ArabicFontFamily) => {
    onChange({ ...settings, fontFamily });
  };

  const toggleHarakat = () => {
    if (onToggleColoredHarakat) {
      onToggleColoredHarakat();
    } else {
      onChange({ ...settings, coloredHarakat: !settings.coloredHarakat });
    }
  };

  const toggleAutoDirection = () => {
    onChange({ ...settings, autoDirection: !settings.autoDirection });
  };

  return (
    <div
      id="typography-bar-container"
      className={`bg-white/95 backdrop-blur-xs rounded-2xl sm:rounded-3xl border-2 border-[#b5d8cd] p-3.5 sm:p-4 shadow-sm flex flex-col gap-3.5 w-full ${className}`}
    >
      {/* Top-level Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
        <div className="flex items-center gap-2 text-[#1f705e] font-bold text-xs tracking-wider uppercase">
          <div className="p-1 rounded-lg bg-[#eaf4f0] text-[#1f705e] border border-[#cbe3da]">
            <Type className="w-3.5 h-3.5" />
          </div>
          <span>Pengaturan Tulisan Fleksibel</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-[11px] text-[#4f7f72] font-medium hidden sm:inline">
            Ukuran, Gaya Huruf, Warna &amp; Arah Teks
          </span>
          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="px-2.5 py-1 text-xs font-semibold flex items-center gap-1.5 rounded-lg text-[#3d695d] hover:text-rose-700 bg-[#f0f7f4] hover:bg-rose-50 border border-[#cbe3da] hover:border-rose-300 shadow-2xs transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer"
              title="Reset pilihan verba & kosongkan tabel konjugasi"
              aria-label="Reset pilihan verba dan konjugasi"
            >
              <RotateCcw className="w-3 h-3 text-[#416e62]" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Control Groups Row with Center Alignment on Mobile, Flexible Row on Tablet & Desktop */}
      <div className="flex flex-wrap items-center justify-center md:justify-between gap-x-6 gap-y-4 pt-0.5 w-full">
        {/* 1. Scale Group (Ukuran) */}
        <div className="flex items-center gap-2 bg-[#f0f7f4] p-2 sm:p-2.5 rounded-2xl border border-[#cbe3da] md:border-r md:border-r-slate-200 md:pr-6 shrink-0 transition-all duration-200 hover:scale-[1.02]">
          <span className="text-[11px] text-[#3d695d] font-semibold px-1 whitespace-nowrap shrink-0">
            Ukuran:
          </span>
          <div className="flex items-center gap-1 shrink-0">
            {SCALE_OPTIONS.map((item) => {
              const isActive = settings.scale === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleScaleChange(item.id)}
                  title={`Ukuran tulisan: ${item.desc}`}
                  className={`px-3 py-1.5 sm:px-2.5 sm:py-1 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                    isActive
                      ? 'bg-[#1f705e] text-white shadow-xs'
                      : 'text-[#2a5448] hover:text-[#1a332d] hover:bg-white/80'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Font Group (Gaya Huruf) */}
        <div className="flex items-center gap-2 bg-[#f0f7f4] p-2 sm:p-2.5 rounded-2xl border border-[#cbe3da] md:border-r md:border-r-slate-200 md:pr-6 shrink-0 transition-all duration-200 hover:scale-[1.02]">
          <span className="text-[11px] text-[#3d695d] font-semibold px-1 whitespace-nowrap shrink-0">
            Gaya Huruf:
          </span>
          <div className="flex items-center gap-1 shrink-0">
            {FONT_OPTIONS.map((f) => {
              const isActive = settings.fontFamily === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => handleFontChange(f.id)}
                  title={`Ganti jenis huruf ke ${f.name}`}
                  className={`px-3 py-1.5 sm:px-2.5 sm:py-1 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap active:scale-95 ${
                    isActive
                      ? 'bg-[#1f705e] text-white shadow-xs font-semibold'
                      : 'text-[#2a5448] hover:text-[#1a332d] hover:bg-white/80'
                  }`}
                >
                  <span
                    className={`font-arabic text-sm leading-none ${
                      f.id === 'noto'
                        ? 'font-arabic-noto'
                        : f.id === 'amiri'
                        ? 'font-arabic-amiri'
                        : 'font-arabic-scheherazade'
                    }`}
                    dir="rtl"
                  >
                    {f.sample}
                  </span>
                  <span className="text-[11px] hidden sm:inline whitespace-nowrap">{f.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Harakat Toggle (Warna) */}
        <div className="md:border-r md:border-r-slate-200 md:pr-6 shrink-0">
          <button
            type="button"
            onClick={toggleHarakat}
            className={`px-3.5 py-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-medium flex items-center gap-2 transition-all duration-200 hover:scale-[1.02] cursor-pointer border shrink-0 whitespace-nowrap active:scale-95 ${
              isColoredHarakat
                ? 'bg-[#fef2f2] border-rose-300 text-rose-700 font-semibold ring-2 ring-rose-200/70 shadow-2xs'
                : 'bg-[#f4faf7] border-[#b5d8cd] text-[#2c5449] hover:bg-[#eaf4f0]'
            }`}
            title="Beralih antara harakat merah (kontras tinggi) atau harakat warna standar gelap"
          >
            <Palette className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                isColoredHarakat ? 'bg-rose-500' : 'bg-slate-400'
              }`}
            />
            <span className="inline whitespace-nowrap">Warna Harakat:</span>
            <span className={isColoredHarakat ? 'text-rose-700 font-bold' : 'text-slate-700'}>
              {isColoredHarakat ? 'Merah' : 'Standar'}
            </span>
          </button>
        </div>

        {/* 4. Direction Toggle (Arah Teks) */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={toggleAutoDirection}
            className={`px-3.5 py-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all duration-200 hover:scale-[1.02] cursor-pointer border shrink-0 whitespace-nowrap active:scale-95 ${
              settings.autoDirection
                ? 'bg-[#eaf4f0] text-[#1f705e] border-[#b5d8cd]'
                : 'bg-[#f4faf7] text-[#55867a] border-[#cde2da]'
            }`}
            title="Arah tulisan menyesuaikan otomatis antara teks Latin (Kiri ke Kanan) dan Arab (Kanan ke Kiri)"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 shrink-0" />
            <span className="inline whitespace-nowrap">Arah Teks:</span>
            <span className="font-semibold">{settings.autoDirection ? 'Otomatis' : 'Manual'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
