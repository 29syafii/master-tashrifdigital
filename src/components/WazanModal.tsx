import React, { useEffect } from 'react';
import { CATEGORY_INFO, CategoryMetadata, TypographySettings } from '../types/tashrif';
import {
  X,
  BookOpen,
  Sparkles,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Bookmark,
  Layers,
} from 'lucide-react';

interface WazanModalProps {
  categoryKey: string | null;
  onClose: () => void;
  onSelectCategory?: (catKey: string) => void;
  typographySettings?: TypographySettings;
}

export const WazanModal: React.FC<WazanModalProps> = ({
  categoryKey,
  onClose,
  onSelectCategory,
  typographySettings,
}) => {
  // Listen for Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (categoryKey) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [categoryKey, onClose]);

  if (!categoryKey) return null;

  const meta = CATEGORY_INFO[categoryKey];
  const allCategories = Object.keys(CATEGORY_INFO);
  const currentIndex = allCategories.indexOf(categoryKey);

  const prevCategory =
    currentIndex > 0 ? allCategories[currentIndex - 1] : null;
  const nextCategory =
    currentIndex < allCategories.length - 1
      ? allCategories[currentIndex + 1]
      : null;

  const fontChoiceClass =
    typographySettings?.fontFamily === 'noto'
      ? 'font-arabic-noto'
      : typographySettings?.fontFamily === 'amiri'
      ? 'font-arabic-amiri'
      : typographySettings?.fontFamily === 'scheherazade'
      ? 'font-arabic-scheherazade'
      : 'font-arabic';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="wazan-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl border-2 border-[#9ec4b9] shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#1f705e] text-white p-5 sm:p-6 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/15 hover:bg-white/25 text-emerald-100 hover:text-white transition-colors cursor-pointer"
            aria-label="Tutup jendela penjelasan wazan"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-200 mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>SIGNIFIKANSI LINGUISTIK WAZAN</span>
          </div>

          <div className="flex items-start justify-between gap-4 mt-2">
            <div>
              <h3 id="wazan-modal-title" className="text-lg sm:text-xl font-bold text-white">
                {meta?.nameId || categoryKey}
              </h3>
              <p className="text-xs text-emerald-100/90 mt-0.5 leading-relaxed">
                {meta?.description}
              </p>
            </div>
            <div className="text-right shrink-0">
              <span
                className={`text-2xl sm:text-3xl ${fontChoiceClass} font-bold text-emerald-100`}
                dir="rtl"
              >
                {categoryKey}
              </span>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-white/20 text-xs">
            <span
              className={`px-2.5 py-0.5 rounded-full font-medium ${
                meta?.voice === 'active'
                  ? 'bg-emerald-500/30 text-emerald-100 border border-emerald-400/40'
                  : 'bg-amber-500/30 text-amber-100 border border-amber-400/40'
              }`}
            >
              {meta?.voice === 'active' ? 'Aktif (معلوم)' : 'Pasif (مجهول)'}
            </span>

            <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-emerald-100 border border-white/25 font-medium">
              {meta?.mood === 'past'
                ? 'Kala Lampau (Madhi)'
                : meta?.mood === 'imperative'
                ? 'Modus Perintah (Amr)'
                : 'Kala Berjalan/Akan Datang (Mudhari\')'}
            </span>

            {meta?.morphologicalFormula && (
              <span className="px-2.5 py-0.5 rounded-full bg-black/20 text-emerald-100 border border-white/15 font-arabic font-bold text-sm">
                Wazan: {meta.morphologicalFormula}
              </span>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs text-[#2a4d43] leading-relaxed">
          {/* 1. Signifikansi Linguistik & Gramatikal */}
          <div className="bg-[#f0f8f5] rounded-2xl p-4 border border-[#c4e0d7]">
            <h4 className="font-bold text-[#1f705e] text-xs flex items-center gap-1.5 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#1f705e]" />
              <span>Fungsi &amp; Signifikansi Gramatikal (Shorof &amp; Nahwu)</span>
            </h4>
            <p className="text-xs text-[#1a332d] leading-relaxed">
              {meta?.grammaticalSignificance || meta?.description}
            </p>
          </div>

          {/* 2. Status I'rab & Bina' */}
          {meta?.irabStatus && (
            <div className="bg-white rounded-2xl p-3.5 border border-[#cde2da] shadow-2xs">
              <span className="text-[11px] font-bold text-[#4e7d70] uppercase tracking-wider block mb-1">
                Status I&lsquo;rab / Mabni:
              </span>
              <p className="text-xs font-semibold text-[#1a332d]">
                {meta.irabStatus}
              </p>
            </div>
          )}

          {/* 3. Pemicu Sintaksis ('Amil) if any */}
          {meta?.syntacticTriggers && (
            <div className="bg-amber-50/70 rounded-2xl p-3.5 border border-amber-200">
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block mb-1">
                Pemicu Sintaksis (&lsquo;Amil Nawashib / Jawazim):
              </span>
              <p className="text-xs text-amber-950 font-medium">
                {meta.syntacticTriggers}
              </p>
            </div>
          )}

          {/* 4. Efek Semantis (Perubahan Makna) */}
          {meta?.semanticEffect && (
            <div className="bg-white rounded-2xl p-3.5 border border-[#cde2da] shadow-2xs">
              <span className="text-[11px] font-bold text-[#4e7d70] uppercase tracking-wider block mb-1">
                Efek Semantis &amp; Makna:
              </span>
              <p className="text-xs text-[#1a332d]">
                {meta.semanticEffect}
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer with Category Navigator */}
        <div className="p-3.5 sm:p-4 bg-[#eaf4f0] border-t border-[#cde2da] flex items-center justify-between gap-2 text-xs">
          {prevCategory ? (
            <button
              type="button"
              onClick={() => onSelectCategory && onSelectCategory(prevCategory)}
              className="px-3 py-1.5 rounded-xl bg-white border border-[#b5d8cd] text-[#2b5449] hover:bg-[#1f705e] hover:text-white transition-all flex items-center gap-1.5 font-medium cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sebelumnya:</span>
              <span className="font-arabic font-bold text-xs" dir="rtl">{prevCategory}</span>
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#1f705e] text-white hover:bg-[#165747] font-semibold transition-colors cursor-pointer shadow-xs"
          >
            Tutup
          </button>

          {nextCategory ? (
            <button
              type="button"
              onClick={() => onSelectCategory && onSelectCategory(nextCategory)}
              className="px-3 py-1.5 rounded-xl bg-white border border-[#b5d8cd] text-[#2b5449] hover:bg-[#1f705e] hover:text-white transition-all flex items-center gap-1.5 font-medium cursor-pointer"
            >
              <span className="hidden sm:inline">Berikutnya:</span>
              <span className="font-arabic font-bold text-xs" dir="rtl">{nextCategory}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
};
