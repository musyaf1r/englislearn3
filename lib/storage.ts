import type { Profile } from "./types";

export type Store = {
  /** Kunci pemain terakhir yang main (nama huruf kecil). */
  last: string | null;
  players: Record<string, Profile>;
  muted: boolean;
};

// Semua data hanya disimpan di localStorage browser ini (tidak dikirim ke server).
const KEY = "holidayquest:v1";

function blank(): Store {
  return { last: null, players: {}, muted: false };
}

export function loadStore(): Store {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return blank();
    const data = JSON.parse(raw) as Partial<Store>;
    return {
      last: typeof data.last === "string" ? data.last : null,
      players:
        data.players && typeof data.players === "object" ? data.players : {},
      muted: data.muted === true,
    };
  } catch {
    return blank();
  }
}

export function saveStore(store: Store): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(store));
  } catch {
    // penyimpanan penuh atau diblokir: game tetap jalan tanpa simpan
  }
}

export function keyOf(name: string): string {
  return name.trim().replace(/\s+/g, " ").toLowerCase();
}

export function createProfile(name: string, avatar: string): Profile {
  const now = Date.now();
  return {
    name,
    avatar,
    xp: 0,
    stars: {},
    bestStreak: 0,
    plays: 0,
    createdAt: now,
    lastPlayed: now,
    onboarded: false,
  };
}
