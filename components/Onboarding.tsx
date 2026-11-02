"use client";

import { useState } from "react";
import type { ChoiceQ } from "@/lib/types";
import { ALL_WORDS } from "@/lib/levels";
import { colorOf, wordStyle } from "@/lib/wordstyle";
import { sfx, speak } from "@/lib/sound";
import {
  BackIcon,
  CheckIcon,
  HeartIcon,
  Mascot,
  Shape,
  SoundIcon,
  StarIcon,
  type Mood,
} from "./art";
import { ChoiceView } from "./QuestionViews";

type Props = {
  name: string;
  avatar: string;
  onDone: () => void;
};

const STEP_TITLES = [
  "Apa itu kata tanya?",
  "Kenali semua kata tanya",
  "Cara bermain",
  "Coba satu soal",
];

const EXAMPLES = [
  { word: "What", sentence: "What do you bring?", id: "Kamu membawa apa?" },
  { word: "Where", sentence: "Where is the beach?", id: "Di mana pantainya?" },
  { word: "Who", sentence: "Who goes with you?", id: "Siapa yang pergi denganmu?" },
];

const PRACTICE: ChoiceQ = {
  type: "choice",
  prompt: "___ do you do at the beach?",
  reply: "I build a sandcastle.",
  options: ["What", "Where", "Who"],
  answer: "What",
  hint: "Membuat istana pasir adalah kegiatan, jadi kita bertanya tentang kegiatan.",
};

function Sticker({ word, size = 44 }: { word: string; size?: number }) {
  const ws = wordStyle(word);
  if (!ws) return null;
  return <Shape id={ws.shape} color="#FFFFFF" size={size} />;
}

function SpeakButton({ text, label }: { text: string; label: string }) {
  return (
    <button
      onClick={() => speak(text, true)}
      aria-label={label}
      className="btn btn-paper btn-icon btn-sm tap shrink-0"
    >
      <SoundIcon size={22} />
    </button>
  );
}

