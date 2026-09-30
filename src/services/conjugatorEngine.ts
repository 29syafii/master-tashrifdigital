/**
 * Offline & Algorithmic Arabic Conjugation Engine for Master Tashrif Digital.
 * Handles regular sound triliteral verbs (tsulatsi mujarrad) across all
 * 12 categories/wazans × 14 dhamir with full, precise Arabic vocalization (harakat).
 */

import { ConjugateParams, ConjugationResult, FutureType } from '../types/tashrif';
import { stripArabicDiacritics } from '../utils/arabicText';

interface TriliteralRoot {
  c1: string;
  c2: string;
  c3: string;
  pastC2Vowel: 'َ' | 'ِ' | 'ُ';
}

/**
 * Extract root consonants and past middle vowel from an input Arabic verb
 */
function extractTriliteralRoot(verb: string): TriliteralRoot {
  const clean = stripArabicDiacritics(verb);

  // If already exactly 3 letters
  if (clean.length === 3) {
    const c1 = clean[0];
    const c2 = clean[1];
    const c3 = clean[2];

    // Detect if original input had a middle vowel (kasrah or dhammah)
    let pastC2Vowel: 'َ' | 'ِ' | 'ُ' = 'َ';
    if (verb.includes('ِ') || verb.includes(c2 + 'ِ')) {
      pastC2Vowel = 'ِ';
    } else if (verb.includes('ُ') || verb.includes(c2 + 'ُ')) {
      pastC2Vowel = 'ُ';
    }

    return { c1, c2, c3, pastC2Vowel };
  }

  // Fallback defaults for words like قال, دعا, etc.
  return {
    c1: clean[0] || 'ف',
    c2: clean[1] || 'ع',
    c3: clean[2] || 'ل',
    pastC2Vowel: 'َ',
  };
}

/**
 * Converts future_type label to corresponding Arabic harakat
 */
function getFutureVowel(futureType: FutureType): 'َ' | 'ُ' | 'ِ' {
  if (futureType === 'ضمة') return 'ُ';
  if (futureType === 'كسرة') return 'ِ';
  return 'َ';
}

/**
 * Compute the full 12 Wazan × 14 Dhamir conjugation matrix offline
 */
