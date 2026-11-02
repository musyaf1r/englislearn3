export const RANKS = [
  { min: 0, name: "Petualang Baru" },
  { min: 80, name: "Penjelajah Pantai" },
  { min: 200, name: "Pendaki Gunung" },
  { min: 350, name: "Kapten Liburan" },
  { min: 550, name: "Raja Liburan" },
] as const;

export function getRank(xp: number) {
  let idx = 0;
  RANKS.forEach((r, i) => {
    if (xp >= r.min) idx = i;
  });
  const cur = RANKS[idx];
  const next = idx + 1 < RANKS.length ? RANKS[idx + 1] : null;
  const progress = next ? (xp - cur.min) / (next.min - cur.min) : 1;
  return { idx, cur, next, progress };
}
