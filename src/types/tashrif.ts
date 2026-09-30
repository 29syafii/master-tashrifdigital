/**
 * Types and definitions for Tashrif Digital
 */

export type FutureType = 'فتحة' | 'ضمة' | 'كسرة';

export type TextScale = 'sm' | 'md' | 'lg' | 'xl';
export type ArabicFontFamily = 'noto' | 'amiri' | 'scheherazade';

export interface TypographySettings {
  scale: TextScale;
  fontFamily: ArabicFontFamily;
  coloredHarakat: boolean;
  autoDirection: boolean;
}

export interface VerbSuggestionItem {
  verb: string;
  futureType?: FutureType;
  meaningId?: string;
  transliteration?: string;
  relatedWords?: string[];
  source: 'api' | 'dictionary' | 'qutrub';
  bab?: string;
  transitive?: boolean;
}

export interface SuggestResponse {
  query: string;
  suggestions: string[];
}

export interface ConjugateParams {
  verb: string;
  future_type: FutureType;
  transitive: boolean;
  passive: boolean;
}

export interface ConjugationResult {
  verb: string;
  future_type: string;
  transitive: boolean;
  conjugation: Record<string, Record<string, string>>;
}

export interface ApiErrorResponse {
  detail?: string;
  message?: string;
}

export interface PronounInfo {
  key: string;
  arabicName: string;
  meaningId: string;
  person: '1st' | '2nd' | '3rd';
  gender: 'masc' | 'fem' | 'common';
  number: 'singular' | 'dual' | 'plural';
}

/**
 * Ordered list of 14 standard Arabic pronouns (dhamir) in classical grammar order
 */
export const PRONOUN_ORDER: PronounInfo[] = [
  // Gha'ib (3rd person masculine)
  { key: 'هو', arabicName: 'هُوَ', meaningId: 'Dia (1 Laki-laki)', person: '3rd', gender: 'masc', number: 'singular' },
  { key: 'هما', arabicName: 'هُمَا', meaningId: 'Mereka berdua (Laki-laki)', person: '3rd', gender: 'masc', number: 'dual' },
  { key: 'هم', arabicName: 'هُمْ', meaningId: 'Mereka (Laki-laki jamak)', person: '3rd', gender: 'masc', number: 'plural' },
  
  // Gha'ibah (3rd person feminine)
  { key: 'هي', arabicName: 'هِيَ', meaningId: 'Dia (1 Perempuan)', person: '3rd', gender: 'fem', number: 'singular' },
  { key: 'هما مؤ', arabicName: 'هُمَا (مؤ)', meaningId: 'Mereka berdua (Perempuan)', person: '3rd', gender: 'fem', number: 'dual' },
  { key: 'هن', arabicName: 'هُنَّ', meaningId: 'Mereka (Perempuan jamak)', person: '3rd', gender: 'fem', number: 'plural' },
  
  // Mukhatab (2nd person masculine)
  { key: 'أنت', arabicName: 'أَنْتَ', meaningId: 'Kamu (1 Laki-laki)', person: '2nd', gender: 'masc', number: 'singular' },
  { key: 'أنتما', arabicName: 'أَنْتُمَا', meaningId: 'Kalian berdua (Laki-laki)', person: '2nd', gender: 'masc', number: 'dual' },
  { key: 'أنتم', arabicName: 'أَنْتُمْ', meaningId: 'Kalian (Laki-laki jamak)', person: '2nd', gender: 'masc', number: 'plural' },
  
  // Mukhatabah (2nd person feminine)
  { key: 'أنتِ', arabicName: 'أَنْتِ', meaningId: 'Kamu (1 Perempuan)', person: '2nd', gender: 'fem', number: 'singular' },
  { key: 'أنتما مؤ', arabicName: 'أَنْتُمَا (مؤ)', meaningId: 'Kalian berdua (Perempuan)', person: '2nd', gender: 'fem', number: 'dual' },
  { key: 'أنتن', arabicName: 'أَنْتُنَّ', meaningId: 'Kalian (Perempuan jamak)', person: '2nd', gender: 'fem', number: 'plural' },
  
  // Mutakallim (1st person)
  { key: 'أنا', arabicName: 'أَنَا', meaningId: 'Saya / Aku (Tunggal)', person: '1st', gender: 'common', number: 'singular' },
  { key: 'نحن', arabicName: 'نَحْنُ', meaningId: 'Kami / Kita (Jamak)', person: '1st', gender: 'common', number: 'plural' },
];

