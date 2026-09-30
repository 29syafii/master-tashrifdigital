import { FutureType } from '../types/tashrif';

export interface CommonVerbItem {
  arabic: string;
  unvocalized: string;
  transliteration: string;
  meaningId: string;
  futureType: FutureType;
  bab?: string;
  keywords: string[];
  relatedWords?: string[];
}

export const COMMON_VERBS: CommonVerbItem[] = [
  {
    arabic: 'كَتَبَ',
    unvocalized: 'كتب',
    transliteration: 'Kataba',
    meaningId: 'Menulis',
    futureType: 'ضمة',
    bab: "Bab 1 (Fa'ala - Yaf'ulu)",
    keywords: ['kataba', 'yaktubu', 'tulis', 'menulis', 'kitab', 'penulis'],
  },
  {
    arabic: 'صَلَّى',
    unvocalized: 'صلى',
    transliteration: 'Shalla',
    meaningId: 'Shalat / Berdoa',
    futureType: 'فتحة',
    bab: "Bab II (Fa''ala)",
    keywords: ['shalla', 'sholat', 'salat', 'shalat', 'berdoa', 'sembahyang'],
  },
  {
    arabic: 'نَصَرَ',
    unvocalized: 'نصر',
    transliteration: 'Nashara',
    meaningId: 'Menolong',
    futureType: 'ضمة',
    bab: "Bab 1 (Fa'ala - Yaf'ulu)",
    keywords: ['nashara', 'nasara', 'menolong', 'bantu', 'pertolongan'],
  },
  {
    arabic: 'ضَرَبَ',
    unvocalized: 'ضرب',
    transliteration: 'Dharaba',
    meaningId: 'Memukul',
    futureType: 'كسرة',
    bab: "Bab 2 (Fa'ala - Yaf'ilu)",
    keywords: ['dharaba', 'doroba', 'daraba', 'memukul', 'pukul', 'menempa'],
  },
  {
    arabic: 'فَتَحَ',
    unvocalized: 'فتح',
    transliteration: 'Fataha',
    meaningId: 'Membuka',
    futureType: 'فتحة',
    bab: "Bab 3 (Fa'ala - Yaf'alu)",
    keywords: ['fataha', 'buka', 'membuka', 'kemenangan', 'fath'],
  },
  {
    arabic: 'عَلِمَ',
    unvocalized: 'علم',
    transliteration: "'Alima",
    meaningId: 'Mengetahui / Mengerti',
    futureType: 'فتحة',
    bab: "Bab 4 (Fa'ila - Yaf'alu)",
    keywords: ['alima', 'ilmu', 'mengetahui', 'tahu', 'mengerti', 'paham'],
  },
  {
    arabic: 'قَالَ',
    unvocalized: 'قال',
    transliteration: 'Qaala',
    meaningId: 'Berkata / Mengatakan',
    futureType: 'ضمة',
    bab: 'Ajwaf Wawi',
    keywords: ['qaala', 'qala', 'berkata', 'bicara', 'mengatakan', 'ucap'],
  },
  {
    arabic: 'وَعَدَ',
    unvocalized: 'وعد',
    transliteration: "Wa'ada",
    meaningId: 'Berjanji',
    futureType: 'كسرة',
    bab: 'Mitsal Wawi',
    keywords: ['waada', "wa'ada", 'janji', 'berjanji', 'wacana'],
  },
  {
    arabic: 'قَرَأَ',
    unvocalized: 'قرأ',
    transliteration: "Qara'a",
    meaningId: 'Membaca',
    futureType: 'فتحة',
    bab: 'Mahmuz Lam',
    keywords: ['qaraa', "qara'a", 'membaca', 'baca', 'bacaan'],
  },
  {
    arabic: 'جَلَسَ',
    unvocalized: 'جلس',
    transliteration: 'Jalasa',
    meaningId: 'Duduk',
    futureType: 'كسرة',
    bab: "Bab 2 (Fa'ala - Yaf'ilu)",
    keywords: ['jalasa', 'duduk', 'majelis', 'sidang'],
  },
  {
    arabic: 'دَخَلَ',
    unvocalized: 'دخل',
    transliteration: 'Dakhala',
    meaningId: 'Masuk',
    futureType: 'ضمة',
    bab: "Bab 1 (Fa'ala - Yaf'ulu)",
    keywords: ['dakhala', 'masuk', 'memasuki', 'masukan'],
  },
  {
    arabic: 'خَرَجَ',
    unvocalized: 'خرج',
    transliteration: 'Kharaja',
    meaningId: 'Keluar',
    futureType: 'ضمة',
    bab: "Bab 1 (Fa'ala - Yaf'ulu)",
    keywords: ['kharaja', 'keluar', 'meninggalkan', 'luar'],
  },
  {
    arabic: 'ذَهَبَ',
    unvocalized: 'ذهب',
    transliteration: 'Dzahaba',
    meaningId: 'Pergi / Berangkat',
    futureType: 'فتحة',
    bab: "Bab 3 (Fa'ala - Yaf'alu)",
    keywords: ['dzahaba', 'zahaba', 'pergi', 'berangkat', 'jalan'],
  },
  {
    arabic: 'أَكَلَ',
    unvocalized: 'أكل',
    transliteration: 'Akala',
    meaningId: 'Makan',
    futureType: 'ضمة',
    bab: 'Mahmuz Fa',
    keywords: ['akala', 'makan', 'memakan', 'santap'],
  },
  {
    arabic: 'شَرِبَ',
    unvocalized: 'شرب',
    transliteration: 'Syariba',
    meaningId: 'Minum',
    futureType: 'فتحة',
    bab: "Bab 4 (Fa'ila - Yaf'alu)",
    keywords: ['syariba', 'minum', 'meminum', 'minuman'],
  },
  {
    arabic: 'سَمِعَ',
    unvocalized: 'سمع',
    transliteration: "Sami'a",
    meaningId: 'Mendengar',
    futureType: 'فتحة',
    bab: "Bab 4 (Fa'ila - Yaf'alu)",
    keywords: ['samia', "sami'a", 'mendengar', 'dengar'],
  },
  {
    arabic: 'نَظَرَ',
    unvocalized: 'نظر',
    transliteration: 'Nazhara',
    meaningId: 'Melihat / Memandang',
    futureType: 'ضمة',
    bab: "Bab 1 (Fa'ala - Yaf'ulu)",
    keywords: ['nazhara', 'melihat', 'memandang', 'tinjau'],
  },
  {
    arabic: 'سَجَدَ',
    unvocalized: 'سجد',
    transliteration: 'Sajada',
    meaningId: 'Sujud',
    futureType: 'ضمة',
    bab: "Bab 1 (Fa'ala - Yaf'ulu)",
    keywords: ['sajada', 'sujud', 'bersujud', 'masjid'],
  },
  {
    arabic: 'حَمِدَ',
    unvocalized: 'حمد',
    transliteration: 'Hamida',
    meaningId: 'Memuji',
    futureType: 'فتحة',
    bab: "Bab 4 (Fa'ila - Yaf'alu)",
    keywords: ['hamida', 'memuji', 'puji', 'tahmid'],
  },
  {
    arabic: 'شَكَرَ',
    unvocalized: 'شكر',
    transliteration: 'Syakara',
    meaningId: 'Bersyukur / Berterima kasih',
    futureType: 'ضمة',
    bab: "Bab 1 (Fa'ala - Yaf'ulu)",
    keywords: ['syakara', 'syukur', 'terima kasih', 'bersyukur'],
  },
  {
    arabic: 'غَفَرَ',
    unvocalized: 'غفر',
    transliteration: 'Ghafara',
    meaningId: 'Mengampuni',
    futureType: 'كسرة',
    bab: "Bab 2 (Fa'ala - Yaf'ilu)",
    keywords: ['ghafara', 'ampun', 'mengampuni', 'maghfirah'],
  },
  {
    arabic: 'رَجَعَ',
    unvocalized: 'رجع',
    transliteration: "Raja'a",
    meaningId: 'Kembali / Pulang',
    futureType: 'كسرة',
    bab: "Bab 2 (Fa'ala - Yaf'ilu)",
    keywords: ['rajaa', "raja'a", 'kembali', 'pulang', 'rujuk'],
  },
  {
    arabic: 'عَمِلَ',
    unvocalized: 'عمل',
    transliteration: "'Amila",
    meaningId: 'Bekerja / Berbuat',
    futureType: 'فتحة',
    bab: "Bab 4 (Fa'ila - Yaf'alu)",
    keywords: ['amila', "'amila", 'bekerja', 'amal', 'berbuat'],
  },
  {
    arabic: 'فَهِمَ',
    unvocalized: 'فهم',
    transliteration: 'Fahima',
    meaningId: 'Memahami / Mengerti',
    futureType: 'فتحة',
    bab: "Bab 4 (Fa'ila - Yaf'alu)",
    keywords: ['fahima', 'paham', 'memahami', 'mengerti'],
  },
  {
    arabic: 'حَفِظَ',
    unvocalized: 'حفظ',
    transliteration: 'Hafizha',
    meaningId: 'Menghafal / Menjaga',
    futureType: 'فتحة',
    bab: "Bab 4 (Fa'ila - Yaf'alu)",
    keywords: ['hafizha', 'hafal', 'menghafal', 'menjaga', 'hafizh'],
  },
  {
    arabic: 'خَلَقَ',
    unvocalized: 'خلق',
    transliteration: 'Khalaqa',
    meaningId: 'Menciptakan',
    futureType: 'ضمة',
    bab: "Bab 1 (Fa'ala - Yaf'ulu)",
    keywords: ['khalaqa', 'mencipta', 'cipta', 'khalik'],
  },
  {
    arabic: 'رَزَقَ',
    unvocalized: 'رزق',
    transliteration: 'Razaqa',
    meaningId: 'Memberi Rezeki',
    futureType: 'ضمة',
    bab: "Bab 1 (Fa'ala - Yaf'ulu)",
    keywords: ['razaqa', 'rezeki', 'memberi makan', 'nafkah'],
  },
  {
    arabic: 'أَمَرَ',
    unvocalized: 'أمر',
    transliteration: 'Amara',
    meaningId: 'Memerintah / Menyuruh',
    futureType: 'ضمة',
    bab: 'Mahmuz Fa',
    keywords: ['amara', 'perintah', 'menyuruh', 'instruksi'],
  },
  {
    arabic: 'نَهَى',
    unvocalized: 'نهى',
    transliteration: 'Nahaa',
    meaningId: 'Melarang / Mencegah',
    futureType: 'فتحة',
    bab: "Naqish Ya'i",
    keywords: ['nahaa', 'naha', 'larang', 'melarang', 'mencegah'],
  },
  {
    arabic: 'قَامَ',
    unvocalized: 'قام',
    transliteration: 'Qaama',
    meaningId: 'Berdiri / Bangkit',
    futureType: 'ضمة',
    bab: 'Ajwaf Wawi',
    keywords: ['qaama', 'qama', 'berdiri', 'bangkit', 'tegak'],
  },
  {
    arabic: 'نَامَ',
    unvocalized: 'نام',
    transliteration: 'Naama',
    meaningId: 'Tidur',
    futureType: 'فتحة',
    bab: 'Ajwaf Wawi',
    keywords: ['naama', 'nama', 'tidur', 'terlelap'],
  },
  {
    arabic: 'صَامَ',
    unvocalized: 'صام',
    transliteration: 'Shaama',
    meaningId: 'Berpuasa',
    futureType: 'ضمة',
    bab: 'Ajwaf Wawi',
    keywords: ['shaama', 'shama', 'puasa', 'berpuasa', 'shaum'],
  },
  {
    arabic: 'دَعَا',
    unvocalized: 'دعا',
    transliteration: "Da'aa",
    meaningId: 'Berdoa / Menyeru',
    futureType: 'ضمة',
    bab: 'Naqish Wawi',
    keywords: ['daa', "da'aa", 'doa', 'berdoa', 'menyeru', 'dakwah'],
  },
  {
    arabic: 'هَدَى',
    unvocalized: 'هدى',
    transliteration: 'Hadaa',
    meaningId: 'Memberi Petunjuk',
    futureType: 'كسرة',
    bab: "Naqish Ya'i",
    keywords: ['hadaa', 'petunjuk', 'hidayah', 'membimbing'],
  },
  {
    arabic: 'عَلَّمَ',
    unvocalized: 'علم',
    transliteration: "'Allama",
    meaningId: 'Mengajarkan',
    futureType: 'فتحة',
    bab: "Bab II (Taf'il)",
    keywords: ['allama', 'mengajar', 'mendidik', 'guru'],
  },
  {
    arabic: 'تَعَلَّمَ',
    unvocalized: 'تعلم',
    transliteration: "Ta'allama",
    meaningId: 'Belajar',
    futureType: 'فتحة',
    bab: "Bab V (Tafa''ul)",
    keywords: ['taallama', "ta'allama", 'belajar', 'menuntut ilmu'],
  },
  {
    arabic: 'جَاهَدَ',
    unvocalized: 'جاهد',
    transliteration: 'Jaahada',
    meaningId: 'Berjuang / Bersungguh-sungguh',
    futureType: 'فتحة',
    bab: "Bab III (Mufa'alah)",
    keywords: ['jaahada', 'jihad', 'berjuang', 'sungguh'],
  },
  {
    arabic: 'أَسْلَمَ',
    unvocalized: 'أسلم',
    transliteration: 'Aslama',
    meaningId: 'Berserah diri / Masuk Islam',
    futureType: 'ضمة',
    bab: "Bab IV (If'al)",
    keywords: ['aslama', 'islam', 'berserah', 'tunduk'],
  },
  {
    arabic: 'اسْتَغْفَرَ',
    unvocalized: 'استغفر',
    transliteration: 'Istaghfara',
    meaningId: 'Memohon Ampunan',
    futureType: 'كسرة',
    bab: "Bab X (Istif'al)",
    keywords: ['istighfar', 'istaghfara', 'mohon ampun'],
  },
];

