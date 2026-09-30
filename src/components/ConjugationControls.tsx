import React from 'react';
import { FutureType } from '../types/tashrif';
import { Sliders, RotateCcw } from 'lucide-react';

interface ConjugationControlsProps {
  futureType: FutureType;
  transitive: boolean;
  passive: boolean;
  onFutureTypeChange: (val: FutureType) => void;
  onTransitiveChange: (val: boolean) => void;
  onPassiveChange: (val: boolean) => void;
  onResetDefaults: () => void;
  disabled?: boolean;
}

const FUTURE_TYPE_OPTIONS: { value: FutureType; label: string; arabLabel: string; example: string }[] = [
  { value: 'فتحة', label: 'Fathah (a)', arabLabel: 'فَتْحَة', example: 'يَفْعَلُ' },
  { value: 'ضمة', label: 'Dhammah (u)', arabLabel: 'ضَمَّة', example: 'يَفْعُلُ' },
  { value: 'كسرة', label: 'Kasrah (i)', arabLabel: 'كَسْرَة', example: 'يَفْعِلُ' },
];

export const ConjugationControls: React.FC<ConjugationControlsProps> = ({
  futureType,
  transitive,
  passive,
  onFutureTypeChange,
  onTransitiveChange,
  onPassiveChange,
  onResetDefaults,
  disabled = false,
}) => {
  return (
    <div className="bg-white/95 backdrop-blur-xs rounded-2xl border-2 border-[#b5d8cd] p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-[#ddede7]">
        <div className="flex items-center gap-2 text-xs font-bold text-[#1f705e]">
          <div className="w-5 h-5 rounded-md bg-[#1f705e] text-white flex items-center justify-center">
            <Sliders className="w-3 h-3" />
          </div>
          <span>PENGATURAN PARAMETER KONJUGASI</span>
        </div>
        <button
          type="button"
          onClick={onResetDefaults}
          disabled={disabled}
          className="text-xs text-[#416e62] hover:text-[#1f705e] flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer font-medium px-2 py-1 rounded-lg hover:bg-[#eaf4f0]"
          title="Kembalikan ke parameter bawaan (Default)"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Default</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Future Type (Harakat 'Ain Fi'il Mudhari') */}
        <div className="md:col-span-7 flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#295247] flex items-center justify-between">
            <span>Harakat &lsquo;Ain Fi&lsquo;il Mudhari&lsquo; (future_type):</span>
          </label>
          <div className="grid grid-cols-3 gap-2 bg-[#eaf4f0] p-1.5 rounded-xl border border-[#c4e0d7]">
            {FUTURE_TYPE_OPTIONS.map((opt) => {
              const isSelected = futureType === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  disabled={disabled}
                  onClick={() => onFutureTypeChange(opt.value)}
                  className={`py-1.5 px-2.5 rounded-lg text-xs font-medium transition-all text-center flex flex-col items-center justify-center cursor-pointer ${
                    isSelected
                      ? 'bg-[#1f705e] text-white shadow-xs font-semibold'
                      : 'text-[#2a5448] hover:text-[#1a332d] hover:bg-white/80'
                  } disabled:opacity-50`}
                >
                  <span className="font-arabic text-base font-bold">{opt.arabLabel}</span>
                  <span className={`text-[10px] ${isSelected ? 'text-emerald-100' : 'text-[#58887b]'}`}>
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Transitive & Passive checkboxes */}
        <div className="md:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 md:pt-4 w-full">
          <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs text-[#20443a] font-semibold bg-[#f2f8f5] hover:bg-[#e4efe9] px-3 py-2 rounded-xl border border-[#c8e2da] transition-colors w-full">
            <input
              type="checkbox"
              checked={transitive}
              onChange={(e) => onTransitiveChange(e.target.checked)}
              disabled={disabled}
              className="w-4 h-4 text-[#1f705e] accent-[#1f705e] rounded border-[#a4cabe] focus:ring-[#1f705e] cursor-pointer shrink-0"
            />
            <div className="min-w-0 flex-1">
              <span className="block truncate">Transitif (متعدي)</span>
              <p className="text-[10px] text-[#5e8d80] font-normal truncate">Perlu objek (maf&lsquo;ul)</p>
            </div>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs text-[#20443a] font-semibold bg-[#f2f8f5] hover:bg-[#e4efe9] px-3 py-2 rounded-xl border border-[#c8e2da] transition-colors w-full">
            <input
              type="checkbox"
              checked={passive}
              onChange={(e) => onPassiveChange(e.target.checked)}
              disabled={disabled}
              className="w-4 h-4 text-[#1f705e] accent-[#1f705e] rounded border-[#a4cabe] focus:ring-[#1f705e] cursor-pointer shrink-0"
            />
            <div className="min-w-0 flex-1">
              <span className="block truncate">Pasif (مجهول)</span>
              <p className="text-[10px] text-[#5e8d80] font-normal truncate">Sertakan bentuk majhul</p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};
