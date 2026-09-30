/**
 * verbDatabase.ts
 * Lazy-loading service untuk database verba Arab dari qutrub-master.
 * Memuat ~17.500+ kata kerja dari public/verbdb.json saat pertama kali dicari.
 */

export type FutureTypeKey = 'fatha' | 'dhamma' | 'kasra';

export interface QutrubVerbEntry {
  /** Verba berharakat (vocalized), misal: كَتَبَ */
  v: string;
  /** Verba tanpa harakat (unvocalized), misal: كتب */
  u: string;
  /** Table-base qutrub (nomor wazan), misal: "1", "102", "126" */
  t: string;
  /** Future type: fatha | dhamma | kasra */
  ft: FutureTypeKey;
  /** Label bab/wazan, misal: "Bab I (فَعَلَ - يَفْعُلُ)" */
  b: string;
  /** Apakah kata kerja transitif (متعدٍّ) */
  tr: boolean;
  /** Jenis kata kerja (weak type): salim, ajwaf, naqish, dll */
  wk: string;
  /** Frekuensi kemunculan dalam korpus Arab */
  fr: number;
  /** Panjang akar huruf (3=tsulatsi, 4=ruba'i, dll) */
  ln: number;
}

// Mapping futureType key ke label Arabic
export const FUTURE_TYPE_LABELS: Record<FutureTypeKey, string> = {
  fatha:  'فتحة',
  dhamma: 'ضمة',
  kasra:  'كسرة',
};

// Map dari label Arabic ke FutureTypeKey (untuk kompatibilitas dengan sistem lama)
export const ARABIC_TO_FUTURE_KEY: Record<string, FutureTypeKey> = {
  'فتحة': 'fatha',
  'ضمة':  'dhamma',
  'كسرة': 'kasra',
};

// ============================================================
// State internal
// ============================================================

let _db: QutrubVerbEntry[] | null = null;
let _loading: Promise<QutrubVerbEntry[]> | null = null;

// Indexes untuk pencarian cepat O(1)
let _indexByUnvoc: Map<string, QutrubVerbEntry[]> | null = null;
let _indexByVocal: Map<string, QutrubVerbEntry> | null = null;

// ============================================================
// Loader
// ============================================================

/**
 * Muat database verba dari public/verbdb.json (sekali saja, lalu di-cache).
 */
export async function loadVerbDatabase(): Promise<QutrubVerbEntry[]> {
  if (_db) return _db;
  if (_loading) return _loading;

  _loading = (async () => {
    try {
      const res = await fetch('/verbdb.json');
      if (!res.ok) throw new Error(`Gagal memuat verbdb.json: ${res.status}`);
      const data: QutrubVerbEntry[] = await res.json();
      _db = data;
      _buildIndexes(data);
      console.info(`[VerbDB] Dimuat: ${data.length} kata kerja`);
      return data;
    } catch (e) {
      console.error('[VerbDB] Gagal memuat database:', e);
      _loading = null;
      return [];
    }
  })();

  return _loading;
}

function _buildIndexes(data: QutrubVerbEntry[]) {
  _indexByUnvoc = new Map();
  _indexByVocal = new Map();

  for (const entry of data) {
    // Index by unvocalized (bisa ada banyak wazan untuk satu unvocalized)
    if (!_indexByUnvoc!.has(entry.u)) {
      _indexByUnvoc!.set(entry.u, []);
    }
    _indexByUnvoc!.get(entry.u)!.push(entry);

    // Index by vocalized (umumnya unik)
    if (!_indexByVocal!.has(entry.v)) {
      _indexByVocal!.set(entry.v, entry);
    }
  }
}

// ============================================================
// Query API
// ============================================================

/**
 * Cari verba berdasarkan string Arab tanpa harakat.
 * Mengembalikan semua wazan yang cocok.
 */
export function lookupByUnvocalized(unvoc: string): QutrubVerbEntry[] {
  if (!_indexByUnvoc) return [];
  return _indexByUnvoc.get(unvoc) ?? [];
}

/**
 * Cari verba berdasarkan string Arab berharakat (exactmatch).
 */
export function lookupByVocalized(vocal: string): QutrubVerbEntry | undefined {
  if (!_indexByVocal) return undefined;
  return _indexByVocal.get(vocal);
}

/**
 * Apakah database sudah dimuat?
 */
export function isDatabaseLoaded(): boolean {
  return _db !== null && _db.length > 0;
}

/**
 * Jumlah total kata kerja dalam database.
 */
export function getDatabaseSize(): number {
  return _db?.length ?? 0;
}

// ============================================================
// Arabic normalization helper (strip diacritics)
// ============================================================

const ARABIC_DIACRITICS_RE = /[\u064B-\u065F\u0670]/g;

export function stripDiacritics(text: string): string {
  return text.replace(ARABIC_DIACRITICS_RE, '');
}

/**
 * Normalize teks Arab: strip harakat, alef variants → alef biasa, ta marbuta → ha
 */
export function normalizeArabic(text: string): string {
  return text
    .replace(ARABIC_DIACRITICS_RE, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .trim();
}

// ============================================================
// Full-text search di database (prefix/includes matching)
// ============================================================

/**
 * Cari kata kerja dari database besar berdasarkan query unvocalized Arab.
 * Mendukung: prefix match dan includes match.
 * Mengembalikan maks `limit` hasil, diurutkan frekuensi.
 */
export function searchDatabase(
  query: string,
  limit = 20,
): QutrubVerbEntry[] {
  if (!_db || !query.trim()) return [];

  const norm = normalizeArabic(query.trim());
  if (!norm) return [];

  // Gunakan Set untuk dedup berdasarkan unvocalized
  const seen = new Set<string>();
  const results: QutrubVerbEntry[] = [];

  // Pass 1: exact match
  for (const entry of _db) {
    if (results.length >= limit) break;
    const eu = normalizeArabic(entry.u);
    const ev = normalizeArabic(entry.v);
    if ((eu === norm || ev === norm) && !seen.has(entry.u)) {
      seen.add(entry.u);
      results.push(entry);
    }
  }

  // Pass 2: prefix match
  if (results.length < limit) {
    for (const entry of _db) {
      if (results.length >= limit) break;
      if (seen.has(entry.u)) continue;
      const eu = normalizeArabic(entry.u);
      if (eu.startsWith(norm)) {
        seen.add(entry.u);
        results.push(entry);
      }
    }
  }

  // Pass 3: includes match
  if (results.length < limit) {
    for (const entry of _db) {
      if (results.length >= limit) break;
      if (seen.has(entry.u)) continue;
      const eu = normalizeArabic(entry.u);
      const ev = normalizeArabic(entry.v);
      if (eu.includes(norm) || ev.includes(norm)) {
        seen.add(entry.u);
        results.push(entry);
      }
    }
  }

  return results;
}
