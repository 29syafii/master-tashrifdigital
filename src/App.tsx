/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  FutureType,
  ConjugateParams,
  ConjugationResult,
  TypographySettings,
  VerbSuggestionItem,
} from './types/tashrif';
import { fetchSuggestions, fetchConjugation } from './services/tashrifApi';
import { searchCommonVerbs, COMMON_VERBS } from './data/commonVerbs';
import { deduplicateSuggestions } from './utils/suggestionRanker';
import { SearchBox } from './components/SearchBox';
import { SuggestionList } from './components/SuggestionList';
import { TypographyBar } from './components/TypographyBar';
import { ConjugationControls } from './components/ConjugationControls';
import { ConjugationTable } from './components/ConjugationTable';
import { QuickExamples } from './components/QuickExamples';
import { ErrorMessage } from './components/ErrorMessage';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import {
  Sparkles,
  Search,
  BookOpen,
  HelpCircle,
  Database,
} from 'lucide-react';
import {
  loadVerbDatabase,
  searchDatabase,
  FUTURE_TYPE_LABELS,
  isDatabaseLoaded,
  getDatabaseSize,
} from './data/verbDatabase';

export default function App() {
  // Search query state
  const [searchQuery, setSearchQuery] = useState('');

  // Autocomplete suggestions state
  const [suggestions, setSuggestions] = useState<VerbSuggestionItem[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [suggestionError, setSuggestionError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Flexible typography settings (font scale, font family, harakat color, direction)
  const [typographySettings, setTypographySettings] = useState<TypographySettings>({
    scale: 'md',
    fontFamily: 'noto',
    coloredHarakat: true,
    autoDirection: true,
  });

  // Conjugation request parameters
  const [selectedVerb, setSelectedVerb] = useState<string>('');
  const [futureType, setFutureType] = useState<FutureType>('فتحة');
  const [transitive, setTransitive] = useState<boolean>(true);
  const [passive, setPassive] = useState<boolean>(true);

  // Conjugation results & state
  const [conjugationResult, setConjugationResult] = useState<ConjugationResult | null>(null);
  const [isLoadingConjugation, setIsLoadingConjugation] = useState(false);
  const [conjugationError, setConjugationError] = useState<string | null>(null);

  // Qutrub 17k verb database state
  const [dbLoaded, setDbLoaded] = useState<boolean>(isDatabaseLoaded());
  const [dbCount, setDbCount] = useState<number>(getDatabaseSize());

  // References for canceling in-flight requests & debouncing
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suggestAbortControllerRef = useRef<AbortController | null>(null);
  const conjugateAbortControllerRef = useRef<AbortController | null>(null);

  // Preload Qutrub database (17,441 verbs) on initial load
  useEffect(() => {
    loadVerbDatabase()
      .then((data) => {
        if (data.length > 0) {
          setDbLoaded(true);
          setDbCount(data.length);
        }
      })
      .catch((err) => {
        console.warn('Gagal preload database Qutrub:', err);
      });
  }, []);

  /**
   * Flexible query change with instant local common dictionary + Qutrub 17k database + API suggestions
   */
  const handleQueryChange = (query: string) => {
    setSearchQuery(query);
    setSuggestionError(null);

    // Cancel existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    const trimmed = query.trim();
    if (!trimmed) {
      setSuggestions([]);
      setIsLoadingSuggestions(false);
      setShowSuggestions(false);
      return;
    }

    setShowSuggestions(true);

    // 1. Instant local common dictionary matching (handles Latin: "kataba", "menulis", and Arabic)
    const localMatches = searchCommonVerbs(trimmed);
    const initialSuggestions: VerbSuggestionItem[] = localMatches.map((item) => ({
      verb: item.arabic,
      futureType: item.futureType,
      meaningId: item.meaningId,
      transliteration: item.transliteration,
      relatedWords: item.relatedWords ?? [],
      source: 'dictionary',
    }));

    // 2. Qutrub 17k database search (instant in-memory search across 17.400+ verbs)
    const existingVerbs = new Set(initialSuggestions.map((s) => s.verb));
    const qutrubMatches = searchDatabase(trimmed, 30);
    const qutrubSuggestions: VerbSuggestionItem[] = [];

    for (const q of qutrubMatches) {
      if (!existingVerbs.has(q.v)) {
        existingVerbs.add(q.v);
        qutrubSuggestions.push({
          verb: q.v,
          futureType: FUTURE_TYPE_LABELS[q.ft] as FutureType,
          bab: q.b,
          transitive: q.tr,
          source: 'qutrub',
        });
      }
    }

    const combinedLocal = deduplicateSuggestions(
      [...initialSuggestions, ...qutrubSuggestions],
      trimmed,
    );
    setSuggestions(combinedLocal);

    // 3. If it contains Arabic characters, fetch additional API suggestions with 250ms debounce
    const containsArabic = /[\u0600-\u06FF]/.test(trimmed);
    if (!containsArabic && initialSuggestions.length > 0) {
      // If query is pure Latin and we found local matches, no need to spam API
      setIsLoadingSuggestions(false);
      return;
    }

    setIsLoadingSuggestions(true);

    debounceTimerRef.current = setTimeout(async () => {
      if (suggestAbortControllerRef.current) {
        suggestAbortControllerRef.current.abort();
      }
      suggestAbortControllerRef.current = new AbortController();

      try {
        const apiVerbs = await fetchSuggestions(
          trimmed,
          suggestAbortControllerRef.current.signal,
        );

        // Combine local dictionary & Qutrub matches with API suggestions
        const combined = [...combinedLocal];
        const currentVerbSet = new Set(combined.map((s) => s.verb));

        apiVerbs.forEach((verbStr) => {
          if (!currentVerbSet.has(verbStr)) {
            // Check if this verb matches any known dictionary item for extra metadata
            const dictItem = COMMON_VERBS.find(
              (cv) => cv.arabic === verbStr || cv.unvocalized === verbStr,
            );
            combined.push({
              verb: verbStr,
              futureType: dictItem?.futureType,
              meaningId: dictItem?.meaningId,
              transliteration: dictItem?.transliteration,
              relatedWords: dictItem?.relatedWords ?? [],
              source: 'api',
            });
            currentVerbSet.add(verbStr);
          }
        });

        // Apply deduplication and smart ranking
        const finalSuggestions = deduplicateSuggestions(combined, trimmed);
        setSuggestions(finalSuggestions);
        setIsLoadingSuggestions(false);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        setIsLoadingSuggestions(false);
        // Only show error if we have no local suggestions
        if (combinedLocal.length === 0) {
          setSuggestionError(
            err instanceof Error ? err.message : 'Gagal memuat saran verba.',
          );
        }
      }
    }, 250);
  };

  /**
   * Main function to execute verb conjugation
   */
  const executeConjugation = useCallback(
    async (params: ConjugateParams) => {
      if (!params.verb.trim()) return;

      // Abort any ongoing conjugation request
      if (conjugateAbortControllerRef.current) {
        conjugateAbortControllerRef.current.abort();
      }
      conjugateAbortControllerRef.current = new AbortController();

      setIsLoadingConjugation(true);
      setConjugationError(null);

      try {
        const data = await fetchConjugation(
          params,
          conjugateAbortControllerRef.current.signal,
        );
        setConjugationResult(data);
        setIsLoadingConjugation(false);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        setIsLoadingConjugation(false);
        setConjugationError(
          err instanceof Error
            ? err.message
            : 'Gagal mengambil hasil konjugasi dari server.',
        );
      }
    },
    [],
  );

  /**
   * Triggered when user selects a verb from suggestion list or example
   */
  const handleSelectVerb = (
    verb: string,
    overrideFutureType?: FutureType,
    overrideTransitive?: boolean,
  ) => {
    setSelectedVerb(verb);
    setSearchQuery(verb);
    setShowSuggestions(false);

    const fType = overrideFutureType ?? futureType;
    if (overrideFutureType) {
      setFutureType(overrideFutureType);
    }

    const isTrans = overrideTransitive !== undefined ? overrideTransitive : transitive;
    if (overrideTransitive !== undefined) {
      setTransitive(overrideTransitive);
    }

    executeConjugation({
      verb,
      future_type: fType,
      transitive: isTrans,
      passive,
    });
  };

  const handleSelectSuggestion = (item: VerbSuggestionItem) => {
    handleSelectVerb(item.verb, item.futureType, item.transitive);
  };

  /**
   * Handle parameter change (future_type, transitive, passive)
   */
  const handleFutureTypeChange = (newType: FutureType) => {
    setFutureType(newType);
    if (selectedVerb) {
      executeConjugation({
        verb: selectedVerb,
        future_type: newType,
        transitive,
        passive,
      });
    }
  };

  const handleTransitiveChange = (newTransitive: boolean) => {
    setTransitive(newTransitive);
    if (selectedVerb) {
      executeConjugation({
        verb: selectedVerb,
        future_type: futureType,
        transitive: newTransitive,
        passive,
      });
    }
  };

  const handlePassiveChange = (newPassive: boolean) => {
    setPassive(newPassive);
    if (selectedVerb) {
      executeConjugation({
        verb: selectedVerb,
        future_type: futureType,
        transitive,
        passive: newPassive,
      });
    }
  };

  const handleResetDefaults = () => {
    setFutureType('فتحة');
    setTransitive(true);
    setPassive(true);
    if (selectedVerb) {
      executeConjugation({
        verb: selectedVerb,
        future_type: 'فتحة',
        transitive: true,
        passive: true,
      });
    }
  };

  /**
   * Reset / kosongkan kolom pencarian & sembunyikan semua tabel konjugasi
   */
  const handleResetSearch = () => {
    // Batalkan request yang sedang berjalan jika ada
    if (suggestAbortControllerRef.current) {
      suggestAbortControllerRef.current.abort();
    }
    if (conjugateAbortControllerRef.current) {
      conjugateAbortControllerRef.current.abort();
    }
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    setSearchQuery('');
    setSelectedVerb('');
    setConjugationResult(null);
    setIsLoadingConjugation(false);
    setConjugationError(null);
    setSuggestions([]);
    setShowSuggestions(false);
    setSuggestionError(null);
  };

  /**
   * Single source of truth setter for coloredHarakat toggle
   */
  const handleToggleColoredHarakat = useCallback(() => {
    setTypographySettings((prev) => ({
      ...prev,
      coloredHarakat: !prev.coloredHarakat,
    }));
  }, []);

  // Cleanup abort controllers and timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      if (suggestAbortControllerRef.current) suggestAbortControllerRef.current.abort();
      if (conjugateAbortControllerRef.current) conjugateAbortControllerRef.current.abort();
    };
  }, []);

  return (
    <div
      data-text-scale={typographySettings.scale}
      className="min-h-screen bg-[#d0e4dd] text-[#1a332d] p-2.5 sm:p-4 md:p-6 flex flex-col justify-between font-sans selection:bg-[#1f705e]/20 selection:text-[#1f705e]"
    >
      {/* Outer Window Container with expanded desktop width */}
      <div className="w-[96%] sm:w-[95%] md:w-[94%] max-w-[1840px] mx-auto bg-[#e5f1ec]/90 border-4 border-white/80 rounded-3xl shadow-2xl p-3 sm:p-5 md:p-6 lg:p-7 flex flex-col gap-6 flex-1 backdrop-blur-sm">
        {/* Top Header Bar following strict Top Bar Contract */}
        <header className="bg-[#1f705e] text-white rounded-2xl sm:rounded-3xl px-4 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between shadow-md border border-[#165747]">
          {/* Zone 1: Brand wordmark in display face */}
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg sm:text-xl tracking-wider text-white">
              TASHRIF DIGITAL
            </span>
          </div>

          {/* Zone 2: Clean single-line info */}
          <div className="hidden md:flex items-center gap-4 text-xs font-medium text-emerald-100/90">
            <span>Konjugasi 14 Dhamir</span>
            <span aria-hidden="true">·</span>
            <span>12 Wazan Lengkap</span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1.5 bg-[#175747] px-2.5 py-0.5 rounded-full text-white font-semibold border border-emerald-400/30 shadow-xs">
              <Database className="w-3 h-3 text-emerald-300" />
              {dbLoaded ? `${dbCount.toLocaleString()} Verba Qutrub` : 'Database Qutrub'}
            </span>
          </div>

          {/* Zone 3: Arabic branding / user identifier */}
          <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-emerald-100">
            <span
              className={`font-bold text-xl sm:text-2xl text-white tracking-wide ${
                typographySettings.fontFamily === 'noto'
                  ? 'font-arabic-noto'
                  : typographySettings.fontFamily === 'amiri'
                  ? 'font-arabic-amiri'
                  : 'font-arabic-scheherazade'
              }`}
              dir="rtl"
            >
              الشافعي
            </span>
          </div>
        </header>

        {/* Main Workspace */}
        <main className="flex-1 flex flex-col gap-7 sm:gap-8">
          {/* Search & Suggestions Section */}
          <section className="space-y-5 sm:space-y-6">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1a332d] tracking-tight [text-wrap:balance]">
                Cari &amp; Konjugasikan Verba Arab
              </h2>
              <p className="text-xs sm:text-sm text-[#487367] mt-1.5 leading-relaxed [text-wrap:balance]">
                Didukung basis data <span className="font-semibold text-[#1f705e]">Qutrub ({dbCount > 0 ? dbCount.toLocaleString() : '17.400+'} verba)</span>. Ketikkan kata dalam huruf Arab, transliterasi Latin, atau arti Indonesia.
              </p>
            </div>

            {/* Typography & Flexibility Control Bar */}
            <div className="max-w-4xl mx-auto w-full">
              <TypographyBar
                settings={typographySettings}
                onChange={setTypographySettings}
                coloredHarakat={typographySettings.coloredHarakat}
                onToggleColoredHarakat={handleToggleColoredHarakat}
                onReset={handleResetSearch}
              />
            </div>

            {/* Flexible Search Box */}
            <div className="max-w-3xl mx-auto space-y-2">
              <SearchBox
                value={searchQuery}
                onChange={handleQueryChange}
                onSearchSubmit={(verb) => handleSelectVerb(verb)}
                isLoadingSuggestions={isLoadingSuggestions}
                typographySettings={typographySettings}
              />

              {/* Suggestions Dropdown / List */}
              {showSuggestions && searchQuery.trim() && (
                <div className="animate-in fade-in slide-in-from-top-1 duration-150">
                  <SuggestionList
                    suggestions={suggestions}
                    query={searchQuery}
                    onSelect={handleSelectSuggestion}
                    isLoading={isLoadingSuggestions}
                    typographySettings={typographySettings}
                  />
                </div>
              )}

              {/* Suggestion error if any */}
              {suggestionError && (
                <p className="text-xs text-rose-600 px-3 font-medium">{suggestionError}</p>
              )}
            </div>

            {/* Quick Example Verbs */}
            <div className="max-w-3xl mx-auto pt-1">
              <QuickExamples
                onSelectVerb={handleSelectVerb}
                disabled={isLoadingConjugation}
                typographySettings={typographySettings}
              />
            </div>
          </section>

          {/* Conjugation Controls (Future type, Transitive, Passive) */}
          <section className="max-w-4xl mx-auto w-full pt-1">
            <ConjugationControls
              futureType={futureType}
              transitive={transitive}
              passive={passive}
              onFutureTypeChange={handleFutureTypeChange}
              onTransitiveChange={handleTransitiveChange}
              onPassiveChange={handlePassiveChange}
              onResetDefaults={handleResetDefaults}
              disabled={isLoadingConjugation}
            />
          </section>

          {/* Conjugation Result / Loading / Error Display */}
          <section className="w-full">
            {isLoadingConjugation && <LoadingSkeleton />}

            {conjugationError && (
              <ErrorMessage
                message={conjugationError}
                onRetry={() => {
                  if (selectedVerb) {
                    executeConjugation({
                      verb: selectedVerb,
                      future_type: futureType,
                      transitive,
                      passive,
                    });
                  }
                }}
              />
            )}

            {!isLoadingConjugation && !conjugationError && conjugationResult && (
              <ConjugationTable
                data={conjugationResult}
                typographySettings={typographySettings}
                onUpdateTypographySettings={setTypographySettings}
                coloredHarakat={typographySettings.coloredHarakat}
                onToggleColoredHarakat={handleToggleColoredHarakat}
              />
            )}

            {!isLoadingConjugation && !conjugationError && !conjugationResult && (
              <div className="bg-white/95 backdrop-blur-xs rounded-3xl border-2 border-[#b5d8cd] p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-[#eaf4f0] text-[#1f705e] mx-auto flex items-center justify-center mb-4 border-2 border-[#bedcd2] shadow-xs">
                  <Search className="w-8 h-8 stroke-[1.8]" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#1a332d]">
                  Belum Ada Verba yang Dipilih
                </h3>
                <p className="text-xs sm:text-sm text-[#4f7f72] mt-2 max-w-md mx-auto leading-relaxed">
                  Ketikkan verba di kolom pencarian di atas (misal <span className="font-bold text-[#1f705e]">kataba</span>, <span className="font-arabic font-bold text-[#1f705e] text-lg">صل</span>, atau <span className="font-bold text-[#1f705e]">menulis</span>) untuk melihat tabel konjugasi lengkap.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs text-[#2b5449]">
                  <span className="inline-flex items-center gap-1.5 bg-[#eaf4f0] px-3.5 py-1.5 rounded-full border border-[#c4e0d7] font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-[#1f705e]" />
                    12 Kategori Wazan
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-[#eaf4f0] px-3.5 py-1.5 rounded-full border border-[#c4e0d7] font-medium">
                    <HelpCircle className="w-3.5 h-3.5 text-[#1f705e]" />
                    14 Dhamir Lengkap
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-[#eaf4f0] px-3.5 py-1.5 rounded-full border border-[#c4e0d7] font-arabic font-bold text-sm text-[#1f705e]">
                    معلوم ومجهول
                  </span>
                </div>
              </div>
            )}
          </section>
        </main>

        {/* Inner Frame Footer */}
        <footer className="mt-auto pt-4 border-t border-[#cde2da] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#4e7d70]">
          <div className="flex items-center gap-2 font-medium">
            <BookOpen className="w-3.5 h-3.5 text-[#1f705e]" />
            <span className="text-[#1a332d] font-bold">Tashrif Digital</span>
            <span>—</span>
            <span>Alat Konjugasi Verba Arab (Shorof) Interaktif</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