const normalizeSearchKeyword = (value: string): string => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
};

const buildRelatedWords = (item: CommonVerbItem, query: string): string[] => {
  const normalizedQuery = normalizeSearchKeyword(query);
  if (!normalizedQuery) {
    return [];
  }

  const relatedWords = item.keywords
    .map((word) => word.trim())
    .filter((word) => {
      const normalizedWord = normalizeSearchKeyword(word);
      if (!normalizedWord || normalizedWord === normalizedQuery) {
        return false;
      }
      return normalizedWord.includes(normalizedQuery) || normalizedQuery.includes(normalizedWord);
    })
    .slice(0, 5);

  return Array.from(new Set(relatedWords));
};

/**
 * Flexible search helper matching Arabic unvocalized, vocalized, Latin transliteration, or Indonesian meaning.
 * Also surfaces related words / derivatives from each verb's keyword list to support richer suggestions.
 */
export function searchCommonVerbs(rawQuery: string): CommonVerbItem[] {
  const query = normalizeSearchKeyword(rawQuery);
  if (!query) return [];

  const matchedItems: CommonVerbItem[] = [];

  for (const item of COMMON_VERBS) {
    const haystacks = [
      item.arabic,
      item.unvocalized,
      item.transliteration,
      item.meaningId,
      ...item.keywords,
    ].map(normalizeSearchKeyword);

    if (haystacks.some((value) => value.includes(query))) {
      matchedItems.push({
        ...item,
        relatedWords: buildRelatedWords(item, query),
      });
    }
  }

  return matchedItems.sort((a, b) => {
    const aScore = [a.unvocalized, a.arabic, a.transliteration, a.meaningId, ...a.keywords]
      .map(normalizeSearchKeyword)
      .filter((value) => value.includes(query)).length;
    const bScore = [b.unvocalized, b.arabic, b.transliteration, b.meaningId, ...b.keywords]
      .map(normalizeSearchKeyword)
      .filter((value) => value.includes(query)).length;
    return bScore - aScore;
  });
}
