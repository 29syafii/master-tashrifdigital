import React from 'react';
import { FutureType, TypographySettings } from '../types/tashrif';
import { Sparkles } from 'lucide-react';

interface QuickExampleVerb {
  verb: string;
  transliteration: string;
  meaning: string;
  futureType: FutureType;
  bab: string;
}

const SAMPLE_VERBS: QuickExampleVerb[] = [
  { verb: 'كَتَبَ', transliteration: 'Kataba', meaning: 'Menulis', futureType: 'ضمة', bab: 'Nasara (U)' },
  { verb: 'صَلَّى', transliteration: 'Shalla', meaning: 'Shalat / Berdoa', futureType: 'فتحة', bab: 'Bab Ta\'fil' },
  { verb: 'نَصَرَ', transliteration: 'Nashara', meaning: 'Menolong', futureType: 'ضمة', bab: 'Bab 1 (U)' },
  { verb: 'ضَرَبَ', transliteration: 'Dharaba', meaning: 'Memukul', futureType: 'كسرة', bab: 'Bab 2 (I)' },
  { verb: 'فَتَحَ', transliteration: 'Fataha', meaning: 'Membuka', futureType: 'فتحة', bab: 'Bab 3 (A)' },
  { verb: 'عَلِمَ', transliteration: '\'Alima', meaning: 'Mengetahui', futureType: 'فتحة', bab: 'Bab 4 (A)' },
  { verb: 'قَالَ', transliteration: 'Qaala', meaning: 'Berkata', futureType: 'ضمة', bab: 'Ajwaf Wawi' },
  { verb: 'وَعَدَ', transliteration: 'Wa\'ada', meaning: 'Berjanji', futureType: 'كسرة', bab: 'Mitsal Wawi' },
];

interface QuickExamplesProps {
  onSelectVerb: (verb: string, futureType?: FutureType) => void;
  disabled?: boolean;
  typographySettings?: TypographySettings;
}

export const QuickExamples: React.FC<QuickExamplesProps> = ({
  onSelectVerb,
  disabled = false,
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
      ? 'text-lg'
      : typographySettings?.scale === 'lg'
      ? 'text-2xl'
      : typographySettings?.scale === 'xl'
      ? 'text-3xl'
      : 'text-xl';

  return (
    <div className="w-full">
      <div className="flex items-center gap-1.5 text-xs font-medium text-[#2d584d] mb-2 px-1">
        <Sparkles className="w-3.5 h-3.5 text-[#1f705e]" />
        <span>Contoh verba populer untuk langsung dicoba:</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 w-full">
        {SAMPLE_VERBS.map((sample) => (
          <button
            key={sample.verb}
            type="button"
            disabled={disabled}
            onClick={() => onSelectVerb(sample.verb, sample.futureType)}
            className="group px-3 py-2 bg-white/90 hover:bg-[#1f705e] active:scale-95 border-2 border-[#b5d8cd] hover:border-[#1f705e] rounded-xl shadow-2xs transition-all flex items-center justify-between gap-2 cursor-pointer disabled:opacity-50 w-full"
            title={`${sample.transliteration} (${sample.meaning}) - Harakat: ${sample.futureType}`}
          >
            <span
              className={`${scaleClass} ${fontChoiceClass} font-bold text-[#1a332d] group-hover:text-white transition-colors shrink-0`}
              dir="rtl"
            >
              {sample.verb}
            </span>
            <div className="text-right text-[11px] leading-tight border-r border-[#c4e0d7] group-hover:border-white/40 pr-2 transition-colors flex-1 min-w-0">
              <div className="font-semibold text-[#254d42] group-hover:text-white truncate">
                {sample.meaning}
              </div>
              <div className="text-[10px] text-[#55867a] group-hover:text-emerald-100 flex items-center justify-end gap-1 truncate">
                <span>{sample.transliteration}</span>
                <span>•</span>
                <span>{sample.futureType}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
