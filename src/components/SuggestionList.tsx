import React from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { TypographySettings, VerbSuggestionItem } from '../types/tashrif';

interface SuggestionListProps {
  suggestions: VerbSuggestionItem[];
  query: string;
  onSelect: (item: VerbSuggestionItem) => void;
  isLoading?: boolean;
  typographySettings?: TypographySettings;
}

export const SuggestionList: React.FC<SuggestionListProps> = ({
  suggestions,
  query,
  onSelect,
  isLoading = false,
  typographySettings,
}) => {
  const fontChoiceClass =
    typographySettings?.fontFamily === 'noto'
      ? 'font-arabic-noto'
      : typographySettings?.fontFamily === 'amiri'
      ? 'font-arabic-amiri'
      : typographySettings?.fontFamily === 'scheherazade'
      ? 'font-arabic-scheherazade'
      : 'font-arabic';

  const scaleClass =
    typographySettings?.scale === 'sm'
      ? 'text-xl'
      : typographySettings?.scale === 'lg'
      ? 'text-3xl'
      : typographySettings?.scale === 'xl'
      ? 'text-4xl'
      : 'text-2xl';

  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-2xl shadow-lg border-2 border-[#b5d8cd] p-4 text-center">
        <p className="text-sm text-[#386357] animate-pulse flex items-center justify-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#1f705e] animate-ping" />
          Mencari saran verba Arab untuk &ldquo;{query}&rdquo;...
        </p>
      </div>
    );
  }

  if (suggestions.length === 0) {
    if (!query.trim()) return null;
    return (
      <div className="w-full bg-white rounded-2xl shadow-lg border-2 border-[#b5d8cd] p-5 text-center">
        <p className="text-sm text-[#2b5449]">
          Tidak ditemukan saran untuk &ldquo;<span className="font-bold text-[#1f705e]">{query}</span>&rdquo;.
        </p>
        <p className="text-xs text-[#5f8f82] mt-1.5">
          Coba ketik kata dalam huruf Arab (كتب, جلس) atau ketik transliterasi / arti Indonesia (kataba, menulis, jalasa, duduk).
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl border-2 border-[#a8cfc2] overflow-hidden transition-all">
      <div className="px-4 py-2.5 bg-[#eaf4f0] border-b border-[#cde2da] flex items-center justify-between text-xs text-[#2b5449]">
        <span className="flex items-center gap-1.5 font-semibold text-[#1f705e]">
          <Sparkles className="w-3.5 h-3.5 text-[#1f705e]" />
          Daftar Saran Verba ({suggestions.length})
        </span>
        <span className="text-[11px] text-[#4f7f72]">
          Pilih salah satu untuk memuat tabel konjugasi
        </span>
      </div>

      <div className="divide-y divide-[#e5f0ec] max-h-80 overflow-y-auto">
        {suggestions.map((item, index) => (
          <button
            key={`${item.verb}-${index}`}
            type="button"
            onClick={() => onSelect(item)}
            className="w-full px-4 py-3 text-right flex items-center justify-between hover:bg-[#eef7f3] active:bg-[#d8ece4] transition-colors group cursor-pointer"
          >
            {/* Left side: Tag & Meaning */}
            <div className="flex items-center gap-2.5 text-left">
              <span
                className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-medium transition-colors shrink-0 ${
                  item.source === 'dictionary'
                    ? 'bg-[#e3efe9] text-[#1a332d] group-hover:bg-[#1f705e] group-hover:text-white'
                    : item.source === 'qutrub'
                    ? 'bg-[#d2eade] text-[#125343] font-semibold group-hover:bg-[#125343] group-hover:text-white'
                    : 'bg-[#e4ebf3] text-[#2b415a] group-hover:bg-[#2b415a] group-hover:text-white'
                }`}
              >
                {item.source === 'dictionary' ? 'Kamus' : item.source === 'qutrub' ? 'Qutrub' : 'Tashrif'}
              </span>

              {(item.meaningId || item.transliteration || item.bab || (item.relatedWords && item.relatedWords.length > 0)) && (
                <div className="flex flex-col">
                  {item.meaningId && (
                    <span className="text-xs font-semibold text-[#1a332d] group-hover:text-[#1f705e] transition-colors">
                      {item.meaningId}
                    </span>
                  )}

                  {(item.transliteration || item.bab || item.futureType) && (
                    <span className="text-[11px] text-[#639285] font-sans">
                      {item.transliteration}
                      {item.bab && (item.transliteration ? ` • ${item.bab}` : item.bab)}
                      {item.futureType && ` • Harakat 'Ain: ${item.futureType}`}
                    </span>
                  )}

                  {item.relatedWords && item.relatedWords.length > 0 && (
                    <div className="mt-1 flex flex-wrap justify-end gap-1">
                      {item.relatedWords.slice(0, 3).map((word, wordIndex) => (
                        <span
                          key={`${item.verb}-${word}-${wordIndex}`}
                          className="px-1.5 py-0.5 rounded-full bg-[#edf7f3] text-[10px] font-medium text-[#2b5449] border border-[#d9eae4]"
                        >
                          {word}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right side: Arabic Verb with dynamic scale and font */}
            <div className="flex items-center gap-3">
              <span
                className={`${scaleClass} ${fontChoiceClass} text-[#1a332d] group-hover:text-[#1f705e] font-bold tracking-wide transition-all`}
                dir="rtl"
              >
                {item.verb}
              </span>
              <span className="w-4 h-4 text-[#7ea99c] group-hover:text-[#1f705e] group-hover:-translate-x-1 transition-all shrink-0 flex items-center justify-center">
                <ArrowLeft className="w-4 h-4" />
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
