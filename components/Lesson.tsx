"use client";

import type { Level } from "@/lib/types";
import { sfx, speak } from "@/lib/sound";
import { colorOf, wordStyle } from "@/lib/wordstyle";
import { BackIcon, LevelIcon, Shape, SoundIcon } from "./art";

type Props = {
  level: Level;
  onStart: () => void;
  onBack: () => void;
};

export default function Lesson({ level, onStart, onBack }: Props) {
  return (
    <div className="animate-pop mx-auto max-w-3xl pb-6">
      <button onClick={onBack} className="btn btn-paper btn-sm tap">
        <BackIcon size={20} />
        Peta
      </button>

      <div
        className="panel mt-4 flex items-center gap-4 p-4"
        style={{ background: level.colors[0] }}
      >
        <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-white/70 sm:size-[76px]">
          <LevelIcon id={level.id} size={62} />
        </div>
        <div>
          <p className="text-xs font-bold tracking-[0.15em] text-ink/55 uppercase">
            Level {level.id}
          </p>
          <h2 className="font-display text-2xl leading-tight sm:text-3xl">{level.name}</h2>
          <p className="mt-1 text-sm leading-snug font-bold text-ink/75 sm:text-base">
            {level.intro}
          </p>
        </div>
      </div>

      <h3 className="font-display mt-7 text-2xl sm:text-3xl">Belajar dulu</h3>
      <p className="mt-1 mb-4 text-sm text-ink/65 sm:text-base">
        Dengarkan pengucapan, lalu lihat contoh penggunaannya.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {level.lesson.map((item) => {
          const ws = wordStyle(item.word);
          return (
            <div
              key={item.word}
              className="panel p-4"
              style={{ background: colorOf(item.word) }}
            >
              <div className="flex items-center gap-3">
                {ws && <Shape id={ws.shape} color="#FFFFFF" size={42} />}
                <p className="font-display flex-1 text-3xl leading-none sm:text-4xl">
                  {item.word}
                </p>
                <button
                  onClick={() => speak(item.word, true)}
                  aria-label={`Dengar ${item.word}`}
                  className="btn btn-paper btn-icon btn-sm tap"
                >
                  <SoundIcon size={24} />
                </button>
              </div>
              <p className="mt-2 text-base font-bold text-ink/75 sm:text-lg">
                Artinya: {item.meaning}
              </p>
              <div className="mt-3 flex items-center gap-2 rounded-2xl border border-ink/10 bg-white/80 p-3">
                <div className="flex-1">
                  <p className="text-base font-bold sm:text-lg">{item.example}</p>
                  <p className="text-sm text-ink/65">{item.exampleId}</p>
                </div>
                <button
                  onClick={() => speak(item.example, true)}
                  aria-label={`Dengar contoh kalimat ${item.word}`}
                  className="btn btn-sun btn-icon btn-sm tap"
                >
                  <SoundIcon size={22} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => {
          sfx.correct();
          onStart();
        }}
        className="btn tap btn-fern mt-7 w-full"
      >
        Mulai main
      </button>
    </div>
  );
}
