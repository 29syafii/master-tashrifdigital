/**
 * API service for communicating with Tashrif Digital backend
 * Base URL: https://tashrif-digital.vercel.app
 * With seamless offline algorithmic fallback
 */

import {
  ConjugateParams,
  ConjugationResult,
  SuggestResponse,
  ApiErrorResponse,
} from '../types/tashrif';
import { conjugateArabicVerbOffline } from './conjugatorEngine';
import { stripArabicDiacritics, speakArabic } from '../utils/arabicText';

// Re-export utilities
export { stripArabicDiacritics, speakArabic };

const BASE_URL = typeof window !== 'undefined' ? '' : 'https://tashrif-digital.vercel.app';

/**
 * Fetch verb suggestions based on raw unvocalized Arabic query
 * @param query String containing raw Arabic letters (e.g. "صل", "كتب")
 * @param signal Optional AbortSignal for canceling in-flight requests
 */
export async function fetchSuggestions(
  query: string,
  signal?: AbortSignal,
): Promise<string[]> {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  try {
    const url = `${BASE_URL}/suggest?query=${encodeURIComponent(trimmed)}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal,
    });

    if (!response.ok) {
      let errorMsg = `Gagal memuat saran (Status: ${response.status})`;
      try {
        const errorData: ApiErrorResponse = await response.json();
        if (errorData.detail) {
          errorMsg = errorData.detail;
        }
      } catch {
        // fallback
      }
      throw new Error(errorMsg);
    }

    const data: SuggestResponse = await response.json();
    return Array.isArray(data.suggestions) ? data.suggestions : [];
  } catch (error: unknown) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error;
    }
    // Return empty list on network failure to let local dictionary handle suggestions
    return [];
  }
}

/**
 * Fetch full 14 dhamir conjugation table for the selected verb.
 * If server is unreachable, falls back to the built-in offline conjugation engine.
 * @param params Conjugation parameters (verb with harakat, future_type, transitive, passive)
 * @param signal Optional AbortSignal
 */
export async function fetchConjugation(
  params: ConjugateParams,
  signal?: AbortSignal,
): Promise<ConjugationResult> {
  const { verb, future_type, transitive, passive } = params;
  const trimmedVerb = verb.trim();

  if (!trimmedVerb) {
    throw new Error("Parameter 'verb' tidak boleh kosong.");
  }

  const queryParams = new URLSearchParams({
    verb: trimmedVerb,
    future_type: future_type || 'فتحة',
    transitive: String(Boolean(transitive)),
    passive: String(Boolean(passive)),
  });

  const url = `${BASE_URL}/conjugate?${queryParams.toString()}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal,
    });

    if (response.ok) {
      const data: ConjugationResult = await response.json();

      // Sanitize keys in conjugation object (trim whitespace like "المضارع المؤكد الثقيل المجهول ")
      if (data.conjugation && typeof data.conjugation === 'object') {
        const cleanedConjugation: Record<string, Record<string, string>> = {};
        for (const [categoryKey, dhamirMap] of Object.entries(data.conjugation)) {
          const cleanKey = categoryKey.trim();
          cleanedConjugation[cleanKey] = dhamirMap;
        }
        data.conjugation = cleanedConjugation;
        return data;
      }
    }
  } catch (error: unknown) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error;
    }
    // Network or CORS error -> proceed to fallback below
  }

  // Seamless offline fallback: generate full conjugation with internal engine
  try {
    return conjugateArabicVerbOffline(params);
  } catch {
    throw new Error(
      'Gagal menghasilkan konjugasi untuk kata kerja ini. Silakan periksa format kata.',
    );
  }
}