/**
 * Exact pronoun order as shown in Gambar 2:
 * 1. أنا, 2. نحن, 3. أنت, 4. أنتِ, 5. أنتما, 6. أنتما مؤ, 7. أنتم, 8. أنتن,
 * 9. هو, 10. هي, 11. هما, 12. هما مؤ, 13. هم, 14. هن
 */
export const MATRIX_PRONOUN_ORDER: PronounInfo[] = [
  { key: 'أنا', arabicName: 'أنا', meaningId: 'Saya (1st)', person: '1st', gender: 'common', number: 'singular' },
  { key: 'نحن', arabicName: 'نحن', meaningId: 'Kami (1st pl)', person: '1st', gender: 'common', number: 'plural' },
  { key: 'أنت', arabicName: 'أنت', meaningId: 'Kamu Lk (2nd m)', person: '2nd', gender: 'masc', number: 'singular' },
  { key: 'أنتِ', arabicName: 'أنتِ', meaningId: 'Kamu Pr (2nd f)', person: '2nd', gender: 'fem', number: 'singular' },
  { key: 'أنتما', arabicName: 'أنتما', meaningId: 'Kalian 2 Lk (2nd dual m)', person: '2nd', gender: 'masc', number: 'dual' },
  { key: 'أنتما مؤ', arabicName: 'أنتما مؤ', meaningId: 'Kalian 2 Pr (2nd dual f)', person: '2nd', gender: 'fem', number: 'dual' },
  { key: 'أنتم', arabicName: 'أنتم', meaningId: 'Kalian Lk (2nd pl m)', person: '2nd', gender: 'masc', number: 'plural' },
  { key: 'أنتن', arabicName: 'أنتن', meaningId: 'Kalian Pr (2nd pl f)', person: '2nd', gender: 'fem', number: 'plural' },
  { key: 'هو', arabicName: 'هو', meaningId: 'Dia Lk (3rd m)', person: '3rd', gender: 'masc', number: 'singular' },
  { key: 'هي', arabicName: 'هي', meaningId: 'Dia Pr (3rd f)', person: '3rd', gender: 'fem', number: 'singular' },
  { key: 'هما', arabicName: 'هما', meaningId: 'Mereka 2 Lk (3rd dual m)', person: '3rd', gender: 'masc', number: 'dual' },
  { key: 'هما مؤ', arabicName: 'هما مؤ', meaningId: 'Mereka 2 Pr (3rd dual f)', person: '3rd', gender: 'fem', number: 'dual' },
  { key: 'هم', arabicName: 'هم', meaningId: 'Mereka Lk (3rd pl m)', person: '3rd', gender: 'masc', number: 'plural' },
  { key: 'هن', arabicName: 'هن', meaningId: 'Mereka Pr (3rd pl f)', person: '3rd', gender: 'fem', number: 'plural' },
];

/**
 * Columns in order as displayed in Gambar 2
 */
export const MATRIX_COLUMN_CATEGORIES = [
  'الماضي المعلوم',
  'المضارع المعلوم',
  'المضارع المجزوم',
  'المضارع المنصوب',
  'المضارع المؤكد الثقيل',
  'الأمر',
  'الأمر المؤكد',
  'الماضي المجهول',
  'المضارع المجهول',
  'المضارع المجهول المجزوم',
  'المضارع المجهول المنصوب',
  'المضارع المؤكد الثقيل المجهول',
];

export interface CategoryMetadata {
  id: string;
  arabicName: string;
  nameId: string;
  description: string;
  voice: 'active' | 'passive';
  mood: 'past' | 'present' | 'imperative';
  grammaticalSignificance: string;
  irabStatus: string;
  syntacticTriggers?: string;
  semanticEffect: string;
  morphologicalFormula: string;
}

