export type ChoiceQ = {
  type: "choice";
  /** Kalimat tanya dengan "___" sebagai bagian yang kosong. */
  prompt: string;
  /** Jawaban teman bicara (petunjuk konteks). */
  reply: string;
  options: string[];
  answer: string;
  hint: string;
};

export type OrderQ = {
  type: "order";
  /** Arti dalam bahasa Indonesia. */
  meaning: string;
  /** Kata-kata dalam urutan yang benar (tanda baca boleh jadi kata sendiri). */
  words: string[];
  /** Kata pengecoh (opsional). */
  extra?: string[];
  hint: string;
};

export type MatchQ = {
  type: "match";
  pairs: { left: string; right: string }[];
  hint: string;
};

export type Question = ChoiceQ | OrderQ | MatchQ;

export type LessonItem = {
  word: string;
  meaning: string;
  example: string;
  exampleId: string;
};

export type Level = {
  id: number;
  name: string;
  colors: [string, string];
  intro: string;
  hearts: number;
  lesson: LessonItem[];
  questions: Question[];
};

export type Profile = {
  name: string;
  /** id avatar, lihat AVATAR_IDS di components/art.tsx */
  avatar: string;
  xp: number;
  /** levelId -> bintang terbaik (1-3) */
  stars: Record<number, number>;
  bestStreak: number;
  plays: number;
  createdAt: number;
  lastPlayed: number;
  /** sudah melihat penjelasan awal (kosong pada data lama) */
  onboarded?: boolean;
};
