import type { ChoiceQ, LessonItem, Level, MatchQ, OrderQ } from "./types";

// ---------------------------------------------------------------
// Materi pelajaran. Ubah / tambah di sini untuk memperluas game.
// ---------------------------------------------------------------
const W = {
  what: { word: "What", meaning: "apa", example: "What do you bring?", exampleId: "Kamu membawa apa?" },
  where: { word: "Where", meaning: "di mana / ke mana", example: "Where is the beach?", exampleId: "Di mana pantainya?" },
  who: { word: "Who", meaning: "siapa", example: "Who goes with you?", exampleId: "Siapa yang pergi denganmu?" },
  when: { word: "When", meaning: "kapan", example: "When do you go?", exampleId: "Kapan kamu pergi?" },
  why: { word: "Why", meaning: "mengapa (jawab pakai Because)", example: "Why do you like the zoo?", exampleId: "Mengapa kamu suka kebun binatang?" },
  how: { word: "How", meaning: "bagaimana / dengan apa", example: "How do you go to the zoo?", exampleId: "Bagaimana kamu pergi ke kebun binatang?" },
  which: { word: "Which", meaning: "yang mana (memilih)", example: "Which bag is yours?", exampleId: "Tas yang mana milikmu?" },
  whose: { word: "Whose", meaning: "milik siapa", example: "Whose hat is this?", exampleId: "Topi ini milik siapa?" },
  howMany: { word: "How many", meaning: "berapa banyak (bisa dihitung)", example: "How many days?", exampleId: "Berapa hari?" },
  howMuch: { word: "How much", meaning: "berapa harga / berapa banyak", example: "How much is the ticket?", exampleId: "Berapa harga tiketnya?" },
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

const o = (meaning: string, words: string[], hint: string, extra?: string[]): OrderQ => ({
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
// Level
// ---------------------------------------------------------------
export const LEVELS: Level[] = [
  {
    id: 1,
    name: "Pantai Ceria",
    colors: ["#c9ecef", "#83c7d5"],
    intro: "Ayo ke pantai! Kenalan dulu dengan kata tanya What dan Where.",
    hearts: 3,
    lesson: L("what", "where"),
    questions: [
      c("___ do you do at the beach?", "I build a sandcastle.", "What", ["Where", "Who", "When"], "Jawabannya adalah kegiatan"),
      c("___ is the beach?", "It is in Bali.", "Where", ["What", "Why", "Who"], "Jawabannya adalah sebuah tempat"),
      c("___ do you bring on holiday?", "I bring a hat and sunglasses.", "What", ["Where", "When", "Why"], "Jawabannya adalah benda"),
      c("___ are you going on holiday?", "I am going to the mountain.", "Where", ["How", "Who", "Which"], "Jawabannya adalah tempat tujuan"),
      o("Kamu melakukan apa di pantai?", ["What", "do", "you", "do", "at", "the", "beach", "?"], "Mulai dengan kata tanya ya!"),
      m(["what", "where"], "What = apa, Where = di mana"),
    ],
  },
  {
    id: 2,
    name: "Gunung Seru",
    colors: ["#d4ecdf", "#91c5a7"],
    intro: "Saatnya berkemah! Belajar kata tanya Who dan When.",
    hearts: 3,
    lesson: L("who", "when"),
    questions: [
      c("___ are you going with?", "I am going with my family.", "Who", ["What", "Where", "Why"], "Jawabannya adalah orang"),
      c("___ do you go on holiday?", "I go in December.", "When", ["Who", "Where", "How"], "Jawabannya adalah waktu"),
      c("___ goes camping with you?", "My brother goes with me.", "Who", ["When", "Where", "What"], "Jawabannya adalah orang"),
      c("___ does the train leave?", "At eight o'clock.", "When", ["Who", "Where", "Which"], "Jawabannya adalah jam / waktu ⏰"),
      o("Kapan kamu pergi berlibur?", ["When", "do", "you", "go", "on", "holiday", "?"], "Mulai dengan kata tanya waktu ya!"),
      m(["who", "when", "what", "where"], "Pasangkan semua yang sudah kamu pelajari!"),
    ],
  },
  {
    id: 3,
    name: "Kebun Binatang",
    colors: ["#f7e5c4", "#e7b77d"],
    intro: "Banyak hewan lucu! Belajar kata tanya Why dan How.",
    hearts: 3,
    lesson: L("why", "how"),
    questions: [
      c("___ do you like the zoo?", "Because I love animals.", "Why", ["How", "When", "Which"], "Jawabannya diawali kata Because"),
      c("___ do you go to the zoo?", "We go by bus.", "How", ["Why", "Who", "Where"], "Jawabannya adalah cara pergi"),
      c("___ is the lion sleeping?", "Because it is tired.", "Why", ["Who", "When", "Whose"], "Because artinya karena"),
      c("___ does the monkey get the banana?", "It climbs the tree.", "How", ["Who", "Why", "When"], "Jawabannya adalah caranya"),
      o("Mengapa kamu suka kebun binatang?", ["Why", "do", "you", "like", "the", "zoo", "?"], "Mulai dengan Why ya!"),
      m(["why", "how", "when", "who"], "Why = mengapa, How = bagaimana"),
    ],
  },
  {
    id: 4,
    name: "Kota Liburan",
    colors: ["#e9ddf1", "#c5a9d8"],
    intro: "Ayo jalan-jalan di kota! Belajar kata tanya Which dan Whose.",
    hearts: 3,
    lesson: L("which", "whose"),
    questions: [
      c("___ bag is yours, the red one or the blue one?", "The blue one.", "Which", ["Whose", "Who", "Why"], "Ada pilihan: yang merah atau yang biru"),
      c("___ camera is this?", "It is my father's camera.", "Whose", ["Who", "Which", "How"], "Jawabannya menunjukkan pemilik"),
      c("___ hotel do you like, the big one or the small one?", "I like the big one.", "Which", ["Whose", "Where", "When"], "Ada dua pilihan hotel"),
      c("___ ticket is this?", "It is mine.", "Whose", ["Which", "Who", "How"], "Mine artinya milikku"),
      o("Topi ini milik siapa?", ["Whose", "hat", "is", "this", "?"], "Mulai dengan Whose ya!"),
      m(["which", "whose", "who", "what"], "Which = yang mana, Whose = milik siapa"),
    ],
  },
  {
    id: 5,
    name: "Pulau Harta Karun",
    colors: ["#f5edc7", "#ddc773"],
    intro: "Ada harta karun! Belajar menanyakan jumlah dan harga: How many dan How much.",
    hearts: 3,
    lesson: L("howMany", "howMuch"),
    questions: [
      c("How ___ days will you stay in Bali?", "Three days.", "many", ["much", "old", "far"], "Hari bisa dihitung satu per satu"),
      c("How ___ is the ticket?", "It is fifty thousand rupiah.", "much", ["many", "old", "tall"], "Jawabannya adalah harga"),
      c("How ___ shells did you find?", "I found ten shells.", "many", ["much", "far", "tall"], "Kerang bisa dihitung"),
      c("How ___ is the ice cream?", "It is ten thousand rupiah.", "much", ["many", "old", "tall"], "Tanyakan harganya"),
      o("Berapa harga tiket itu?", ["How", "much", "is", "the", "ticket", "?"], "Mulai dengan How ya!"),
      m(["howMany", "howMuch", "which", "whose"], "How many = berapa banyak, How much = berapa harga"),
    ],
  },
  {
    id: 6,
    name: "Raja Liburan",
    colors: ["#f3d9d7", "#d99b9b"],
    intro: "Level BOSS! Semua kata tanya muncul. Kamu punya 4 nyawa. Siap jadi Raja Liburan?",
    hearts: 4,
    lesson: L("what", "where", "who", "when", "why", "how", "which", "whose", "howMany", "howMuch"),
    questions: [
      c("___ is the airport?", "It is in Jakarta.", "Where", ["Why", "Which", "How much"], "Jawabannya adalah tempat"),
      c("___ do you take a jacket?", "Because the mountain is cold.", "Why", ["When", "Whose", "How"], "Because artinya karena"),
      m(["what", "where", "who", "when", "why"], "Pasangkan kelima kata tanya!"),
      c("___ jacket is this?", "It is my mom's.", "Whose", ["Who", "Which", "What"], "Jawabannya menunjukkan pemilik"),
      c("___ is going to the museum with you?", "My cousin is going with me.", "Who", ["Whose", "What", "When"], "Jawabannya adalah orang"),
      o("Kapan kita pergi ke pantai?", ["When", "do", "we", "go", "to", "the", "beach", "?"], "Mulai dengan kata tanya waktu ya!"),
      c("___ suitcase do you want, the big one or the small one?", "The small one.", "Which", ["Whose", "Who", "Where"], "Ada dua pilihan koper"),
      c("How ___ is the hotel room for one night?", "It is four hundred thousand rupiah.", "much", ["many", "old", "far"], "Jawabannya adalah harga"),
      o("Siapa yang pergi bersamamu?", ["Who", "goes", "with", "you", "?"], "Mulai dengan Who ya!"),
    ],
  },
];

export function getLevel(id: number): Level | undefined {
  return LEVELS.find((l) => l.id === id);
}

/** Semua kata tanya beserta arti dan contoh, dipakai di penjelasan awal. */
export const ALL_WORDS: LessonItem[] = Object.values(W);
