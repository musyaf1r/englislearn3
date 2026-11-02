"use client";

import { useEffect } from "react";
import type { Level } from "@/lib/types";
import { LEVELS } from "@/lib/levels";
import { getRank } from "@/lib/ranks";
import { sfx } from "@/lib/sound";
import Confetti from "./Confetti";
import type { PlayResult } from "./Play";
import { FlameIcon, Mascot, StarIcon } from "./art";

type Props = {
  level: Level;
  result: PlayResult;
  xpBefore: number;
  xpAfter: number;
  hasNext: boolean;
  onRetry: () => void;
  onLesson: () => void;
  onNext: () => void;
  onMap: () => void;
};

export default function Result({
  level,
  result,
  xpBefore,
  xpAfter,
  hasNext,
  onRetry,
  onLesson,
  onNext,
  onMap,
}: Props) {
  useEffect(() => {
    if (result.passed) sfx.win();
    else sfx.lose();
  }, [result.passed]);

  const before = getRank(xpBefore);
  const after = getRank(xpAfter);
  const rankUp = after.idx > before.idx;
  const isBoss = level.id === LEVELS.length;

  const title = !result.passed
    ? "Nyawamu habis"
    : isBoss
      ? "Kamu Raja Liburan!"
      : result.stars === 3
        ? "Sempurna!"
        : result.stars === 2
          ? "Hebat sekali!"
          : "Kamu berhasil!";

  const message = !result.passed
    ? "Tidak apa-apa. Baca pelajarannya sekali lagi, lalu coba lagi. Kamu pasti bisa."
    : result.stars === 3
      ? "Tidak ada satu pun yang salah. Pintar sekali!"
      : "Main lagi tanpa salah untuk mendapat 3 bintang.";

  return (
    <div className="animate-pop pt-2 text-center">
      {result.passed && <Confetti />}

      <div className="panel mx-auto max-w-lg p-5 sm:p-7">
        <div className="relative mx-auto w-fit">
          <Mascot
            mood={result.passed ? "cheer" : "sad"}
            size={132}
            className="animate-bob"
          />
          {result.passed && (
            <div
              className="animate-stamp font-display absolute -right-10 bottom-1 rounded-full border border-ink/10 bg-white px-3 py-1 text-sm text-fern shadow-sm"
              aria-hidden
            >
              LULUS
            </div>
          )}
        </div>

        <h2 className="font-display title-sticker mt-3 text-4xl leading-tight sm:text-5xl">
          {title}
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-base leading-snug font-bold text-ink/70 sm:text-lg">
          {message}
        </p>

        {result.passed && (
          <div className="mt-4 flex justify-center gap-1">
            {[1, 2, 3].map((n) => (
              <span
                key={n}
                className="animate-pop"
                style={{ animationDelay: `${n * 0.3}s` }}
              >
                <StarIcon filled={n <= result.stars} size={56} />
              </span>
            ))}
          </div>
        )}

        <div className="mx-auto mt-6 grid grid-cols-3 gap-2 sm:gap-3">
          <div className="rounded-2xl bg-lagoon p-3">
            <p className="font-display text-3xl">+{result.xp}</p>
            <p className="text-sm font-bold text-ink/60">XP</p>
          </div>
          <div className="rounded-2xl bg-lagoon p-3">
            <p className="font-display text-3xl">
              {result.correct}/{result.total}
            </p>
            <p className="text-sm font-bold text-ink/60">Benar</p>
          </div>
          <div className="rounded-2xl bg-lagoon p-3">
            <p className="font-display flex items-center justify-center gap-1 text-3xl">
              <FlameIcon size={28} />
              {result.bestStreak}
            </p>
            <p className="text-sm font-bold text-ink/60">Beruntun</p>
          </div>
        </div>

        {rankUp && (
          <div className="animate-pop mx-auto mt-5 max-w-md rounded-2xl bg-[#fbf4df] p-4">
            <p className="text-sm font-bold text-ink/60">Pangkat baru</p>
            <p className="font-display text-3xl">{after.cur.name}</p>
          </div>
        )}

        <div className="mx-auto mt-6 flex max-w-md flex-col gap-3">
          {result.passed ? (
            <>
              {hasNext && (
                <button onClick={onNext} className="btn tap btn-fern">
                  Level berikutnya
                </button>
              )}
              <button onClick={onRetry} className="btn tap btn-paper">
                Main lagi
              </button>
            </>
          ) : (
            <>
              <button onClick={onRetry} className="btn tap btn-fern">
                Coba lagi
              </button>
              <button onClick={onLesson} className="btn tap btn-paper">
                Baca pelajaran
              </button>
            </>
          )}
          <button onClick={onMap} className="btn btn-paper btn-sm tap mx-auto">
            Kembali ke peta
          </button>
        </div>
      </div>
    </div>
  );
}
