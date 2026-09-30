/**
 * Utility functions for Arabic text shaping, harakat decomposition, and pronunciation.
 */

// Arabic diacritic / harakat Unicode range (Fathah, Dammah, Kasrah, Sukun, Shaddah, Tanwin, Alif Khanjariyah)
export const HARAKAT_REGEX = /[\u064B-\u065F\u0670]/;

export interface HarakatRun {
  chars: string;
  isHarakat: boolean;
}

/**
 * Memecah string Arab menjadi runtun (runs) karakter yang berurutan,
 * dikelompokkan berdasarkan apakah karakter itu harokat atau huruf dasar.
 * Huruf dasar TIDAK PERNAH terpecah di tengah — hanya terpisah pada titik
 * yang memang sudah ada harokatnya — sehingga sambungan huruf Arab
 * (initial/medial/final form) tetap utuh saat dirender per-span.
 * Harokat berurutan (misal: syaddah + fathah pada كَتَّبَ) digabungkan dalam satu run.
 */
export function splitByHarakat(text: string): HarakatRun[] {
  if (!text) return [];
  const runs: HarakatRun[] = [];
  for (const ch of text) {
    const isHarakat = HARAKAT_REGEX.test(ch);
    const last = runs[runs.length - 1];
    if (last && last.isHarakat === isHarakat) {
      last.chars += ch;
    } else {
      runs.push({ chars: ch, isHarakat });
    }
  }
  return runs;
}

/**
 * Menghilangkan harakat / diakritik Arab untuk keperluan pencarian,
 * perbandingan kata, dan normalisasi. JANGAN dipakai untuk rendering visual harokat merah!
 */
export function stripArabicDiacritics(text: string): string {
  if (!text) return '';
  return text.replace(/[\u064B-\u065F\u0670]/g, '');
}

/**
 * Normalisasi karakter Arab untuk pencarian fleksibel
 * (menyamakan alif berhamzah, ta marbuthah, alif maqshurah)
 */
export function normalizeArabic(text: string): string {
  if (!text) return '';
  return stripArabicDiacritics(text)
    .replace(/[أإآء]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .trim();
}

/**
 * Mengecek apakah teks mengandung karakter alfabet Arab
 */
export function containsArabic(text: string): boolean {
  return /[\u0600-\u06FF]/.test(text);
}

/**
 * Pelafalan teks bahasa Arab menggunakan Web Speech Synthesis API
 */
export function speakArabic(text: string): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.85;

    const voices = window.speechSynthesis.getVoices();
    const arabicVoice = voices.find((v) => v.lang.startsWith('ar'));
    if (arabicVoice) {
      utterance.voice = arabicVoice;
    }

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.warn('Speech synthesis failed:', err);
    return false;
  }
}