export const CATEGORY_INFO: Record<string, Omit<CategoryMetadata, 'id' | 'arabicName'>> = {
  'الماضي المعلوم': {
    nameId: 'Fi\'il Madhi Aktif (Lampau)',
    description: 'Bentuk lampau aktif sempurna (telah dilakukan oleh subjek fa\'il)',
    voice: 'active',
    mood: 'past',
    grammaticalSignificance:
      'Menyatakan peristiwa sempurna (perfective aspect) yang selesai sebelum waktu penuturan. Subjek (fa\'il) diketahui secara aktif (ma\'lum). Pada tashrif 14 dhamir, verba ini menyatu dengan dhamir sebagai pembicara, lawan bicara, atau orang ketiga.',
    irabStatus: 'Mabni secara asal (Mabni \'alal Fath, Sukun, atau Dhamm)',
    semanticEffect: 'Menyatakan perbuatan faktual yang sudah terlaksana di masa lampau.',
    morphologicalFormula: 'فَعَلَ / فَعِلَ / فَعُلَ',
  },
  'المضارع المعلوم': {
    nameId: 'Fi\'il Mudhari\' Aktif (Sekarang/Mendatang)',
    description: 'Bentuk belum selesai aktif (marfu\' secara asal)',
    voice: 'active',
    mood: 'present',
    grammaticalSignificance:
      'Menyatakan peristiwa yang belum selesai (imperfective aspect), mencakup masa sekarang (hal) atau masa mendatang (istiqbal). Dimulai oleh salah satu huruf mudhara\'ah (أَنَيْتَ) dan diakhiri dengan tanda irab marfu\'.',
    irabStatus: 'Mu\'rab Marfu\' (dengan Dhammah atau Tsubutun Nun pada Af\'al Khamsah)',
    semanticEffect: 'Menyatakan tindakan duratif, habitual, atau masa depan yang aktif.',
    morphologicalFormula: 'يَفْعَلُ / يَفْعُلُ / يَفْعِلُ',
  },
  'المضارع المجزوم': {
    nameId: 'Fi\'il Mudhari\' Majzum (Jussif / Apokopat)',
    description: 'Bentuk mudhari\' kondisi jazm setelah partikel penjazzam',
    voice: 'active',
    mood: 'present',
    grammaticalSignificance:
      'Bentuk jussif mudhari\' yang diatur oleh amil jazm. Berfungsi secara sintaksis untuk menafikan masa lampau (dengan لَمْ), melarang tindakan (dengan لَا الناهية), atau menyatakan kondisi badal.',
    irabStatus: 'Mu\'rab Majzum (dengan Sukun, pembuangan Nun, atau pembuangan huruf \'illat)',
    syntacticTriggers: 'Didahului amil jazm: لَمْ (belum/tidak), لَمَّا, لَامُ الأَمْرِ, لَا النَّاهِيَة, atau piranti syarat (إِنْ, مَنْ, مَهْمَا).',
    semanticEffect: 'Membalikkan makna mudhari\' menjadi negasi pasti di masa lalu atau perintah/larangan.',
    morphologicalFormula: 'لَمْ يَفْعَلْ / لَمْ يَفْعُلْ / لَمْ يَفْعِلْ',
  },
  'المضارع المنصوب': {
    nameId: 'Fi\'il Mudhari\' Manshub (Subjungtif)',
    description: 'Bentuk mudhari\' kondisi nashab setelah partikel penashab',
    voice: 'active',
    mood: 'present',
    grammaticalSignificance:
      'Bentuk subjungtif yang diatur oleh amil nawashib. Digunakan dalam klausa subordinat untuk menyatakan tujuan (telic purpose), harapan, niat, atau ketidakmungkinan masa depan.',
    irabStatus: 'Mu\'rab Manshub (dengan Fathah atau pembuangan Nun pada Af\'al Khamsah)',
    syntacticTriggers: 'Didahului amil nashab: أَنْ (bahwa), لَنْ (tidak akan pernah), إِذَنْ (jika begitu), كَيْ (agar/supaya), لَامُ كَيْ.',
    semanticEffect: 'Menyatakan intensi, kemungkinan masa depan, atau subordinasi klausa penjelas.',
    morphologicalFormula: 'لَنْ يَفْعَلَ / لَنْ يَفْعُلَ / لَنْ يَفْعِلَ',
  },
  'المضارع المؤكد الثقيل': {
    nameId: 'Fi\'il Mudhari\' Mu\'akkad Tsaqil (Emfatik Kuat)',
    description: 'Bentuk mudhari\' penegasan kuat dengan Nun Tawkid bersyaddah',
    voice: 'active',
    mood: 'present',
    grammaticalSignificance:
      'Verba mudhari\' yang diimbuhi Nun Tawkid Tsaqilah (نَّ) di ujung kata. Mentransformasikan status verba menjadi mabni \'alal fath bila bersambung langsung, dan mengkhususkan maknanya semata-mata untuk penegasan.',
    irabStatus: 'Mabni \'alal Fath (apabila bersambung langsung tanpa pemisah)',
    syntacticTriggers: 'Biasanya diawali Lam Qasam (sumpah), perangkat doa, atau larangan/anjuran keras.',
    semanticEffect: 'Memberikan penegasan absolut tanpa keraguan bahwa aksi pasti terwujud.',
    morphologicalFormula: 'لَيَفْعَلَنَّ / لَيَفْعُلَنَّ / لَيَفْعِلَنَّ',
  },
  'الأمر': {
    nameId: 'Fi\'il Amr (Modus Imperatif)',
    description: 'Bentuk perintah langsung untuk mukhatab (orang ke-2)',
    voice: 'active',
    mood: 'imperative',
    grammaticalSignificance:
      'Modus imperatif langsung yang dibentuk dari fi\'il mudhari\' majzum dengan membuang huruf mudhara\'ah. Hanya berlaku untuk 6 dhamir mukhatab (أَنْتَ, أَنْتِ, أَنْتُمَا, أَنْتُمْ, أَنْتُنَّ).',
    irabStatus: 'Mabni atas apa yang menjazzamkan mudhari\'-nya (Sukun, Hadzf Nun, Hadzf Harf \'Illat)',
    semanticEffect: 'Tuntutan pengerjaan perbuatan (thalabul fi\'li) dari pembicara ke lawan bicara.',
    morphologicalFormula: 'اِفْعَلْ / اُفْعُلْ / اِفْعِلْ',
  },
  'الأمر المؤكد': {
    nameId: 'Fi\'il Amr Mu\'akkad (Imperatif Emfatik)',
    description: 'Bentuk perintah langsung dengan penegasan Nun Tawkid',
    voice: 'active',
    mood: 'imperative',
    grammaticalSignificance:
      'Modus imperatif yang digabungkan dengan Nun Tawkid Tsaqilah. Menuntut ketaatan atau pelaksanaan instruksi secara mendesak, formal, dan tidak menerima keraguan atau tawar-menawar.',
    irabStatus: 'Mabni \'alal Fath karena bersambung langsung dengan Nun Tawkid',
    semanticEffect: 'Instruksi berkekuatan hukum atau darurat yang ditekankan secara maksimal.',
    morphologicalFormula: 'اِفْعَلَنَّ / اُفْعُلَنَّ / اِفْعِلَنَّ',
  },
  'الماضي المجهول': {
    nameId: 'Fi\'il Madhi Pasif (Majhul Lampau)',
    description: 'Bentuk lampau pasif (subjek dihilangkan, objek menjadi na\'ibul fa\'il)',
    voice: 'passive',
    mood: 'past',
    grammaticalSignificance:
      'Bentuk pasif masa lampau di mana pelaku asli (fa\'il) dihilangkan dari struktur kalimat karena sudah dimaklumi, dirahasiakan, atau untuk menonjolkan peristiwa. Objek penderita (maf\'ul bih) mengisi posisi subjek.',
    irabStatus: 'Mabni \'alal Fath (seperti madhi ma\'lum)',
    semanticEffect: 'Mengalihkan fokus wacana ke penerima akibat perbuatan di masa lalu.',
    morphologicalFormula: 'فُعِلَ (didhammah huruf awal, dikasrah huruf sebelum akhir)',
  },
  'المضارع المجهول': {
    nameId: 'Fi\'il Mudhari\' Pasif (Majhul Sekarang/Mendatang)',
    description: 'Bentuk sedang/akan datang pasif (marfu\' secara asal)',
    voice: 'passive',
    mood: 'present',
    grammaticalSignificance:
      'Bentuk pasif duratif di mana huruf mudhara\'ah diberi harakat dhammah dan huruf sebelum akhir diberi fathah. Berelasi sintaksis langsung dengan Na\'ibul Fa\'il sebagai subjek pasif.',
    irabStatus: 'Mu\'rab Marfu\' (Dhammah / Tsubutun Nun)',
    semanticEffect: 'Menyatakan proses pekerjaan yang sedang atau akan dialami oleh subjek pasif.',
    morphologicalFormula: 'يُفْعَلُ (didhammah huruf mudhara\'ah, difathah sebelum akhir)',
  },
  'المضارع المجهول المجزوم': {
    nameId: 'Fi\'il Mudhari\' Pasif Majzum',
    description: 'Bentuk mudhari\' pasif kondisi jazm setelah partikel penjazzam',
    voice: 'passive',
    mood: 'present',
    grammaticalSignificance:
      'Perpaduan antara struktur pasif (majhul) dan kasus apokopat (jazm). Sering digunakan untuk menafikan keterjadian peristiwa pasif di masa lampau (misal: لَمْ يُكْتَبْ = belum/tiada ditulis).',
    irabStatus: 'Mu\'rab Majzum (dengan Sukun atau Hadzfun Nun)',
    syntacticTriggers: 'Didahului amil jazm: لَمْ, لَمَّا, dsb.',
    semanticEffect: 'Menafikan secara tuntas bahwa subjek penderita dikenai tindakan di masa lalu.',
    morphologicalFormula: 'لَمْ يُفْعَلْ',
  },
  'المضارع المجهول المنصوب': {
    nameId: 'Fi\'il Mudhari\' Pasif Manshub',
    description: 'Bentuk mudhari\' pasif kondisi nashab setelah partikel penashab',
    voice: 'passive',
    mood: 'present',
    grammaticalSignificance:
      'Perpaduan antara struktur pasif dan kasus subjungtif (nashab). Digunakan saat perlakuan pasif terhadap objek menjadi tujuan atau klausul bergantung (misal: لَنْ يُظْلَمَ = tidak akan dianiaya).',
    irabStatus: 'Mu\'rab Manshub (dengan Fathah atau Hadzfun Nun)',
    syntacticTriggers: 'Didahului amil nashab: أَنْ, لَنْ, كَيْ, dsb.',
    semanticEffect: 'Menyatakan prospek atau penafian mutlak masa depan terhadap pihak yang terdampak.',
    morphologicalFormula: 'لَنْ يُفْعَلَ',
  },
  'المضارع المؤكد الثقيل المجهول': {
    nameId: 'Fi\'il Mudhari\' Pasif Mu\'akkad',
    description: 'Bentuk mudhari\' pasif dengan penegasan Nun Tawkid bersyaddah',
    voice: 'passive',
    mood: 'present',
    grammaticalSignificance:
      'Struktur morfologis komprehensif yang mengombinasikan vokalisasi pasif (dhammah awal, fathah tengah) dengan sufiks Nun Tawkid Tsaqilah (نَّ). Menyatakan kepastian mutlak bahwa pihak penerima tindakan akan dikenai aksi.',
    irabStatus: 'Mabni \'alal Fath karena bersambung langsung dengan Nun Tawkid',
    semanticEffect: 'Penegasan tak terbantahkan atas perlakuan pasif yang pasti terjadi di masa depan.',
    morphologicalFormula: 'لَيُفْعَلَنَّ',
  },
};
