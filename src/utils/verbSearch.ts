import { COMMON_VERBS, CommonVerbItem } from '../data/commonVerbs';

const ARABIC_DIACRITICS = /[\u064B-\u065F\u0670]/g;

/** Normalizes Arabic without removing Arabic letters, or Latin/Indonesian text. */
export function normalizeSuggestionText(value: string): string {
  const text = (value ?? '').trim().toLowerCase();
  if (!text) return '';

  if (/[\u0600-\u06FF]/.test(text)) {
    return text.replace(ARABIC_DIACRITICS, '').replace(/\s+/g, ' ').trim();
  }

  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function matches(value: string, query: string): boolean {
  const normalizedValue = normalizeSuggestionText(value);
  return normalizedValue === query || normalizedValue.startsWith(query) || normalizedValue.includes(query);
}

function relatedWords(item: CommonVerbItem, query: string): string[] {
  return Array.from(
    new Set(
      item.keywords.filter((word) => {
        const normalized = normalizeSuggestionText(word);
        return normalized !== query && (normalized.includes(query) || query.includes(normalized));
      }),
    ),
  ).slice(0, 5);
}

function score(item: CommonVerbItem, query: string): number {
  const arabic = normalizeSuggestionText(item.arabic);
  const unvocalized = normalizeSuggestionText(item.unvocalized);
  const transliteration = normalizeSuggestionText(item.transliteration);
  const meaning = normalizeSuggestionText(item.meaningId);
  const keywords = item.keywords.map(normalizeSuggestionText);

  if (arabic === query || unvocalized === query) return 10000;
  if (arabic.startsWith(query) || unvocalized.startsWith(query)) return 8000;
  if (transliteration === query || meaning === query) return 7000;
  if (transliteration.startsWith(query) || meaning.startsWith(query)) return 6000;
  if (keywords.some((word) => word === query)) return 5000;
  if (keywords.some((word) => word.startsWith(query))) return 4000;
  if (matches(item.arabic, query) || matches(item.unvocalized, query)) return 3000;
  return 2000;
}

/** Local autocomplete for Arabic, transliteration, Indonesian meaning, and keywords. */
export function searchVerbsSafely(rawQuery: string): CommonVerbItem[] {
  const query = normalizeSuggestionText(rawQuery);
  if (!query) return [];

  return COMMON_VERBS
    .filter((item) => {
      const fields = [item.arabic, item.unvocalized, item.transliteration, item.meaningId, ...item.keywords];
      return fields.some((field) => matches(field, query));
    })
    .map((item) => ({ ...item, relatedWords: relatedWords(item, query) }))
    .sort((a, b) => score(b, query) - score(a, query));
}
