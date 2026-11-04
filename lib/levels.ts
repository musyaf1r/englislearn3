import type { ChoiceQ, LessonItem, Level, MatchQ, OrderQ } from "./types";

// ---------------------------------------------------------------
// Materi pelajaran. Termasuk kata tanya & bentuk lampau (Past Tense).
// ---------------------------------------------------------------
const W = {
  what: {
    word: "What",
    meaning: "apa",
    example: "What did you do yesterday?",
    exampleId: "Apa yang kamu lakukan kemarin?",
  },
  where: {
    word: "Where",
    meaning: "di mana / ke mana",
    example: "Where did you go on holiday?",
    exampleId: "Ke mana kamu pergi saat liburan?",
  },
  who: {
    word: "Who",
    meaning: "siapa",
    example: "Who went with you?",
    exampleId: "Siapa yang pergi bersamamu? (went = lampau dari go)",
  },
  when: {
    word: "When",
    meaning: "kapan",
    example: "When did you arrive in Bali?",
    exampleId: "Kapan kamu tiba di Bali kemarin?",
  },
  why: {
    word: "Why",
    meaning: "mengapa (jawab pakai Because)",
    example: "Why did you stay at the hotel?",
    exampleId: "Mengapa kamu tinggal di hotel? (Because it rained)",
  },
  how: {
    word: "How",
    meaning: "bagaimana / dengan apa",
    example: "How did you go to the zoo?",
    exampleId: "Bagaimana kamu pergi ke kebun binatang kemarin?",
  },
  which: {
    word: "Which",
    meaning: "yang mana (memilih)",
    example: "Which beach did you visit?",
    exampleId: "Pantai mana yang kamu kunjungi?",
  },
  whose: {
    word: "Whose",
    meaning: "milik siapa",
    example: "Whose hat did you borrow?",
    exampleId: "Topi siapa yang kamu pinjam kemarin?",
  },
  howMany: {
    word: "How many",
    meaning: "berapa banyak (bisa dihitung)",
    example: "How many photos did you take?",
    exampleId: "Berapa banyak foto yang kamu ambil?",
  },
  howMuch: {
    word: "How much",
    meaning: "berapa harga / banyak",
    example: "How much was the ticket?",
    exampleId: "Berapa harga tiketnya kemarin?",
  },
  did: {
    word: "Did",
    meaning: "kata bantu tanya lampau (Past Tense: kemarin/dulu)",
    example: "Where did you play yesterday?",
    exampleId: "Di mana kamu bermain kemarin? (did + verb 1)",
  },
} satisfies Record<string, LessonItem>;

type Key = keyof typeof W;

// Arti singkat untuk soal "pasangkan".
const SHORT: Record<Key, string> = {
  what: "apa",
  where: "di mana",
  who: "siapa",
  when: "kapan",
  why: "mengapa",
  how: "bagaimana",
  which: "yang mana",
  whose: "milik siapa",
  howMany: "berapa banyak",
  howMuch: "berapa harga",
  did: "kata bantu lampau",
};

// ---------------------------------------------------------------
// Pembuat soal singkat
// ---------------------------------------------------------------
const c = (
  prompt: string,
  reply: string,
  answer: string,
  wrong: string[],
  hint: string,
): ChoiceQ => ({
  type: "choice",
  prompt,
  reply,
  answer,
  options: [answer, ...wrong],
  hint,
});

const o = (
  meaning: string,
  words: string[],
  hint: string,
  extra?: string[],
): OrderQ => ({
  type: "order",
  meaning,
  words,
  extra,
  hint,
});

const m = (keys: Key[], hint: string): MatchQ => ({
  type: "match",
  pairs: keys.map((k) => ({ left: W[k].word, right: SHORT[k] })),
  hint,
});

const L = (...keys: Key[]): LessonItem[] => keys.map((k) => W[k]);