export function conjugateArabicVerbOffline(params: ConjugateParams): ConjugationResult {
  const { verb, future_type, transitive, passive } = params;
  const root = extractTriliteralRoot(verb);
  const { c1, c2, c3, pastC2Vowel } = root;
  const fv = getFutureVowel(future_type); // Harakat 'Ain Fi'il Mudhari'

  // Imperative prefix hamzah harakat (if future vowel is dhammah, hamzah has dhammah; otherwise kasrah)
  const amrPrefix = fv === 'ُ' ? 'اُ' : 'اِ';

  const conjugation: Record<string, Record<string, string>> = {
    // 1. الماضي المعلوم
    'الماضي المعلوم': {
      أنا: `${c1}َ${c2}${pastC2Vowel}${c3}ْتُ`,
      نحن: `${c1}َ${c2}${pastC2Vowel}${c3}ْنَا`,
      أنت: `${c1}َ${c2}${pastC2Vowel}${c3}ْتَ`,
      'أنتِ': `${c1}َ${c2}${pastC2Vowel}${c3}ْتِ`,
      أنتما: `${c1}َ${c2}${pastC2Vowel}${c3}ْتُمَا`,
      'أنتما مؤ': `${c1}َ${c2}${pastC2Vowel}${c3}ْتُمَا`,
      أنتم: `${c1}َ${c2}${pastC2Vowel}${c3}ْتُمْ`,
      أنتن: `${c1}َ${c2}${pastC2Vowel}${c3}ْتُنَّ`,
      هو: `${c1}َ${c2}${pastC2Vowel}${c3}َ`,
      هي: `${c1}َ${c2}${pastC2Vowel}${c3}َتْ`,
      هما: `${c1}َ${c2}${pastC2Vowel}${c3}َا`,
      'هما مؤ': `${c1}َ${c2}${pastC2Vowel}${c3}َتَا`,
      هم: `${c1}َ${c2}${pastC2Vowel}${c3}ُوا`,
      هن: `${c1}َ${c2}${pastC2Vowel}${c3}ْنَ`,
    },

    // 2. الماضي المجهول (didhammah huruf awal, dikasrah huruf sebelum akhir)
    'الماضي المجهول': passive
      ? {
          أنا: `${c1}ُ${c2}ِ${c3}ْتُ`,
          نحن: `${c1}ُ${c2}ِ${c3}ْنَا`,
          أنت: `${c1}ُ${c2}ِ${c3}ْتَ`,
          'أنتِ': `${c1}ُ${c2}ِ${c3}ْتِ`,
          أنتما: `${c1}ُ${c2}ِ${c3}ْتُمَا`,
          'أنتما مؤ': `${c1}ُ${c2}ِ${c3}ْتُمَا`,
          أنتم: `${c1}ُ${c2}ِ${c3}ْتُمْ`,
          أنتن: `${c1}ُ${c2}ِ${c3}ْتُنَّ`,
          هو: `${c1}ُ${c2}ِ${c3}َ`,
          هي: `${c1}ُ${c2}ِ${c3}َتْ`,
          هما: `${c1}ُ${c2}ِ${c3}َا`,
          'هما مؤ': `${c1}ُ${c2}ِ${c3}َتَا`,
          هم: `${c1}ُ${c2}ِ${c3}ُوا`,
          هن: `${c1}ُ${c2}ِ${c3}ْنَ`,
        }
      : {},

    // 3. المضارع المعلوم
    'المضارع المعلوم': {
      أنا: `أَ${c1}ْ${c2}${fv}${c3}ُ`,
      نحن: `نَ${c1}ْ${c2}${fv}${c3}ُ`,
      أنت: `تَ${c1}ْ${c2}${fv}${c3}ُ`,
      'أنتِ': `تَ${c1}ْ${c2}${fv}${c3}ِينَ`,
      أنتما: `تَ${c1}ْ${c2}${fv}${c3}َانِ`,
      'أنتما مؤ': `تَ${c1}ْ${c2}${fv}${c3}َانِ`,
      أنتم: `تَ${c1}ْ${c2}${fv}${c3}ُونَ`,
      أنتن: `تَ${c1}ْ${c2}${fv}${c3}ْنَ`,
      هو: `يَ${c1}ْ${c2}${fv}${c3}ُ`,
      هي: `تَ${c1}ْ${c2}${fv}${c3}ُ`,
      هما: `يَ${c1}ْ${c2}${fv}${c3}َانِ`,
      'هما مؤ': `تَ${c1}ْ${c2}${fv}${c3}َانِ`,
      هم: `يَ${c1}ْ${c2}${fv}${c3}ُونَ`,
      هن: `يَ${c1}ْ${c2}${fv}${c3}ْنَ`,
    },

    // 4. المضارع المجهول
    'المضارع المجهول': passive
      ? {
          أنا: `أُ${c1}ْ${c2}َ${c3}ُ`,
          نحن: `نُ${c1}ْ${c2}َ${c3}ُ`,
          أنت: `تُ${c1}ْ${c2}َ${c3}ُ`,
          'أنتِ': `تُ${c1}ْ${c2}َ${c3}ِينَ`,
          أنتما: `تُ${c1}ْ${c2}َ${c3}َانِ`,
          'أنتما مؤ': `تُ${c1}ْ${c2}َ${c3}َانِ`,
          أنتم: `تُ${c1}ْ${c2}َ${c3}ُونَ`,
          أنتن: `تُ${c1}ْ${c2}َ${c3}ْنَ`,
          هو: `يُ${c1}ْ${c2}َ${c3}ُ`,
          هي: `تُ${c1}ْ${c2}َ${c3}ُ`,
          هما: `يُ${c1}ْ${c2}َ${c3}َانِ`,
          'هما مؤ': `تُ${c1}ْ${c2}َ${c3}َانِ`,
          هم: `يُ${c1}ْ${c2}َ${c3}ُونَ`,
          هن: `يُ${c1}ْ${c2}َ${c3}ْنَ`,
        }
      : {},

    // 5. المضارع المجزوم
    'المضارع المجزوم': {
      أنا: `لَمْ أَ${c1}ْ${c2}${fv}${c3}ْ`,
      نحن: `لَمْ نَ${c1}ْ${c2}${fv}${c3}ْ`,
      أنت: `لَمْ تَ${c1}ْ${c2}${fv}${c3}ْ`,
      'أنتِ': `لَمْ تَ${c1}ْ${c2}${fv}${c3}ِي`,
      أنتما: `لَمْ تَ${c1}ْ${c2}${fv}${c3}َا`,
      'أنتما مؤ': `لَمْ تَ${c1}ْ${c2}${fv}${c3}َا`,
      أنتم: `لَمْ تَ${c1}ْ${c2}${fv}${c3}ُوا`,
      أنتن: `لَمْ تَ${c1}ْ${c2}${fv}${c3}ْنَ`,
      هو: `لَمْ يَ${c1}ْ${c2}${fv}${c3}ْ`,
      هي: `لَمْ تَ${c1}ْ${c2}${fv}${c3}ْ`,
      هما: `لَمْ يَ${c1}ْ${c2}${fv}${c3}َا`,
      'هما مؤ': `لَمْ تَ${c1}ْ${c2}${fv}${c3}َا`,
      هم: `لَمْ يَ${c1}ْ${c2}${fv}${c3}ُوا`,
      هن: `لَمْ يَ${c1}ْ${c2}${fv}${c3}ْنَ`,
    },

    // 6. المضارع المنصوب
    'المضارع المنصوب': {
      أنا: `لَنْ أَ${c1}ْ${c2}${fv}${c3}َ`,
      نحن: `لَنْ نَ${c1}ْ${c2}${fv}${c3}َ`,
      أنت: `لَنْ تَ${c1}ْ${c2}${fv}${c3}َ`,
      'أنتِ': `لَنْ تَ${c1}ْ${c2}${fv}${c3}ِي`,
      أنتما: `لَنْ تَ${c1}ْ${c2}${fv}${c3}َا`,
      'أنتما مؤ': `لَنْ تَ${c1}ْ${c2}${fv}${c3}َا`,
      أنتم: `لَنْ تَ${c1}ْ${c2}${fv}${c3}ُوا`,
      أنتن: `لَنْ تَ${c1}ْ${c2}${fv}${c3}ْنَ`,
      هو: `لَنْ يَ${c1}ْ${c2}${fv}${c3}َ`,
      هي: `لَنْ تَ${c1}ْ${c2}${fv}${c3}َ`,
      هما: `لَنْ يَ${c1}ْ${c2}${fv}${c3}َا`,
      'هما مؤ': `لَنْ تَ${c1}ْ${c2}${fv}${c3}َا`,
      هم: `لَنْ يَ${c1}ْ${c2}${fv}${c3}ُوا`,
      هن: `لَنْ يَ${c1}ْ${c2}${fv}${c3}ْنَ`,
    },

    // 7. المضارع المؤكد الثقيل
    'المضارع المؤكد الثقيل': {
      أنا: `لَأَ${c1}ْ${c2}${fv}${c3}َنَّ`,
      نحن: `لَنَ${c1}ْ${c2}${fv}${c3}َنَّ`,
      أنت: `لَتَ${c1}ْ${c2}${fv}${c3}َنَّ`,
      'أنتِ': `لَتَ${c1}ْ${c2}${fv}${c3}ِنَّ`,
      أنتما: `لَتَ${c1}ْ${c2}${fv}${c3}َانِّ`,
      'أنتما مؤ': `لَتَ${c1}ْ${c2}${fv}${c3}َانِّ`,
      أنتم: `لَتَ${c1}ْ${c2}${fv}${c3}ُنَّ`,
      أنتن: `لَتَ${c1}ْ${c2}${fv}${c3}ْنَانِّ`,
      هو: `لَيَ${c1}ْ${c2}${fv}${c3}َنَّ`,
      هي: `لَتَ${c1}ْ${c2}${fv}${c3}َنَّ`,
      هما: `لَيَ${c1}ْ${c2}${fv}${c3}َانِّ`,
      'هما مؤ': `لَتَ${c1}ْ${c2}${fv}${c3}َانِّ`,
      هم: `لَيَ${c1}ْ${c2}${fv}${c3}ُنَّ`,
      هن: `لَيَ${c1}ْ${c2}${fv}${c3}ْنَانِّ`,
    },

    // 8. الأمر (khusus 6 dhamir mukhatab; selainnya KOSONG -> dirender sebagai "—")
    'الأمر': {
      أنا: '',
      نحن: '',
      أنت: `${amrPrefix}${c1}ْ${c2}${fv}${c3}ْ`,
      'أنتِ': `${amrPrefix}${c1}ْ${c2}${fv}${c3}ِي`,
      أنتما: `${amrPrefix}${c1}ْ${c2}${fv}${c3}َا`,
      'أنتما مؤ': `${amrPrefix}${c1}ْ${c2}${fv}${c3}َا`,
      أنتم: `${amrPrefix}${c1}ْ${c2}${fv}${c3}ُوا`,
      أنتن: `${amrPrefix}${c1}ْ${c2}${fv}${c3}ْنَ`,
      هو: '',
      هي: '',
      هما: '',
      'هما مؤ': '',
      هم: '',
      هن: '',
    },

    // 9. الأمر المؤكد (khusus 6 dhamir mukhatab; selainnya KOSONG -> dirender sebagai "—")
    'الأمر المؤكد': {
      أنا: '',
      نحن: '',
      أنت: `${amrPrefix}${c1}ْ${c2}${fv}${c3}َنَّ`,
      'أنتِ': `${amrPrefix}${c1}ْ${c2}${fv}${c3}ِنَّ`,
      أنتما: `${amrPrefix}${c1}ْ${c2}${fv}${c3}َانِّ`,
      'أنتما مؤ': `${amrPrefix}${c1}ْ${c2}${fv}${c3}َانِّ`,
      أنتم: `${amrPrefix}${c1}ْ${c2}${fv}${c3}ُنَّ`,
      أنتن: `${amrPrefix}${c1}ْ${c2}${fv}${c3}ْنَانِّ`,
      هو: '',
      هي: '',
      هما: '',
      'هما مؤ': '',
      هم: '',
      هن: '',
    },

    // 10. المضارع المجهول المجزوم
    'المضارع المجهول المجزوم': passive
      ? {
          أنا: `لَمْ أُ${c1}ْ${c2}َ${c3}ْ`,
          نحن: `لَمْ نُ${c1}ْ${c2}َ${c3}ْ`,
          أنت: `لَمْ تُ${c1}ْ${c2}َ${c3}ْ`,
          'أنتِ': `لَمْ تُ${c1}ْ${c2}َ${c3}ِي`,
          أنتما: `لَمْ تُ${c1}ْ${c2}َ${c3}َا`,
          'أنتما مؤ': `لَمْ تُ${c1}ْ${c2}َ${c3}َا`,
          أنتم: `لَمْ تُ${c1}ْ${c2}َ${c3}ُوا`,
          أنتن: `لَمْ تُ${c1}ْ${c2}َ${c3}ْنَ`,
          هو: `لَمْ يُ${c1}ْ${c2}َ${c3}ْ`,
          هي: `لَمْ تُ${c1}ْ${c2}َ${c3}ْ`,
          هما: `لَمْ يُ${c1}ْ${c2}َ${c3}َا`,
          'هما مؤ': `لَمْ تُ${c1}ْ${c2}َ${c3}َا`,
          هم: `لَمْ يُ${c1}ْ${c2}َ${c3}ُوا`,
          هن: `لَمْ يُ${c1}ْ${c2}َ${c3}ْنَ`,
        }
      : {},

    // 11. المضارع المجهول المنصوب
    'المضارع المجهول المنصوب': passive
      ? {
          أنا: `لَنْ أُ${c1}ْ${c2}َ${c3}َ`,
          نحن: `لَنْ نُ${c1}ْ${c2}َ${c3}َ`,
          أنت: `لَنْ تُ${c1}ْ${c2}َ${c3}َ`,
          'أنتِ': `لَنْ تُ${c1}ْ${c2}َ${c3}ِي`,
          أنتما: `لَنْ تُ${c1}ْ${c2}َ${c3}َا`,
          'أنتما مؤ': `لَنْ تُ${c1}ْ${c2}َ${c3}َا`,
          أنتم: `لَنْ تُ${c1}ْ${c2}َ${c3}ُوا`,
          أنتن: `لَنْ تُ${c1}ْ${c2}َ${c3}ْنَ`,
          هو: `لَنْ يُ${c1}ْ${c2}َ${c3}َ`,
          هي: `لَنْ تُ${c1}ْ${c2}َ${c3}َ`,
          هما: `لَنْ يُ${c1}ْ${c2}َ${c3}َا`,
          'هما مؤ': `لَنْ تُ${c1}ْ${c2}َ${c3}َا`,
          هم: `لَنْ يُ${c1}ْ${c2}َ${c3}ُوا`,
          هن: `لَنْ يُ${c1}ْ${c2}َ${c3}ْنَ`,
        }
      : {},

    // 12. المضارع المؤكد الثقيل المجهول
    'المضارع المؤكد الثقيل المجهول': passive
      ? {
          أنا: `لَأُ${c1}ْ${c2}َ${c3}َنَّ`,
          نحن: `لَنُ${c1}ْ${c2}َ${c3}َنَّ`,
          أنت: `لَتُ${c1}ْ${c2}َ${c3}َنَّ`,
          'أنتِ': `لَتُ${c1}ْ${c2}َ${c3}ِنَّ`,
          أنتما: `لَتُ${c1}ْ${c2}َ${c3}َانِّ`,
          'أنتما مؤ': `لَتُ${c1}ْ${c2}َ${c3}َانِّ`,
          أنتم: `لَتُ${c1}ْ${c2}َ${c3}ُنَّ`,
          أنتن: `لَتُ${c1}ْ${c2}َ${c3}ْنَانِّ`,
          هو: `لَيُ${c1}ْ${c2}َ${c3}َنَّ`,
          هي: `لَتُ${c1}ْ${c2}َ${c3}َنَّ`,
          هما: `لَيُ${c1}ْ${c2}َ${c3}َانِّ`,
          'هما مؤ': `لَتُ${c1}ْ${c2}َ${c3}َانِّ`,
          هم: `لَيُ${c1}ْ${c2}َ${c3}ُنَّ`,
          هن: `لَيُ${c1}ْ${c2}َ${c3}ْنَانِّ`,
        }
      : {},
  };

  return {
    verb: `${c1}َ${c2}${pastC2Vowel}${c3}َ`,
    future_type: future_type || 'فتحة',
    transitive: Boolean(transitive),
    conjugation,
  };
}