export default function Onboarding({ name, avatar, onDone }: Props) {
  const [step, setStep] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const [practice, setPractice] = useState<boolean | null>(null);

  const last = STEP_TITLES.length - 1;

  const bubble = [
    `Halo, ${name}! Kata tanya dipakai untuk bertanya. Dalam bahasa Inggris namanya question words.`,
    "Ada 10 kata tanya. Setiap kata punya warna dan bentuk sendiri supaya mudah diingat. Tekan kotaknya untuk mendengar suaranya.",
    "Ada tiga jenis soal. Kamu juga punya nyawa dan bisa mengumpulkan bintang.",
    practice === null
      ? "Sekarang coba dulu. Di sini nyawamu tidak akan berkurang."
      : practice
        ? "Betul! Kamu sudah siap berpetualang."
        : "Belum tepat, tapi tidak apa-apa. Baca petunjuknya, lalu coba lagi.",
  ][step];

  const mood: Mood = step === last && practice !== null ? (practice ? "cheer" : "sad") : "happy";

  function go(delta: number) {
    sfx.tap();
    setStep((s) => Math.min(last, Math.max(0, s + delta)));
  }

  return (
    <div className="mx-auto max-w-3xl pb-6">
      <div
        className="flex gap-2"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={STEP_TITLES.length}
        aria-valuenow={step + 1}
        aria-label={`Langkah ${step + 1} dari ${STEP_TITLES.length}`}
      >
        {STEP_TITLES.map((t, i) => (
          <div
            key={t}
            className="h-2 flex-1 rounded-full"
            style={{ background: i <= step ? "#42a995" : "#dce8e9" }}
          />
        ))}
      </div>

      <div className="mt-5 flex items-center gap-3">
        <Mascot mood={mood} size={76} className="shrink-0" />
        <div className="panel flex-1 px-4 py-3 text-base leading-snug font-bold sm:text-lg">
          {bubble}
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-xs font-bold tracking-[0.18em] text-ink/50 uppercase">
          Langkah {step + 1} dari {STEP_TITLES.length}
        </p>
        <h2 className="font-display title-sticker mt-1 text-3xl leading-tight sm:text-4xl">
          {STEP_TITLES[step]}
        </h2>
      </div>

      <div key={step} className="animate-pop mt-5">
        {step === 0 && (
          <div className="flex flex-col gap-4">
            {EXAMPLES.map((ex) => (
              <div
                key={ex.word}
                className="panel flex items-center gap-3 p-3"
                style={{ background: colorOf(ex.word) }}
              >
                <Sticker word={ex.word} size={52} />
                <div className="min-w-0 flex-1">
                  <p className="font-display text-2xl leading-tight">{ex.sentence}</p>
                  <p className="text-base font-bold">{ex.id}</p>
                </div>
                <SpeakButton text={ex.sentence} label={`Dengar ${ex.sentence}`} />
              </div>
            ))}
            <p className="px-1 text-center text-lg font-bold">
              Kata pertama di setiap pertanyaan itulah kata tanyanya.
            </p>
          </div>
        )}

        {step === 1 && (
          <div className="grid grid-cols-2 gap-3">
            {ALL_WORDS.map((w) => (
              <button
                key={w.word}
                onClick={() => {
                  sfx.tap();
                  speak(w.word, true);
                }}
                aria-label={`${w.word}, artinya ${w.meaning}. Tekan untuk mendengar.`}
                className="tap tile flex flex-col items-start gap-1 p-3 text-left"
                style={{ background: colorOf(w.word) }}
              >
                <span className="flex w-full items-center gap-2">
                  <Sticker word={w.word} size={36} />
                  <span className="font-display text-2xl leading-none">{w.word}</span>
                </span>
                <span className="text-base leading-tight font-bold">{w.meaning}</span>
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4">
            <div className="panel p-4">
              <p className="font-display text-2xl">Isi kata yang hilang</p>
              <p className="mt-2 flex flex-wrap items-center gap-2 text-xl font-bold">
                <span className="font-display inline-block min-w-14 rounded-xl border border-dashed border-ink/25 bg-white px-2 text-center text-ink/40">
                  ?
                </span>
                is the beach?
              </p>
              <p className="mt-2 text-base">Pilih kata tanya yang pas.</p>
            </div>
            <div className="panel p-4">
              <p className="font-display text-2xl">Susun kata</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {["When", "do", "you", "go", "?"].map((w) => (
                  <span
                    key={w}
                    className="font-display rounded-xl border border-ink/10 px-3 py-1 text-xl"
                    style={{ background: colorOf(w, "#FFFFFF") }}
                  >
                    {w}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-base">Susun jadi pertanyaan yang benar.</p>
            </div>
            <div className="panel p-4">
              <p className="font-display text-2xl">Pasangkan</p>
              <div className="mt-2 flex items-center gap-3 text-xl font-bold">
                <span
                  className="font-display flex items-center gap-2 rounded-xl border border-ink/10 px-3 py-1"
                  style={{ background: colorOf("Where") }}
                >
                  <Sticker word="Where" size={26} />
                  Where
                </span>
                <span aria-hidden>dan</span>
                <span className="rounded-xl border border-ink/10 bg-paper px-3 py-1 whitespace-nowrap">
                  di mana
                </span>
              </div>
              <p className="mt-2 text-base">Cocokkan kata dengan artinya.</p>
            </div>

            <div className="panel flex flex-col gap-3 p-4 text-lg font-bold">
              <div className="flex items-center gap-3">
                <span className="flex shrink-0 gap-0.5" aria-hidden>
                  {[0, 1, 2].map((i) => (
                    <HeartIcon key={i} size={28} />
                  ))}
                </span>
                <span>Setiap salah, satu nyawa berkurang. Soal yang salah akan muncul lagi.</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex shrink-0 gap-0.5" aria-hidden>
                  {[0, 1, 2].map((i) => (
                    <StarIcon key={i} size={28} />
                  ))}
                </span>
                <span>Selesai tanpa salah, kamu dapat 3 bintang.</span>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <ChoiceView
              key={attempt}
              q={PRACTICE}
              avatar={avatar}
              disabled={practice !== null}
              onResolve={(ok) => {
                if (ok) sfx.correct();
                else sfx.wrong();
                setPractice(ok);
              }}
            />

            {practice !== null && (
              <div
                role="status"
                className="panel animate-pop mt-6 p-4"
                style={{ background: practice ? "#e1f3ee" : "#fde9e7" }}
              >
                {practice ? (
                  <>
                    <p className="font-display flex items-center gap-2 text-2xl">
                      <CheckIcon size={26} />
                      Betul! What do you do at the beach?
                    </p>
                    <p className="mt-1 text-lg">
                      Artinya: Kamu melakukan apa di pantai?
                    </p>
                    <button
                      onClick={() => {
                        sfx.win();
                        onDone();
                      }}
                      className="btn tap btn-fern mt-4 w-full"
                    >
                      Ke peta petualangan
                    </button>
                  </>
                ) : (
                  <>
                    <p className="font-display text-2xl">Belum tepat</p>
                    <p className="mt-1 text-lg">Petunjuk: {PRACTICE.hint}</p>
                    <button
                      onClick={() => {
                        sfx.tap();
                        setPractice(null);
                        setAttempt((a) => a + 1);
                      }}
                      className="btn tap btn-melon mt-4 w-full"
                    >
                      Coba lagi
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {step < last && (
        <div className="mt-7 flex gap-3">
          {step > 0 && (
            <button
              onClick={() => go(-1)}
              aria-label="Langkah sebelumnya"
              className="btn btn-paper btn-icon tap shrink-0"
            >
              <BackIcon size={26} />
            </button>
          )}
          <button onClick={() => go(1)} className="btn tap btn-fern flex-1">
            Lanjut
          </button>
        </div>
      )}
      {step === last && practice === null && (
        <div className="mt-7 flex">
          <button
            onClick={() => go(-1)}
            aria-label="Langkah sebelumnya"
            className="btn btn-paper btn-icon tap"
          >
            <BackIcon size={26} />
          </button>
        </div>
      )}
    </div>
  );
}
