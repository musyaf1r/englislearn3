// Setiap kata tanya punya WARNA dan BENTUK sendiri.
// Dua isyarat sekaligus membantu anak mengingat (dan anak buta warna tetap bisa membedakan).

export type ShapeId =
  | "circle"
  | "pin"
  | "squircle"
  | "hexagon"
  | "diamond"
  | "triangle"
  | "burst"
  | "heart"
  | "plus"
  | "octagon";

export type WordStyle = { bg: string; shape: ShapeId };

const TABLE: Record<string, WordStyle> = {
  what: { bg: "#F8D8B9", shape: "circle" },
  where: { bg: "#C9ECE5", shape: "pin" },
  who: { bg: "#F4D6E4", shape: "squircle" },
  when: { bg: "#DED9F4", shape: "hexagon" },
  why: { bg: "#D2E5F4", shape: "diamond" },
  how: { bg: "#F7E9B8", shape: "triangle" },
  which: { bg: "#D8EBCB", shape: "burst" },
  whose: { bg: "#F4D4CE", shape: "heart" },
  "how many": { bg: "#CDE9EF", shape: "plus" },
  "how much": { bg: "#EADCC8", shape: "octagon" },
  did: { bg: "#FCE7C8", shape: "hexagon" },
};

export const NEUTRAL = "#FFFFFF";

/** Gaya kata tanya, atau null kalau kata itu bukan kata tanya (misalnya "many"). */
export function wordStyle(word: string): WordStyle | null {
  return TABLE[word.trim().toLowerCase()] ?? null;
}

export function colorOf(word: string, fallback = NEUTRAL): string {
  return wordStyle(word)?.bg ?? fallback;
}
