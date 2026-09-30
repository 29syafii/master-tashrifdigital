import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  Keyboard,
  Loader2,
  ArrowLeftRight,
  Sparkles,
} from 'lucide-react';
import { TypographySettings } from '../types/tashrif';

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  onSelectSuggestion?: (verb: string) => void;
  onSearchSubmit?: (verb: string) => void;
  isLoadingSuggestions?: boolean;
  placeholder?: string;
  typographySettings?: TypographySettings;
}

// Arabic virtual character buttons for users on non-Arabic keyboards
const ARABIC_QUICK_KEYS = [
  { char: 'َ', label: 'َ (فتحة)', title: 'Fathah' },
  { char: 'ُ', label: 'ُ (ضمة)', title: 'Dhammah' },
  { char: 'ِ', label: 'ِ (كسرة)', title: 'Kasrah' },
  { char: 'ْ', label: 'ْ (سكون)', title: 'Sukun' },
  { char: 'ّ', label: 'ّ (شدة)', title: 'Shaddah' },
  { char: 'ً', label: 'ً (تنوين فتح)', title: 'Tanwin Fathah' },
  { char: 'ٌ', label: 'ٌ (تنوين ضم)', title: 'Tanwin Dhammah' },
  { char: 'ٍ', label: 'ٍ (تنوين كسر)', title: 'Tanwin Kasrah' },
  { char: 'أ', label: 'أ', title: 'Alif Hamzah Atas' },
  { char: 'إ', label: 'إ', title: 'Alif Hamzah Bawah' },
  { char: 'آ', label: 'آ', title: 'Alif Maddah' },
  { char: 'ء', label: 'ء', title: 'Hamzah' },
  { char: 'ى', label: 'ى', title: 'Alif Maqshurah' },
  { char: 'ة', label: 'ة', title: 'Ta Marbuthah' },
];