// ---------------------------------------------------------------
// Level dengan materi Kata Tanya & Past Tense (Masa Lampau)
// ---------------------------------------------------------------
export const LEVELS: Level[] = [
  {
    id: 1,
    name: "Pantai Ceria",
    colors: ["#c9ecef", "#83c7d5"],
    intro:
      "Ayo ke pantai! Belajar kata tanya What & Where, serta bertanya tentang masa lampau (Past Tense dengan Did).",
    hearts: 3,
    lesson: L("what", "where", "did"),
    questions: [
      c(
        "___ did you do at the beach yesterday?",
        "I built a sandcastle.",
        "What",
        ["Where", "Who", "When"],
        "Built adalah bentuk lampau. Menanyakan kegiatan yang dilakukan.",
      ),
      c(
        "___ did you go on last holiday?",
        "I went to Bali.",
        "Where",
        ["What", "Why", "Who"],
        "Went adalah bentuk lampau dari go. Menanyakan tempat tujuan.",
      ),
      c(
        "Where ___ you swim yesterday?",
        "I swam in the sea.",
        "did",
        ["do", "are", "have"],
        "Untuk kalimat tanya lampau (yesterday), gunakan kata bantu 'did'!",
      ),
      c(
        "___ do you bring on holiday?",
        "I bring a hat and sunglasses.",
        "What",
        ["Where", "When", "Why"],
        "Jawabannya adalah benda yang dibawa.",
      ),
      o(
        "Apa yang kamu lakukan di pantai kemarin?",
        ["What", "did", "you", "do", "at", "the", "beach", "yesterday", "?"],
        "Mulai dengan What + did + you + do...!",
      ),
      o(
        "Di mana pantainya?",
        ["Where", "is", "the", "beach", "?"],
        "Mulai dengan kata tanya Where ya!",
      ),
      m(["what", "where", "did"], "What = apa, Where = di mana, Did = kata bantu lampau"),
    ],
  },
  {
    id: 2,
    name: "Gunung Seru",
    colors: ["#d4ecdf", "#91c5a7"],
    intro:
      "Saatnya berkemah! Belajar kata tanya Who & When dan menceritakan kegiatan lampau (Past Tense).",
    hearts: 3,
    lesson: L("who", "when", "did"),
    questions: [
      c(
        "___ went camping with you last week?",
        "My brother went with me.",
        "Who",
        ["When", "Where", "What"],
        "Went adalah bentuk lampau dari go. Menanyakan orang yang ikut.",
      ),
      c(
        "___ did you arrive at the mountain?",
        "We arrived yesterday afternoon.",
        "When",
        ["Who", "Where", "How"],
        "Arrived adalah lampau. Menanyakan waktu tiba (yesterday).",
      ),
      c(
        "When ___ they climb the mountain?",
        "They climbed it last Sunday.",
        "did",
        ["do", "are", "were"],
        "Untuk kalimat tanya lampau (last Sunday), kita gunakan 'did'!",
      ),
      c(
        "Who ___ the campfire last night?",
        "My father made it.",
        "made",
        ["make", "makes", "making"],
        "Last night adalah masa lampau. Gunakan kata kerja bentuk lampau 'made'!",
      ),
      o(
        "Kapan kamu pergi berkemah kemarin?",
        ["When", "did", "you", "go", "camping", "yesterday", "?"],
        "Urutan lampau: When + did + you + go...!",
      ),
      m(["who", "when", "what", "where"], "Pasangkan semua kata tanya yang sudah dipelajari!"),
    ],
  },
  {
    id: 3,
    name: "Kebun Binatang",
    colors: ["#f7e5c4", "#e7b77d"],
    intro:
      "Banyak hewan lucu! Belajar kata tanya Why & How serta menjelaskan alasan dan cara di masa lampau.",
    hearts: 3,
    lesson: L("why", "how", "did"),
    questions: [
      c(
        "___ did you take an umbrella yesterday?",
        "Because it rained.",
        "Why",
        ["How", "When", "Which"],
        "Jawabannya diawali kata Because (karena). Gunakan Why!",
      ),
      c(
        "___ did you go to the zoo last holiday?",
        "We went by bus.",
        "How",
        ["Why", "Who", "Where"],
        "Went adalah lampau. Menanyakan cara / kendaraan yang dinaiki.",
      ),
      c(
        "Why ___ the monkey jump into the tree yesterday?",
        "Because it saw a banana.",
        "did",
        ["do", "does", "is"],
        "Pertanyaan lampau menggunakan kata bantu 'did'!",
      ),
      c(
        "How ___ your holiday in the safari park last month?",
        "It was awesome!",
        "was",
        ["were", "did", "is"],
        "Gunakan 'was' untuk to-be lampau subjek tunggal (holiday)!",
      ),
      o(
        "Mengapa kamu suka kebun binatang?",
        ["Why", "do", "you", "like", "the", "zoo", "?"],
        "Mulai dengan Why ya!",
      ),
      o(
        "Bagaimana kamu pergi ke sana kemarin?",
        ["How", "did", "you", "go", "there", "yesterday", "?"],
        "How + did + you + go...!",
      ),
      m(["why", "how", "when", "who"], "Why = mengapa, How = bagaimana"),
    ],
  },
  {
    id: 4,
    name: "Kota Liburan",
    colors: ["#e9ddf1", "#c5a9d8"],
    intro:
      "Ayo keliling kota! Belajar kata tanya Which & Whose dan menanyakan pilihan serta milik siapa di waktu lampau.",
    hearts: 3,
    lesson: L("which", "whose", "did"),
    questions: [
      c(
        "___ museum did you visit last weekend?",
        "We visited the art museum.",
        "Which",
        ["Whose", "Who", "Why"],
        "Visited adalah bentuk lampau. Menanyakan pilihan museum yang dikunjungi.",
      ),
      c(
        "___ camera did you borrow yesterday?",
        "I borrowed my father's camera.",
        "Whose",
        ["Which", "Who", "How"],
        "Borrowed adalah bentuk lampau. Menanyakan kepemilikan kamera.",
      ),
      c(
        "Which hotel ___ you choose last night?",
        "We chose the grand hotel.",
        "did",
        ["do", "are", "have"],
        "Pertanyaan lampau (last night) menggunakan 'did'!",
      ),
      c(
        "___ ticket is this?",
        "It is mine.",
        "Whose",
        ["Which", "Who", "How"],
        "Mine artinya milikku.",
      ),
      o(
        "Tempat mana yang kamu kunjungi kemarin?",
        ["Which", "place", "did", "you", "visit", "yesterday", "?"],
        "Which + place + did + you + visit...?",
      ),
      o(
        "Topi ini milik siapa?",
        ["Whose", "hat", "is", "this", "?"],
        "Mulai dengan Whose ya!",
      ),
      m(["which", "whose", "who", "what"], "Which = yang mana, Whose = milik siapa"),
    ],
  },
  {
    id: 5,
    name: "Pulau Harta Karun",
    colors: ["#f5edc7", "#ddc773"],
    intro:
      "Ada harta karun! Belajar menanyakan jumlah (How many) & harga (How much) di masa lampau.",
    hearts: 3,
    lesson: L("howMany", "howMuch", "did"),
    questions: [
      c(
        "How ___ shells did you find on the beach yesterday?",
        "I found ten shells.",
        "many",
        ["much", "far", "tall"],
        "Found adalah bentuk lampau. Kerang (shells) bisa dihitung satu per satu.",
      ),
      c(
        "How ___ was the entrance ticket yesterday?",
        "It was fifty thousand rupiah.",
        "much",
        ["many", "old", "far"],
        "Was adalah bentuk lampau dari is. Menanyakan harga tiket.",
      ),
      c(
        "How many dolphins ___ you see during the boat tour yesterday?",
        "We saw three dolphins.",
        "did",
        ["do", "are", "have"],
        "Saw adalah lampau. Pertanyaan lampau menggunakan kata bantu 'did'!",
      ),
      c(
        "How much money did you ___ yesterday?",
        "I spent twenty thousand rupiah.",
        "spend",
        ["spent", "spends", "spending"],
        "Ingat! Setelah kata bantu 'did', kata kerja kembali ke bentuk dasar (spend)!",
      ),
      o(
        "Berapa banyak foto yang kamu ambil kemarin?",
        ["How", "many", "photos", "did", "you", "take", "yesterday", "?"],
        "How many + photos + did + you + take...?",
      ),
      o(
        "Berapa harga tiket itu kemarin?",
        ["How", "much", "was", "the", "ticket", "yesterday", "?"],
        "Gunakan was untuk harga di masa lampau!",
      ),
      m(
        ["howMany", "howMuch", "which", "whose"],
        "How many = berapa banyak, How much = berapa harga",
      ),
    ],
  },
  {
    id: 6,
    name: "Raja Liburan",
    colors: ["#f3d9d7", "#d99b9b"],
    intro:
      "Level BOSS! Semua kata tanya dan Past Tense (masa lampau) muncul di sini. Kamu punya 4 nyawa. Siap jadi Raja Liburan?",
    hearts: 4,
    lesson: L(
      "what",
      "where",
      "who",
      "when",
      "why",
      "how",
      "which",
      "whose",
      "howMany",
      "howMuch",
      "did",
    ),
    questions: [
      c(
        "___ did you spend your last vacation?",
        "I spent it in Bali.",
        "Where",
        ["Why", "Which", "How much"],
        "Spent adalah lampau dari spend. Menanyakan tempat liburan lalu.",
      ),
      c(
        "___ took this beautiful photo yesterday?",
        "My sister took it.",
        "Who",
        ["Whose", "What", "When"],
        "Took adalah bentuk lampau dari take. Menanyakan orang.",
      ),
      c(
        "___ did you take a jacket yesterday?",
        "Because the mountain was cold.",
        "Why",
        ["When", "Whose", "How"],
        "Karena jawabannya diawali 'Because', gunakan Why!",
      ),
      c(
        "Where ___ you yesterday afternoon?",
        "I was at the amusement park.",
        "were",
        ["was", "did", "are"],
        "Untuk subjek 'you' pada to-be lampau (Past Tense), gunakan 'were'!",
      ),
      c(
        "When ___ you return from Yogyakarta?",
        "We returned last Sunday.",
        "did",
        ["do", "are", "were"],
        "Returned adalah lampau. Kalimat tanya lampau menggunakan 'did'!",
      ),
      c(
        "How ___ souvenirs did you buy for your friends?",
        "I bought five keychains.",
        "many",
        ["much", "old", "deep"],
        "Bought adalah bentuk lampau. Gantungan kunci (souvenirs) bisa dihitung.",
      ),
      o(
        "Ke mana kamu pergi berlibur minggu lalu?",
        ["Where", "did", "you", "go", "on", "holiday", "last", "week", "?"],
        "Urutan: Where + did + you + go on holiday last week?",
      ),
      o(
        "Apa yang kamu beli di pasar kemarin?",
        ["What", "did", "you", "buy", "at", "the", "market", "yesterday", "?"],
        "What + did + you + buy...?",
      ),
      m(["what", "where", "who", "when", "why"], "Pasangkan kelima kata tanya!"),
    ],
  },
];

export function getLevel(id: number): Level | undefined {
  return LEVELS.find((l) => l.id === id);
}

/** Semua kata tanya beserta arti dan contoh, dipakai di penjelasan awal. */
export const ALL_WORDS: LessonItem[] = Object.values(W);
