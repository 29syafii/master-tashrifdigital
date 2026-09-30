import React, { useState } from 'react';
import {
  ConjugationResult,
  PRONOUN_ORDER,
  MATRIX_PRONOUN_ORDER,
  MATRIX_COLUMN_CATEGORIES,
  CATEGORY_INFO,
  TypographySettings,
  TextScale,
} from '../types/tashrif';
import { speakArabic, stripArabicDiacritics } from '../services/tashrifApi';
import { WazanModal } from './WazanModal';
import { VocalizedCell } from './VocalizedCell';
import {
  Volume2,
  Copy,
  Check,
  Table as TableIcon,
  Layers,
  LayoutGrid,
  BookOpen,
  Info,
  Sparkles,
  Palette,
  ZoomIn,
  ZoomOut,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

interface ConjugationTableProps {
  data: ConjugationResult;
  typographySettings?: TypographySettings;
  onUpdateTypographySettings?: (settings: TypographySettings) => void;
  coloredHarakat?: boolean;
  onToggleColoredHarakat?: () => void;
}

export const ConjugationTable: React.FC<ConjugationTableProps> = ({
  data,
  typographySettings,
  onUpdateTypographySettings,
  coloredHarakat,
  onToggleColoredHarakat,
}) => {
  const { verb, future_type, transitive, conjugation } = data;
  const categories = Object.keys(conjugation || {});

  // Default to 'matrix' which is the exact layout shown in Gambar 2
  const [viewMode, setViewMode] = useState<'matrix' | 'tabs' | 'all'>('matrix');
  const [activeCategory, setActiveCategory] = useState<string>(
    categories[0] || 'الماضي المعلوم',
  );
  const [voiceFilter, setVoiceFilter] = useState<'all' | 'active' | 'passive'>('all');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  // Wazan modal state
  const [modalCategory, setModalCategory] = useState<string | null>(null);

  // Single source of truth for typography settings and coloredHarakat
  const scale = typographySettings?.scale || 'md';
  const fontFamily = typographySettings?.fontFamily || 'noto';
  const isColoredHarakat =
    coloredHarakat !== undefined
      ? coloredHarakat
      : typographySettings?.coloredHarakat !== undefined
      ? typographySettings.coloredHarakat
      : true;

  const fontChoiceClass =
    fontFamily === 'noto'
      ? 'font-arabic-noto'
      : fontFamily === 'amiri'
      ? 'font-arabic-amiri'
      : fontFamily === 'scheherazade'
      ? 'font-arabic-scheherazade'
      : 'font-arabic';

  // Matrix cell font size mapping
  const matrixCellFontSize =
    scale === 'sm'
      ? 'text-sm sm:text-base xl:text-[11px] 2xl:text-[13px]'
      : scale === 'lg'
      ? 'text-lg sm:text-xl xl:text-[15px] 2xl:text-[18px]'
      : scale === 'xl'
      ? 'text-xl sm:text-2xl xl:text-[17px] 2xl:text-[21px]'
      : 'text-base sm:text-lg xl:text-[13px] 2xl:text-[15px]';

  // Tab view cell font size mapping
  const tabCellFontSize =
    scale === 'sm'
      ? 'text-lg sm:text-xl'
      : scale === 'lg'
      ? 'text-2xl sm:text-3xl'
      : scale === 'xl'
      ? 'text-3xl sm:text-4xl'
      : 'text-xl sm:text-2xl';

  const validActiveCategory = categories.includes(activeCategory)
    ? activeCategory
    : categories[0] || '';

  // Filter categories by voice
  const filteredCategories = categories.filter((cat) => {
    if (voiceFilter === 'all') return true;
    const info = CATEGORY_INFO[cat];
    if (!info) return true;
    return info.voice === voiceFilter;
  });

  // Filter matrix columns by voice if selected
  const activeMatrixColumns = MATRIX_COLUMN_CATEGORIES.filter((catName) => {
    if (!categories.includes(catName)) return false;
    if (voiceFilter === 'all') return true;
    const info = CATEGORY_INFO[catName];
    if (!info) return true;
    return info.voice === voiceFilter;
  });

  // Calculate dynamic proportional column widths for desktop fixed layout
  const numCols = activeMatrixColumns.length;
  const pronounColWidthPct = numCols > 8 ? 6.5 : (numCols > 4 ? 9 : 12);
  const categoryColWidthPct = numCols > 0 ? (100 - pronounColWidthPct) / numCols : 10;

  const handleCopy = (text: string, id: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const handleCopyFullCategory = (catName: string) => {
    const catData = conjugation[catName];
    if (!catData) return;

    const lines = [
      `=== ${catName} (${CATEGORY_INFO[catName]?.nameId || ''}) - Verba: ${verb} ===`,
    ];
    PRONOUN_ORDER.forEach((p) => {
      const val = catData[p.key] || '';
      if (val) {
        lines.push(`${p.arabicName} (${p.meaningId}): ${val}`);
      }
    });

    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleToggleHarakat = () => {
    if (onToggleColoredHarakat) {
      onToggleColoredHarakat();
    } else if (onUpdateTypographySettings && typographySettings) {
      onUpdateTypographySettings({
        ...typographySettings,
        coloredHarakat: !isColoredHarakat,
      });
    }
  };

  const handleZoom = (direction: 'in' | 'out') => {
    if (!onUpdateTypographySettings || !typographySettings) return;
    const scaleOrder: TextScale[] = ['sm', 'md', 'lg', 'xl'];
    const currentIndex = scaleOrder.indexOf(typographySettings.scale);
    if (direction === 'in' && currentIndex < scaleOrder.length - 1) {
      onUpdateTypographySettings({
        ...typographySettings,
        scale: scaleOrder[currentIndex + 1],
      });
    } else if (direction === 'out' && currentIndex > 0) {
      onUpdateTypographySettings({
        ...typographySettings,
        scale: scaleOrder[currentIndex - 1],
      });
    }
  };

  return (
    <div className="w-full space-y-5">
      {/* Top Verb Banner matching Gambar 1 & Gambar 2 */}
      <div className="bg-[#1f705e] rounded-2xl p-5 sm:p-6 text-white shadow-md border-2 border-[#165747]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shadow-inner shrink-0">
              <span className={`text-3xl sm:text-4xl ${fontChoiceClass} font-bold text-emerald-100`}>
                {verb.slice(0, 1)}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2
                  className={`text-3xl sm:text-4xl ${fontChoiceClass} font-bold text-white`}
                  dir="rtl"
                >
                  {verb}
                </h2>
                <button
                  type="button"
                  onClick={() => speakArabic(verb)}
                  className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-emerald-100 hover:text-white transition-all cursor-pointer"
                  title="Dengarkan pelafalan verba"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-emerald-100/90 text-xs mt-1 flex flex-wrap items-center gap-2.5">
                <span>
                  Harakat &lsquo;Ain:{' '}
                  <strong className={`text-white ${fontChoiceClass} text-sm`}>{future_type}</strong>
                </span>
                <span>•</span>
                <span>
                  Sifat:{' '}
                  <strong className="text-white">
                    {transitive ? 'Transitif (متعدي)' : 'Intransitif (لازم)'}
                  </strong>
                </span>
                <span>•</span>
                <span>
                  Kategori Wazan: <strong className="text-white">{categories.length}</strong>
                </span>
              </p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto bg-black/20 p-1.5 rounded-xl border border-white/15">
            <button
              type="button"
              onClick={() => setViewMode('matrix')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'matrix'
                  ? 'bg-white text-[#1f705e] shadow-sm'
                  : 'text-emerald-100 hover:text-white'
              }`}
              title="Tampilan tabel konjugasi matriks komprehensif seperti Gambar 2"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Tabel Matriks</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('tabs')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'tabs'
                  ? 'bg-white text-[#1f705e] shadow-sm'
                  : 'text-emerald-100 hover:text-white'
              }`}
              title="Fokus satu per satu wazan"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Mode Tab</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'all'
                  ? 'bg-white text-[#1f705e] shadow-sm'
                  : 'text-emerald-100 hover:text-white'
              }`}
              title="Tampilkan semua wazan dalam kartu grid"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Mode Grid</span>
            </button>
          </div>
        </div>
      </div>

      {/* Control bar: Voice filter, Quick Text Zoom, Harakat toggle & Wazan Info Helper */}
      <div className="bg-white rounded-2xl border-2 border-[#b5d8cd] p-3 shadow-2xs flex flex-wrap items-center justify-center sm:justify-between gap-3">
        {/* Voice filter */}
        <div className="inline-flex rounded-xl bg-[#eaf4f0] p-1 text-xs font-medium border border-[#c4e0d7] shrink-0">
          <button
            type="button"
            onClick={() => setVoiceFilter('all')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              voiceFilter === 'all'
                ? 'bg-[#1f705e] text-white shadow-xs font-semibold'
                : 'text-[#2a5448] hover:text-[#1a332d]'
            }`}
          >
            Semua ({categories.length})
          </button>
          <button
            type="button"
            onClick={() => setVoiceFilter('active')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              voiceFilter === 'active'
                ? 'bg-[#1f705e] text-white shadow-xs font-semibold'
                : 'text-[#2a5448] hover:text-[#1a332d]'
            }`}
          >
            Aktif (معلوم)
          </button>
          <button
            type="button"
            onClick={() => setVoiceFilter('passive')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              voiceFilter === 'passive'
                ? 'bg-[#1f705e] text-white shadow-xs font-semibold'
                : 'text-[#2a5448] hover:text-[#1a332d]'
            }`}
          >
            Pasif (مجهول)
          </button>
        </div>

        {/* Right tools: Quick zoom buttons, Harakat toggle, Wazan Guide button, & Copy tab button */}
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 w-full sm:w-auto">
          {/* Quick font zoom buttons */}
          {onUpdateTypographySettings && typographySettings && (
            <div className="flex items-center gap-1 bg-[#f4faf7] px-2 py-1 rounded-xl border border-[#c0ded5] text-xs">
              <span className="text-[#396357] font-medium hidden sm:inline mr-1">
                Ukuran Teks:
              </span>
              <button
                type="button"
                onClick={() => handleZoom('out')}
                disabled={scale === 'sm'}
                className="p-1 rounded text-[#1f705e] hover:bg-[#e4efe9] disabled:opacity-30 cursor-pointer"
                title="Perkecil ukuran tulisan"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono font-bold text-[#1f705e] px-1 uppercase">
                {scale}
              </span>
              <button
                type="button"
                onClick={() => handleZoom('in')}
                disabled={scale === 'xl'}
                className="p-1 rounded text-[#1f705e] hover:bg-[#e4efe9] disabled:opacity-30 cursor-pointer"
                title="Perbesar ukuran tulisan"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Quick Guide / Linguistic Explanation of currently viewed Wazan */}
          {viewMode === 'tabs' && validActiveCategory && (
            <button
              type="button"
              onClick={() => setModalCategory(validActiveCategory)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer bg-[#eaf4f0] text-[#1f705e] hover:bg-[#1f705e] hover:text-white border border-[#b5d8cd]"
              title={`Buka penjelasan gramatikal & signifikansi linguistik wazan ${validActiveCategory}`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Signifikansi Wazan</span>
            </button>
          )}

          {/* Toggle Harakat Berwarna Merah (Sinkron dengan TypographyBar) */}
          <button
            type="button"
            onClick={handleToggleHarakat}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-2 transition-all cursor-pointer border ${
              isColoredHarakat
                ? 'bg-[#fef2f2] border-rose-300 text-rose-700 font-semibold ring-2 ring-rose-200/70 shadow-xs'
                : 'bg-[#f4faf7] border-[#b5d8cd] text-[#2c5449] hover:bg-[#eaf4f0]'
            }`}
            title="Beralih antara harakat merah (kontras tinggi) atau harakat warna standar gelap"
          >
            {/* Palette icon with text-rose-600 that ALWAYS shows */}
            <Palette className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                isColoredHarakat ? 'bg-rose-500' : 'bg-slate-400'
              }`}
            />
            <span>Warna Harakat:</span>
            <span className={isColoredHarakat ? 'text-rose-700 font-bold' : 'text-slate-700'}>
              {isColoredHarakat ? 'Merah' : 'Standar'}
            </span>
          </button>

          {/* Copy Full Category button (in Tab View) */}
          {viewMode === 'tabs' && validActiveCategory && (
            <button
              type="button"
              onClick={() => handleCopyFullCategory(validActiveCategory)}
              className="text-xs text-[#2b5449] hover:text-[#1f705e] flex items-center gap-1.5 bg-[#f4faf7] border border-[#b5d8cd] px-3 py-1.5 rounded-xl hover:bg-[#eaf4f0] transition-colors cursor-pointer font-medium"
            >
              {copiedAll ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#5e8c80]" />
                  <span>Salin Wazan Ini</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Tabs Bar (if Tab View is active) */}
      {viewMode === 'tabs' && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {filteredCategories.map((catKey) => {
            const info = CATEGORY_INFO[catKey];
            const isSelected = validActiveCategory === catKey;

            return (
              <button
                key={catKey}
                type="button"
                onClick={() => setActiveCategory(catKey)}
                title={`${info?.nameId || catKey}: ${info?.description || ''}`}
                className={`px-4 py-2.5 rounded-2xl text-right shrink-0 transition-all border-2 flex flex-col items-start cursor-pointer group ${
                  isSelected
                    ? 'bg-[#1f705e] text-white border-[#1f705e] shadow-md'
                    : 'bg-white text-[#1a332d] border-[#b5d8cd] hover:border-[#1f705e] hover:bg-[#eef7f3]'
                }`}
              >
                <div className="flex items-center gap-1.5 w-full justify-between">
                  <span className={`text-base ${fontChoiceClass} font-bold`} dir="rtl">
                    {catKey}
                  </span>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalCategory(catKey);
                    }}
                    title="Klik untuk melihat penjelasan gramatikal wazan ini"
                    className="p-0.5 rounded cursor-pointer"
                  >
                    <HelpCircle
                      className={`w-3 h-3 transition-opacity ${
                        isSelected
                          ? 'opacity-80 hover:opacity-100 text-emerald-100'
                          : 'opacity-40 group-hover:opacity-100 text-[#1f705e]'
                      }`}
                    />
                  </span>
                </div>
                <span
                  className={`text-[11px] font-sans ${
                    isSelected ? 'text-emerald-100' : 'text-[#58887b]'
                  }`}
                >
                  {info?.nameId || catKey}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* VIEW 1: MATRIX VIEW (GAMBAR 2) */}
      {viewMode === 'matrix' && (
        <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-lg overflow-hidden">
          {/* Scrollable Container with RTL direction */}
          <div className="overflow-x-auto w-full max-h-[85vh] scrollbar-thin">
            <table
              className="w-full border-collapse text-center min-w-[840px] xl:min-w-0 xl:table-fixed"
              dir="rtl"
            >
              <colgroup>
                {/* Pronoun column */}
                <col
                  className="w-[75px] xl:w-auto"
                  style={{ width: `${pronounColWidthPct}%` }}
                />
                {/* Dynamic Category columns */}
                {activeMatrixColumns.map((catName) => (
                  <col
                    key={catName}
                    className="xl:w-auto"
                    style={{ width: `${categoryColWidthPct}%` }}
                  />
                ))}
              </colgroup>
              <thead>
                <tr className="bg-slate-50 border-b-2 border-slate-300 sticky top-0 z-20">
                  {/* Rightmost column: الضمائر */}
                  <th className={`py-2.5 px-1 border-l border-slate-300 ${fontChoiceClass} text-sm sm:text-base xl:text-xs 2xl:text-sm font-bold text-[#1b70b8] whitespace-nowrap bg-slate-100/95 sticky right-0 z-25 shadow-xs text-center align-middle`}>
                    الضمائر
                  </th>
                  {/* Dynamic Categories as shown in Gambar 2 with Tooltip & Click-to-explain */}
                  {activeMatrixColumns.map((catName) => {
                    const info = CATEGORY_INFO[catName];
                    const tooltipText = `${catName} (${info?.nameId || ''})\n• Signifikansi: ${info?.grammaticalSignificance || info?.description || ''}\n• Status I'rab: ${info?.irabStatus || ''}\n(Klik kolom ini untuk penjelasan linguistik lengkap)`;

                    return (
                      <th
                        key={catName}
                        onClick={() => setModalCategory(catName)}
                        title={tooltipText}
                        className={`py-2 px-0.5 sm:px-1 border-l border-slate-300 ${fontChoiceClass} text-xs sm:text-sm xl:text-[11px] 2xl:text-xs font-bold text-[#1b70b8] hover:text-[#1f705e] hover:bg-emerald-50/80 bg-slate-50 leading-snug break-words text-center align-middle min-w-[75px] xl:min-w-0 cursor-pointer group/th transition-colors relative select-none`}
                      >
                        <div className="flex items-center justify-center gap-0.5">
                          <span>{catName}</span>
                          <HelpCircle className="w-2.5 h-2.5 opacity-30 group-hover/th:opacity-100 text-[#1f705e] transition-opacity shrink-0" />
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {MATRIX_PRONOUN_ORDER.map((pronoun, rowIdx) => {
                  return (
                    <tr
                      key={pronoun.key}
                      className={`hover:bg-[#f0f8f5] transition-colors ${
                        rowIdx % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'
                      }`}
                    >
                      {/* Pronoun Column (Sticky Right) */}
                      <td className={`py-1.5 sm:py-2 px-1 border-l border-slate-300 ${fontChoiceClass} text-base sm:text-lg xl:text-sm 2xl:text-base font-bold text-slate-800 bg-slate-100/95 whitespace-nowrap sticky right-0 z-10 shadow-xs text-center align-middle`}>
                        {pronoun.arabicName}
                      </td>

                      {/* Cells for each Category in Gambar 2 */}
                      {activeMatrixColumns.map((catName) => {
                        const word = conjugation[catName]?.[pronoun.key] || '';
                        const cellId = `matrix-${catName}-${pronoun.key}`;
                        const isCopied = copiedKey === cellId;

                        return (
                          <td
                            key={catName}
                            className={`py-1 sm:py-1.5 px-0.5 sm:px-1 xl:px-0.5 border-l border-slate-300 relative group cursor-pointer hover:bg-emerald-50/70 transition-colors text-center align-middle overflow-hidden ${
                              isCopied ? 'bg-emerald-100/60' : ''
                            }`}
                            onClick={() => word && handleCopy(word, cellId)}
                            title={
                              word
                                ? `${catName} (${pronoun.arabicName}): ${word} — Klik untuk salin`
                                : undefined
                            }
                          >
                            <div className="flex items-center justify-center min-h-[30px] xl:min-h-[26px] 2xl:min-h-[32px] px-0.5 relative">
                              <VocalizedCell
                                text={word}
                                coloredHarakat={isColoredHarakat}
                                className={`${fontChoiceClass} ${matrixCellFontSize} font-medium`}
                              />

                              {/* Hover actions (Audio & Copy) */}
                              {word && (
                                <div className="absolute left-0.5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 flex items-center gap-0.5 bg-white/95 shadow-xs rounded px-1 py-0.5 border border-slate-200 transition-opacity z-10">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      speakArabic(word);
                                    }}
                                    className="p-0.5 text-slate-500 hover:text-[#1f705e] transition-colors cursor-pointer"
                                    title="Dengarkan pelafalan"
                                  >
                                    <Volume2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                  </button>
                                  <span className="p-0.5 text-slate-500 hover:text-[#1f705e] transition-colors">
                                    {isCopied ? (
                                      <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-600" />
                                    ) : (
                                      <Copy className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                    )}
                                  </span>
                                </div>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="p-2.5 bg-slate-50 border-t border-slate-300 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 px-4 gap-2">
            <span className="flex items-center gap-1.5 font-medium text-[#1b70b8]">
              <Sparkles className="w-3.5 h-3.5 text-[#1b70b8]" />
              <span>Tabel Matriks Tashrif Lengkap (12 Kategori × 14 Dhamir)</span>
            </span>
            <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <HelpCircle className="w-3 h-3 text-[#1f705e]" />
              <span>Klik judul kolom wazan di atas untuk penjelasan gramatikal &amp; signifikansi linguistiknya</span>
            </span>
          </div>
        </div>
      )}

      {/* VIEW 2: SINGLE CATEGORY TAB VIEW */}
      {viewMode === 'tabs' && (
        <CategoryCard
          categoryKey={validActiveCategory}
          dhamirValues={conjugation[validActiveCategory] || {}}
          onCopy={handleCopy}
          copiedKey={copiedKey}
          coloredHarakat={isColoredHarakat}
          fontChoiceClass={fontChoiceClass}
          cellFontSize={tabCellFontSize}
          onOpenModal={(cat) => setModalCategory(cat)}
        />
      )}

      {/* VIEW 3: GRID VIEW OF ALL CATEGORIES */}
      {viewMode === 'all' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCategories.map((catKey) => (
            <CategoryCard
              key={catKey}
              categoryKey={catKey}
              dhamirValues={conjugation[catKey] || {}}
              onCopy={handleCopy}
              copiedKey={copiedKey}
              coloredHarakat={isColoredHarakat}
              fontChoiceClass={fontChoiceClass}
              cellFontSize={tabCellFontSize}
              onOpenModal={(cat) => setModalCategory(cat)}
              isGrid
            />
          ))}
        </div>
      )}

      {/* Linguistic Wazan Explanation Modal */}
      {modalCategory && (
        <WazanModal
          categoryKey={modalCategory}
          onClose={() => setModalCategory(null)}
          onSelectCategory={(cat) => setModalCategory(cat)}
          typographySettings={typographySettings}
        />
      )}
    </div>
  );
};

interface CategoryCardProps {
  categoryKey: string;
  dhamirValues: Record<string, string>;
  onCopy: (text: string, id: string) => void;
  copiedKey: string | null;
  coloredHarakat?: boolean;
  fontChoiceClass?: string;
  cellFontSize?: string;
  onOpenModal?: (cat: string) => void;
  isGrid?: boolean;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  categoryKey,
  dhamirValues,
  onCopy,
  copiedKey,
  coloredHarakat = true,
  fontChoiceClass = 'font-arabic',
  cellFontSize = 'text-xl sm:text-2xl',
  onOpenModal,
  isGrid = false,
}) => {
  const meta = CATEGORY_INFO[categoryKey];
  const isImperative = meta?.mood === 'imperative';

  return (
    <div className="bg-white rounded-2xl border-2 border-[#b5d8cd] shadow-md overflow-hidden flex flex-col">
      {/* Category Header */}
      <div className="p-4 bg-[#eaf4f0] border-b-2 border-[#cde2da] flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#1f705e]" />
            <h3 className="font-bold text-[#1a332d] text-base">
              {meta?.nameId || categoryKey}
            </h3>
            {/* Tooltip trigger button */}
            {onOpenModal && (
              <button
                type="button"
                onClick={() => onOpenModal(categoryKey)}
                className="p-1 rounded-lg text-[#1f705e] hover:bg-[#d8ece4] transition-colors cursor-pointer"
                title={`Pelajari signifikansi linguistik & gramatikal wazan ${categoryKey}`}
                aria-label={`Pelajari signifikansi gramatikal ${categoryKey}`}
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            )}
          </div>
          {meta?.description && (
            <p className="text-xs text-[#4f7f72] mt-0.5">{meta.description}</p>
          )}
        </div>
        <div className="text-right flex items-center gap-3">
          <span className={`text-2xl ${fontChoiceClass} font-bold text-[#1f705e]`} dir="rtl">
            {categoryKey}
          </span>
        </div>
      </div>

      {/* Linguistic Significance Brief Bar */}
      {meta?.grammaticalSignificance && (
        <div className="px-4 py-2 bg-[#f4faf7] border-b border-[#cde2da] flex items-center justify-between gap-3 text-xs text-[#2b5449]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#1f705e] shrink-0" />
            <p className="text-[11px] text-[#2c5449] line-clamp-1 sm:line-clamp-none">
              <strong className="text-[#1a332d]">Fungsi Gramatikal:</strong> {meta.grammaticalSignificance}
            </p>
          </div>
          {onOpenModal && (
            <button
              type="button"
              onClick={() => onOpenModal(categoryKey)}
              className="text-[11px] text-[#1f705e] font-semibold hover:underline shrink-0 cursor-pointer"
            >
              Detail &rarr;
            </button>
          )}
        </div>
      )}

      {/* Imperative note if applicable */}
      {isImperative && (
        <div className="px-4 py-2 bg-[#f2f8f5] border-b border-[#cde2da] flex items-center gap-2 text-xs text-[#2b5449]">
          <Info className="w-3.5 h-3.5 shrink-0 text-[#1f705e]" />
          <span>
            Fi&lsquo;il Amr khusus untuk orang ke-2 (Mukhatab: أَنْتَ, أَنْتِ, dst). Dhamir lainnya tidak memiliki bentuk perintah langsung.
          </span>
        </div>
      )}

      {/* 14 Dhamir Table */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-[#f2f8f5] border-b border-[#cde2da] text-[#2b5449] text-xs font-bold">
              <th className="py-2.5 px-3 w-12 text-center">No</th>
              <th className="py-2.5 px-3">Dhamir (Subjek)</th>
              <th className="py-2.5 px-3 text-right">Bentuk Tashrif</th>
              <th className="py-2.5 px-3 w-20 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5f0ec]">
            {PRONOUN_ORDER.map((pronoun, index) => {
              const conjugatedForm = dhamirValues[pronoun.key] ?? '';
              const isEmpty = !conjugatedForm.trim();
              const uniqueRowId = `${categoryKey}-${pronoun.key}`;
              const isCopied = copiedKey === uniqueRowId;

              return (
                <tr
                  key={pronoun.key}
                  className={`hover:bg-[#eef7f3] transition-colors ${
                    isEmpty ? 'bg-slate-50/50 text-slate-400' : ''
                  }`}
                >
                  {/* Number */}
                  <td className="py-2.5 px-3 text-xs text-center font-mono text-[#6e9b8f]">
                    {index + 1}
                  </td>

                  {/* Dhamir + Meaning */}
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2.5">
                      <span className={`text-xl ${fontChoiceClass} font-bold text-[#1a332d]`} dir="rtl">
                        {pronoun.arabicName}
                      </span>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-[#2b5449]">
                          {pronoun.meaningId}
                        </span>
                        <span className="text-[10px] text-[#6b968a] font-mono">
                          {pronoun.person} • {pronoun.gender}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Conjugated Form */}
                  <td className="py-2.5 px-3 text-right" dir="rtl">
                    {isEmpty ? (
                      <span className="text-xs text-slate-300 font-mono italic">—</span>
                    ) : (
                      <div className="py-0.5 px-1.5 rounded-md hover:bg-emerald-50/50 inline-block transition-colors">
                        <VocalizedCell
                          text={conjugatedForm}
                          coloredHarakat={coloredHarakat}
                          className={`${fontChoiceClass} ${cellFontSize} font-medium`}
                        />
                      </div>
                    )}
                  </td>

                  {/* Action Buttons (Audio + Copy) */}
                  <td className="py-2.5 px-3 text-center">
                    {!isEmpty && (
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => speakArabic(conjugatedForm)}
                          className="p-1.5 text-[#5e8c80] hover:text-[#1f705e] hover:bg-[#e4efe9] rounded-lg transition-colors cursor-pointer"
                          title={`Dengarkan: ${conjugatedForm}`}
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onCopy(conjugatedForm, uniqueRowId)}
                          className="p-1.5 text-[#5e8c80] hover:text-[#1f705e] hover:bg-[#e4efe9] rounded-lg transition-colors cursor-pointer"
                          title="Salin kata"
                        >
                          {isCopied ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
