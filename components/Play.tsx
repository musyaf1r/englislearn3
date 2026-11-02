"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Level } from "@/lib/types";
import { pick } from "@/lib/utils";
import { sfx, speak } from "@/lib/sound";
import { CheckIcon, CrossIcon, FlameIcon, HeartIcon, Mascot, SoundIcon } from "./art";
import { ChoiceView, MatchView, OrderView } from "./QuestionViews";

export type PlayResult = {
  passed: boolean;
  stars: number;
  xp: number;
  mistakes: number;
  bestStreak: number;
  correct: number;
  total: number;
};

type Feedback = {
  ok: boolean;
  message: string;
  detail?: string;
  hint?: string;
  say?: string;
};

const CHEERS = ["Hebat!", "Keren!", "Mantap!", "Pintar sekali!", "Betul!", "Luar biasa!"];
const OOPS = ["Hampir benar.", "Belum tepat.", "Tidak apa-apa, ayo belajar.", "Coba perhatikan lagi."];

type Props = {
  level: Level;
  avatar: string;
  onFinish: (result: PlayResult) => void;
  onQuit: () => void;
};

export default function Play({ level, avatar, onFinish, onQuit }: Props) {
  const total = level.questions.length;

  // Soal yang salah dimasukkan lagi ke akhir antrian supaya bisa diulang.
  const [queue, setQueue] = useState<number[]>(() =>
    level.questions.map((_, i) => i),
  );
  const [pos, setPos] = useState(0);
  const [hearts, setHearts] = useState(level.hearts);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [done, setDone] = useState(0);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  // Satu soal hanya boleh mengurangi satu nyawa.
  const penalized = useRef(false);

  const registerMistake = useCallback(() => {
    if (penalized.current) return;
    penalized.current = true;
    sfx.wrong();
    setHearts((h) => Math.max(0, h - 1));
    setMistakes((m) => m + 1);
    setStreak(0);
  }, []);

  // Nyawa habis di tengah soal pasangkan: tampilkan panel umpan balik.
  useEffect(() => {
    if (hearts <= 0 && feedback === null) {
      setFeedback({
        ok: false,
        message: "Nyawamu habis.",
        detail: "Tidak apa-apa. Kamu bisa mencobanya lagi.",
      });
    }
  }, [hearts, feedback]);

  const q = level.questions[queue[pos]];

  function resolve(ok: boolean, answerText: string) {
    if (feedback !== null) return;
    if (ok) {
      const clean = !penalized.current;
      const newStreak = clean ? streak + 1 : 0;
      const gain = clean ? 10 + (newStreak >= 3 ? 5 : 0) : 5;
      sfx.correct();
      setStreak(newStreak);
      setBestStreak((b) => Math.max(b, newStreak));
      setXp((x) => x + gain);
      setDone((d) => d + 1);
      setFeedback({
        ok: true,
        message: pick(CHEERS),
        detail:
          clean && newStreak >= 3
            ? `Benar ${newStreak} kali berturut-turut. +${gain} XP`
            : `+${gain} XP`,
        say: answerText || undefined,
      });
      if (answerText) speak(answerText);
    } else {
      registerMistake();
      setQueue((qq) => [...qq, queue[pos]]);
      setFeedback({
        ok: false,
        message: pick(OOPS),
        detail: answerText ? `Jawaban yang benar: ${answerText}` : undefined,
        hint: q.hint,
        say: answerText || undefined,
      });
    }
  }

  function finish(passed: boolean) {
    const stars = !passed ? 0 : mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
    const bonus = passed ? stars * 10 : 0;
    onFinish({
      passed,
      stars,
      xp: xp + bonus,
      mistakes,
      bestStreak,
      correct: done,
      total,
    });
  }

  function next() {
    sfx.tap();
    if (hearts <= 0) {
      finish(false);
      return;
    }
    const nextPos = pos + 1;
    if (nextPos >= queue.length) {
      finish(true);
      return;
    }
    penalized.current = false;
    setFeedback(null);
    setPos(nextPos);
  }

  const isLast = pos + 1 >= queue.length;
  const nextLabel =
    hearts <= 0 ? "Lihat hasil" : feedback?.ok && isLast ? "Selesai" : "Lanjut";

  const instruction =
    q.type === "choice"
      ? "Isi kata tanya yang hilang."
      : q.type === "order"
        ? "Susun kata menjadi pertanyaan."
        : "Pasangkan kata tanya dengan artinya.";

  const mood = feedback === null ? "happy" : feedback.ok ? "cheer" : "sad";

  return (
    <div className="mx-auto max-w-3xl pb-64">
      <div className="panel mb-4 flex flex-wrap items-center gap-3 p-3">
        <button
          aria-label="Keluar dari level"
          onClick={() => {
            if (
              window.confirm(
                "Keluar dari level ini? Kemajuan level ini tidak disimpan.",
              )
            ) {
              onQuit();
            }
          }}
          className="btn btn-paper btn-icon btn-sm tap"
        >
          <CrossIcon size={22} />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold tracking-[0.15em] text-ink/50 uppercase">
            Level {level.id}
          </p>
          <p className="font-display truncate text-lg leading-tight sm:text-xl">
            {level.name}
          </p>
        </div>
        <div className="flex gap-0.5 rounded-full bg-[#fbf0ef] px-2 py-1" role="img" aria-label={`${hearts} nyawa tersisa`}>
          {Array.from({ length: level.hearts }, (_, i) => (
            <HeartIcon key={i} filled={i < hearts} size={25} />
          ))}
        </div>
      </div>

      <div className="mb-5 flex items-center gap-3 px-1">
        <div
          className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/80"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={done}
          aria-label="Kemajuan level"
        >
          <div
            className="h-full rounded-full bg-fern transition-all duration-500"
            style={{ width: `${Math.round((done / total) * 100)}%` }}
          />
        </div>
        <span className="text-sm font-bold text-ink/60">
          {done}/{total}
        </span>
      </div>

      <div className="mb-5 flex items-center gap-3">
        <Mascot mood={mood} size={62} className="shrink-0" />
        <div className="panel flex-1 px-4 py-2 text-base leading-snug font-bold sm:text-lg">
          {instruction}
        </div>
        {streak >= 2 && (
          <span className="font-display flex shrink-0 items-center gap-1 rounded-full border border-white bg-sun px-3 py-1 text-lg shadow-sm">
            <FlameIcon size={24} />
            {streak}
          </span>
        )}
      </div>

      <div key={pos}>
        {q.type === "choice" && (
          <ChoiceView
            q={q}
            avatar={avatar}
            disabled={feedback !== null}
            onResolve={resolve}
          />
        )}
        {q.type === "order" && (
          <OrderView q={q} disabled={feedback !== null} onResolve={resolve} />
        )}
        {q.type === "match" && (
          <MatchView
            q={q}
            disabled={feedback !== null}
            onResolve={resolve}
            onMistake={registerMistake}
          />
        )}
      </div>

      {feedback && (
        <div
          role="status"
          className={`animate-slideup fixed inset-x-0 bottom-0 z-30 border-t border-ink/10 px-4 pt-3 pb-5 shadow-[0_-12px_36px_rgba(24,48,68,0.12)] backdrop-blur-md ${
            feedback.ok ? "bg-[#e1f3ee]/95" : "bg-[#fde9e7]/95"
          }`}
        >
          <div className="mx-auto flex max-w-2xl flex-col gap-4">
            <div className="flex items-start gap-3">
              <span
                className={`grid size-12 shrink-0 place-items-center rounded-full border border-ink/10 shadow-sm ${
                  feedback.ok ? "bg-fern" : "bg-melon"
                }`}
              >
                {feedback.ok ? <CheckIcon size={26} /> : <CrossIcon size={26} />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-display text-2xl leading-tight">
                  {feedback.message}
                </p>
                {feedback.detail && (
                  <p className="mt-1 text-lg font-bold">{feedback.detail}</p>
                )}
                {feedback.hint && (
                  <p className="mt-1 text-base">Petunjuk: {feedback.hint}</p>
                )}
              </div>
              {feedback.say && (
                <button
                  onClick={() => speak(feedback.say ?? "", true)}
                  aria-label="Dengar kalimatnya"
                  className="btn btn-paper btn-icon btn-sm tap shrink-0"
                >
                  <SoundIcon size={24} />
                </button>
              )}
            </div>
            <button
              onClick={next}
              className={`btn tap w-full ${feedback.ok ? "btn-fern" : "btn-melon"}`}
            >
              {nextLabel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
