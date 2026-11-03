"use client";

import { useEffect, useState } from "react";
import type { Profile } from "@/lib/types";
import { LEVELS, getLevel } from "@/lib/levels";
import {
  createProfile,
  keyOf,
  loadStore,
  saveStore,
  type Store,
} from "@/lib/storage";
import { setMuted } from "@/lib/sound";
import Backdrop from "./Backdrop";
import Welcome from "./Welcome";
import Onboarding from "./Onboarding";
import LevelMap from "./LevelMap";
import Lesson from "./Lesson";
import Play, { type PlayResult } from "./Play";
import Result from "./Result";
import { Mascot } from "./art";

type Screen =
  | { name: "loading" }
  | { name: "welcome" }
  | { name: "intro" }
  | { name: "map" }
  | { name: "lesson"; levelId: number }
  | { name: "play"; levelId: number; attempt: number }
  | { name: "result"; levelId: number; result: PlayResult; attempt: number };

// Data lama (sebelum ada penjelasan awal) dianggap sudah paham kalau pernah main.
const hasSeenIntro = (p: Profile) => p.onboarded === true || p.plays > 0;

export default function Game() {
  const [store, setStore] = useState<Store | null>(null);
  const [screen, setScreen] = useState<Screen>({ name: "loading" });

  // Baca data dari localStorage hanya setelah halaman tampil di browser.
  useEffect(() => {
    const s = loadStore();
    setMuted(s.muted);
    setStore(s);
    const me = s.last ? s.players[s.last] : undefined;
    setScreen(
      !me
        ? { name: "welcome" }
        : hasSeenIntro(me)
          ? { name: "map" }
          : { name: "intro" },
    );
  }, []);

  const profile: Profile | null =
    store && store.last ? (store.players[store.last] ?? null) : null;

  function commit(next: Store) {
    saveStore(next);
    setStore(next);
  }

  function login(name: string, avatar: string) {
    const s = store ?? loadStore();
    const key = keyOf(name);
    const existing = s.players[key];
    const player: Profile = existing
      ? { ...existing, lastPlayed: Date.now() }
      : createProfile(name, avatar);
    commit({ ...s, last: key, players: { ...s.players, [key]: player } });
    setScreen(hasSeenIntro(player) ? { name: "map" } : { name: "intro" });
  }

  function finishIntro() {
    if (!store || !profile || !store.last) return;
    commit({
      ...store,
      players: {
        ...store.players,
        [store.last]: { ...profile, onboarded: true },
      },
    });
    setScreen({ name: "map" });
  }

  function logout() {
    if (!store) return;
    commit({ ...store, last: null });
    setScreen({ name: "welcome" });
  }

  function toggleMute() {
    if (!store) return;
    const muted = !store.muted;
    setMuted(muted);
    commit({ ...store, muted });
  }

  function handleFinish(levelId: number, attempt: number, r: PlayResult) {
    if (store && profile && store.last) {
      const prevStars = profile.stars[levelId] ?? 0;
      const updated: Profile = {
        ...profile,
        xp: profile.xp + r.xp,
        stars: r.passed
          ? { ...profile.stars, [levelId]: Math.max(prevStars, r.stars) }
          : profile.stars,
        bestStreak: Math.max(profile.bestStreak, r.bestStreak),
        plays: profile.plays + 1,
        lastPlayed: Date.now(),
      };
      commit({
        ...store,
        players: { ...store.players, [store.last]: updated },
      });
    }
    setScreen({ name: "result", levelId, result: r, attempt });
  }

  function renderScreen() {
    if (!store || screen.name === "loading") {
      return (
        <div className="flex flex-col items-center pt-32 text-center">
          <Mascot size={140} className="animate-bob" />
          <p className="font-display title-sticker mt-4 text-3xl">
            Sebentar ya...
          </p>
        </div>
      );
    }

    if (screen.name === "welcome" || !profile) {
      const players = Object.values(store.players).sort(
        (a, b) => b.lastPlayed - a.lastPlayed,
      );
      return <Welcome players={players} onLogin={login} />;
    }

    if (screen.name === "intro") {
      return (
        <Onboarding
          name={profile.name}
          avatar={profile.avatar}
          onDone={finishIntro}
        />
      );
    }

    if (screen.name === "map") {
      return (
        <LevelMap
          profile={profile}
          muted={store.muted}
          onToggleMute={toggleMute}
          onOpenLevel={(id) => setScreen({ name: "lesson", levelId: id })}
          onLogout={logout}
        />
      );
    }

    const level = getLevel(screen.levelId);
    if (!level) {
      return (
        <div className="pt-20 text-center">
          <p className="font-display text-3xl">Level tidak ditemukan</p>
          <button
            onClick={() => setScreen({ name: "map" })}
            className="btn tap btn-fern mt-6"
          >
            Kembali ke peta
          </button>
        </div>
      );
    }

    if (screen.name === "lesson") {
      return (
        <Lesson
          level={level}
          onBack={() => setScreen({ name: "map" })}
          onStart={() =>
            setScreen({ name: "play", levelId: level.id, attempt: 1 })
          }
        />
      );
    }

    if (screen.name === "play") {
      const attempt = screen.attempt;
      return (
        <Play
          key={`${level.id}-${attempt}`}
          level={level}
          avatar={profile.avatar}
          onQuit={() => setScreen({ name: "map" })}
          onFinish={(r) => handleFinish(level.id, attempt, r)}
        />
      );
    }

    // screen.name === "result"
    const hasNext =
      screen.result.passed && LEVELS.some((l) => l.id === level.id + 1);
    return (
      <Result
        playerName={profile.name}
        level={level}
        result={screen.result}
        xpBefore={profile.xp - screen.result.xp}
        xpAfter={profile.xp}
        hasNext={hasNext}
        onRetry={() =>
          setScreen({
            name: "play",
            levelId: level.id,
            attempt: screen.attempt + 1,
          })
        }
        onLesson={() => setScreen({ name: "lesson", levelId: level.id })}
        onNext={() => setScreen({ name: "lesson", levelId: level.id + 1 })}
        onMap={() => setScreen({ name: "map" })}
      />
    );
  }

  return (
    <main className="relative min-h-dvh overflow-x-hidden">
      <Backdrop />
      <div className="relative z-10 mx-auto w-full max-w-3xl px-4 pt-5 pb-12 sm:px-6">
        {renderScreen()}
      </div>
    </main>
  );
}
