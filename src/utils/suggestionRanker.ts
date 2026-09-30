/**
 * Smart suggestion ranking engine
 * Menggabungkan local dictionary matches dengan related words
 * dan API suggestions dalam satu scoring system yang stabil
 */

import { VerbSuggestionItem } from '../types/tashrif';
import { CommonVerbItem } from '../data/commonVerbs';

export interface SuggestionRankScore {
  item: VerbSuggestionItem;
  score: number;
  matchType: 'exact' | 'prefix' | 'keyword' | 'related' | 'api' | 'qutrub';
}

const normalizeQuery = (q: string): string => {
  return q
    .toLowerCase()
    .trim()
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Hitung skor relevansi untuk satu suggestion item
 * Semakin tinggi skor = semakin relevan
 */
export const rankSuggestion = (
  item: VerbSuggestionItem,
  query: string,
  commonVerbLookup?: Map<string, CommonVerbItem>
): SuggestionRankScore => {
  const normalizedQuery = normalizeQuery(query);

  if (!normalizedQuery) {
    return { item, score: 0, matchType: 'api' };
  }

  // Layer 1: Exact match pada verb atau unvocalized
  const verb = item.verb || '';
  const normalizedVerb = normalizeQuery(verb);

  if (normalizedVerb === normalizedQuery) {
    return { item, score: 10000, matchType: 'exact' };
  }

  // Layer 2: Prefix match pada Arabic verb atau transliteration
  const transliteration = item.transliteration ? normalizeQuery(item.transliteration) : '';

  if (normalizedVerb.startsWith(normalizedQuery) || transliteration.startsWith(normalizedQuery)) {
    return { item, score: 5000, matchType: 'prefix' };
  }

  // Layer 3: Keyword match (pada meaning, transliteration, atau related words)
  let keywordScore = 0;

  if (item.meaningId && normalizeQuery(item.meaningId).includes(normalizedQuery)) {
    keywordScore = Math.max(keywordScore, 3000);
  }

  if (transliteration.includes(normalizedQuery)) {
    keywordScore = Math.max(keywordScore, 2500);
  }

  if (item.relatedWords && item.relatedWords.length > 0) {
    const relatedMatches = item.relatedWords.filter((word) =>
      normalizeQuery(word).includes(normalizedQuery)
    );
    if (relatedMatches.length > 0) {
      keywordScore = Math.max(keywordScore, 1500 + relatedMatches.length * 100);
    }
  }

  if (keywordScore > 0) {
    return { item, score: keywordScore, matchType: 'keyword' };
  }

  // Layer 4: Qutrub database & API suggestions
  if (item.source === 'qutrub') {
    return { item, score: 1000, matchType: 'qutrub' };
  }

  if (item.source === 'api') {
    return { item, score: 500, matchType: 'api' };
  }

  return { item, score: 0, matchType: 'api' };
};

/**
 * Rank dan sort array of suggestions
 * Mengembalikan suggestions yang sudah diurutkan dari paling relevan
 */
export const rankAndSortSuggestions = (
  suggestions: VerbSuggestionItem[],
  query: string,
  commonVerbLookup?: Map<string, CommonVerbItem>
): VerbSuggestionItem[] => {
  const scores = suggestions
    .map((item) => rankSuggestion(item, query, commonVerbLookup))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score);

  return scores.map((result) => result.item);
};

/**
 * Deduplicate suggestions by verb
 * Keeps the highest scoring item for each unique verb
 */
export const deduplicateSuggestions = (
  suggestions: VerbSuggestionItem[],
  query: string
): VerbSuggestionItem[] => {
  const seenVerbs = new Set<string>();
  const ranked = rankAndSortSuggestions(suggestions, query);

  return ranked.filter((item) => {
    if (seenVerbs.has(item.verb)) {
      return false;
    }
    seenVerbs.add(item.verb);
    return true;
  });
};