export const SearchBox: React.FC<SearchBoxProps> = ({
  value,
  onChange,
  onSearchSubmit,
  isLoadingSuggestions = false,
  placeholder,
  typographySettings,
}) => {
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [manualDirection, setManualDirection] = useState<'auto' | 'rtl' | 'ltr'>('auto');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Determine whether current value contains Arabic characters
  const containsArabic = /[\u0600-\u06FF]/.test(value);

  // Flexible direction logic:
  // - If empty: use 'ltr' to guarantee the placeholder renders without reversed parentheses or BiDi glitches!
  // - If typing Arabic: automatically use 'rtl'
  // - If typing Latin: automatically use 'ltr'
  // - If manualDirection is forced, respect it
  const currentDirection: 'rtl' | 'ltr' =
    manualDirection === 'rtl'
      ? 'rtl'
      : manualDirection === 'ltr'
      ? 'ltr'
      : value.trim().length === 0
      ? 'ltr'
      : containsArabic
      ? 'rtl'
      : 'ltr';

  const isRTL = currentDirection === 'rtl';

  const defaultPlaceholder =
    'Ketik verba Arab atau Latin (misal: كتب, kataba, menulis)...';

  const effectivePlaceholder = placeholder || defaultPlaceholder;

  // Font family class based on settings
  const fontChoiceClass =
    typographySettings?.fontFamily === 'noto'
      ? 'font-arabic-noto'
      : typographySettings?.fontFamily === 'amiri'
      ? 'font-arabic-amiri'
      : typographySettings?.fontFamily === 'scheherazade'
      ? 'font-arabic-scheherazade'
      : 'font-arabic';

  // Font size class based on scale settings
  const scaleClass =
    typographySettings?.scale === 'sm'
      ? 'text-lg sm:text-xl'
      : typographySettings?.scale === 'lg'
      ? 'text-2xl sm:text-3xl'
      : typographySettings?.scale === 'xl'
      ? 'text-3xl sm:text-4xl'
      : 'text-xl sm:text-2xl';

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  const handleInsertChar = (char: string) => {
    const input = inputRef.current;
    if (!input) {
      onChange(value + char);
      return;
    }

    const start = input.selectionStart ?? value.length;
    const end = input.selectionEnd ?? value.length;
    const newValue = value.substring(0, start) + char + value.substring(end);
    onChange(newValue);

    setTimeout(() => {
      input.focus();
      input.setSelectionRange(start + char.length, start + char.length);
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (onSearchSubmit && value.trim()) {
        onSearchSubmit(value.trim());
      }
    }
  };

  const toggleDirection = () => {
    if (manualDirection === 'auto') {
      setManualDirection(isRTL ? 'ltr' : 'rtl');
    } else if (manualDirection === 'rtl') {
      setManualDirection('ltr');
    } else {
      setManualDirection('auto');
    }
    inputRef.current?.focus();
  };

  return (
    <div className="w-full relative">
      <div
        className={`relative flex items-center bg-white rounded-2xl shadow-sm border-2 border-[#9ec4b9] focus-within:border-[#1f705e] focus-within:ring-4 focus-within:ring-[#1f705e]/20 transition-all ${
          isRTL ? 'flex-row' : 'flex-row'
        }`}
      >
        {/* Left icon: Search or loading spinner */}
        <div className="pl-4 pr-2 flex items-center shrink-0">
          {isLoadingSuggestions ? (
            <Loader2 className="w-5 h-5 text-[#1f705e] animate-spin" />
          ) : (
            <Search className="w-5 h-5 text-[#4a7c6f]" />
          )}
        </div>

        {/* Flexible Input box */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          dir={currentDirection}
          placeholder={effectivePlaceholder}
          className={`w-full py-3.5 px-3 ${scaleClass} ${
            isRTL ? `${fontChoiceClass} text-right font-bold` : 'font-sans text-left'
          } text-[#1a332d] placeholder:text-[#7ba69a] placeholder:text-sm sm:placeholder:text-base placeholder:font-sans placeholder:normal-case focus:outline-none bg-transparent transition-all`}
          autoComplete="off"
          spellCheck="false"
        />

        {/* Action buttons (Clear, Direction switch, & Virtual Keyboard Toggle) */}
        <div className="flex items-center gap-1.5 pr-3 pl-2 shrink-0">
          {/* Clear button */}
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 text-[#5d8a7e] hover:text-[#1a332d] hover:bg-[#e4efe9] rounded-lg transition-colors cursor-pointer"
              title="Hapus teks pencarian"
              aria-label="Hapus teks"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Flexible Direction Toggle (LTR/RTL) */}
          <button
            type="button"
            onClick={toggleDirection}
            className={`px-2 py-1 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer border ${
              manualDirection !== 'auto'
                ? 'bg-[#1f705e] text-white border-[#1f705e]'
                : 'bg-[#f0f7f4] text-[#48786b] border-[#c4e0d7] hover:bg-[#e4efe9]'
            }`}
            title={`Arah teks saat ini: ${currentDirection.toUpperCase()} (${
              manualDirection === 'auto' ? 'Otomatis Fleksibel' : 'Manual Dikunci'
            }). Klik untuk beralih.`}
          >
            <span className="flex items-center gap-1">
              <ArrowLeftRight className="w-3 h-3" />
              <span>{currentDirection.toUpperCase()}</span>
            </span>
          </button>

          {/* Virtual Harakat / Character Keyboard button */}
          <button
            type="button"
            onClick={() => setShowKeyboard(!showKeyboard)}
            className={`px-2.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 text-xs font-medium cursor-pointer ${
              showKeyboard
                ? 'bg-[#1f705e] text-white shadow-xs'
                : 'bg-[#e7f3ee] text-[#1f705e] hover:bg-[#1f705e] hover:text-white'
            }`}
            title="Buka papan bantu karakter & harakat Arab untuk mengetik (bukan pengaturan warna)"
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-sans">Papan Karakter</span>
          </button>
        </div>
      </div>

      {/* Quick Harakat / Arabic Character Toolbar */}
      {showKeyboard && (
        <div className="mt-2.5 p-3 bg-white/95 backdrop-blur-sm border-2 border-[#b5d8cd] rounded-2xl shadow-md animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-semibold text-[#1f705e] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Papan Bantu Karakter &amp; Harakat Arab untuk Mengetik</span>
            </span>
            <span className="text-[11px] text-[#55867a]">
              Klik tombol untuk menyisipkan karakter ke kolom input
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {ARABIC_QUICK_KEYS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleInsertChar(item.char)}
                title={item.title}
                className="px-2.5 py-1 text-lg font-arabic bg-[#f2f8f5] hover:bg-[#1f705e] hover:text-white active:scale-95 text-[#1a332d] border border-[#c1ded4] rounded-xl shadow-2xs transition-all cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
