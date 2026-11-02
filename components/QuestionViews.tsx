"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ChoiceQ, MatchQ, OrderQ } from "@/lib/types";
import { shuffle } from "@/lib/utils";
import { sfx, speak } from "@/lib/sound";
import { colorOf, wordStyle } from "@/lib/wordstyle";
import { Avatar, CheckIcon, CrossIcon, Shape } from "./art";

type Base = {
  /** true saat panel umpan balik tampil: semua tombol dikunci. */
  disabled: boolean;
  onResolve: (ok: boolean, answerText: string) => void;
};

const RIGHT = "#e1f3ee";
const WRONG = "#fde9e7";
const PAPER = "#FFFFFF";

/* ------------------------------------------------------------------ */
/* Isi kata tanya yang hilang                                          */
/* ------------------------------------------------------------------ */
export function ChoiceView({
  q,
  disabled,
  onResolve,
  avatar,
}: Base & { q: ChoiceQ; avatar: string }) {
  const options = useMemo(() => shuffle(q.options), [q]);
  const [picked, setPicked] = useState<string | null>(null);
  const [before, after] = q.prompt.split("___");
  const full = q.prompt.replace("___", q.answer);

  function choose(o: string) {
    if (picked !== null || disabled) return;
    sfx.tap();
    setPicked(o);
    onResolve(o === q.answer, full);
  }

  const slotCls =
    picked === null
      ? "border-dashed border-ink/25 bg-white text-ink/40"
      : picked === q.answer
        ? "border-solid border-ink/15 bg-[#e1f3ee]"
        : "border-solid border-ink/15 bg-[#fde9e7]";

  return (
    <div className="animate-pop">
      <div className="panel px-5 py-6 text-center text-3xl leading-snug font-bold sm:text-4xl">
        {before}
        <span
          className={`font-display mx-1 inline-block min-w-[4.5rem] rounded-xl border-2 px-2 align-baseline ${slotCls}`}
        >
          {picked ?? " "}
        </span>
        {after}
      </div>

      <div className="mt-4 flex items-end justify-end gap-3">
        <div className="panel max-w-[75%] rounded-3xl rounded-br-md bg-[#e6f3f4] px-4 py-3 text-base leading-snug font-bold sm:text-lg">
          {q.reply}
        </div>
        <Avatar id={avatar} size={60} className="shrink-0" />
      </div>

      <p className="mt-6 text-center text-lg font-bold">
        Pilih kata yang pas untuk mengisi titik-titik.
      </p>

      <div className="mt-3 grid grid-cols-2 gap-4">
        {options.map((o) => {
          const ws = wordStyle(o);
          const isAns = o === q.answer;
          const isPick = o === picked;
          let bg = ws ? ws.bg : PAPER;
          let state: "idle" | "right" | "wrong" | "dim" = "idle";
          if (picked !== null) {
            if (isAns) {
              state = "right";
              bg = RIGHT;
            } else if (isPick) {
              state = "wrong";
              bg = WRONG;
            } else {
              state = "dim";
            }
          }
          return (
            <button
              key={o}
              onClick={() => choose(o)}
              disabled={picked !== null || disabled}
              className={`tap tile flex min-h-[84px] items-center justify-center gap-3 px-3 text-2xl ${
                state === "wrong" ? "animate-shake" : ""
              } ${state === "dim" ? "opacity-40" : ""}`}
              style={{ background: bg }}
            >
              {ws && state === "idle" && (
                <Shape id={ws.shape} color={PAPER} size={34} />
              )}
              <span className="font-display">{o}</span>
              {state === "right" && <CheckIcon size={28} />}
              {state === "wrong" && <CrossIcon size={28} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Susun kata menjadi pertanyaan                                       */
/* ------------------------------------------------------------------ */
function joinWords(words: string[]): string {
  return words.join(" ").replace(/ ([?!.,])/g, "$1");
}

export function OrderView({ q, disabled, onResolve }: Base & { q: OrderQ }) {
  const tiles = useMemo(
    () =>
      shuffle([...q.words, ...(q.extra ?? [])].map((w, i) => ({ id: i, w }))),
    [q],
  );
  const byId = useMemo(
    () => new Map(tiles.map((t) => [t.id, t.w] as const)),
    [tiles],
  );
  const [chosen, setChosen] = useState<number[]>([]);
  const [result, setResult] = useState<boolean | null>(null);
  const answer = joinWords(q.words);
  const locked = result !== null || disabled;

  function add(id: number) {
    if (locked) return;
    sfx.tap();
    setChosen((c) => [...c, id]);
  }

  function remove(id: number) {
    if (locked) return;
    sfx.tap();
    setChosen((c) => c.filter((x) => x !== id));
  }

  function check() {
    if (locked || chosen.length === 0) return;
    const built = joinWords(chosen.map((id) => byId.get(id) ?? ""));
    const ok = built === answer;
    setResult(ok);
    onResolve(ok, answer);
  }

  const areaCls =
    result === null
      ? "border-dashed border-ink/25 bg-white"
      : result
        ? "border-solid border-ink/15 bg-[#e1f3ee]"
        : "animate-shake border-solid border-ink/15 bg-[#fde9e7]";

  return (
    <div className="animate-pop">
      <div className="panel px-5 py-5 text-center">
        <p className="text-base font-bold text-ink/70">Tulis dalam bahasa Inggris</p>
        <p className="mt-1 text-3xl leading-snug font-bold">{q.meaning}</p>
      </div>

      <div
        className={`mt-5 flex min-h-[104px] flex-wrap content-start gap-3 rounded-2xl border p-3 ${areaCls}`}
      >
        {chosen.length === 0 && (
          <span className="m-auto text-lg font-bold text-ink/45">
            Tekan kata di bawah untuk menaruhnya di sini
          </span>
        )}
        {chosen.map((id, i) => (
          <button
            key={`${id}-${i}`}
            onClick={() => remove(id)}
            disabled={locked}
            aria-label={`Lepas kata ${byId.get(id)}`}
            className="tap tile animate-pop px-4 py-2 text-2xl"
            style={{ background: colorOf(byId.get(id) ?? "", PAPER) }}
          >
            <span className="font-display">{byId.get(id)}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {tiles.map((t) => {
          const used = chosen.includes(t.id);
          return (
            <button
              key={t.id}
              onClick={() => add(t.id)}
              disabled={used || locked}
              className={`tap tile px-4 py-2 text-2xl ${used ? "opacity-0" : ""}`}
              style={{ background: colorOf(t.w, PAPER) }}
            >
              <span className="font-display">{t.w}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-7">
        <button
          onClick={check}
          disabled={chosen.length === 0 || locked}
          className="btn tap btn-fern w-full"
        >
          Periksa jawaban
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Pasangkan kata tanya dengan artinya                                 */
/* ------------------------------------------------------------------ */
export function MatchView({
  q,
  disabled,
  onResolve,
  onMistake,
}: Base & { q: MatchQ; onMistake: () => void }) {
  const left = useMemo(
    () => shuffle(q.pairs.map((p, i) => ({ i, t: p.left }))),
    [q],
  );
  const right = useMemo(
    () => shuffle(q.pairs.map((p, i) => ({ i, t: p.right }))),
    [q],
  );
  const [selL, setSelL] = useState<number | null>(null);
  const [selR, setSelR] = useState<number | null>(null);
  const [matched, setMatched] = useState<number[]>([]);
  const [wrong, setWrong] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const list = timers.current;
    return () => list.forEach((t) => window.clearTimeout(t));
  }, []);

  function later(fn: () => void, ms: number) {
    timers.current.push(window.setTimeout(fn, ms));
  }

  function evaluate(l: number, r: number) {
    if (l === r) {
      const next = [...matched, l];
      setMatched(next);
      setSelL(null);
      setSelR(null);
      sfx.pair();
      if (next.length === q.pairs.length) {
        later(() => onResolve(true, ""), 450);
      }
    } else {
      setWrong(true);
      onMistake();
      later(() => {
        setWrong(false);
        setSelL(null);
        setSelR(null);
      }, 700);
    }
  }

  const blocked = disabled || wrong;

  function tapLeft(i: number) {
    if (blocked || matched.includes(i)) return;
    sfx.tap();
    speak(q.pairs[i].left);
    setSelL(i);
    if (selR !== null) evaluate(i, selR);
  }

  function tapRight(i: number) {
    if (blocked || matched.includes(i)) return;
    sfx.tap();
    setSelR(i);
    if (selL !== null) evaluate(selL, i);
  }

  function bgOf(index: number, selected: number | null, base: string) {
    if (matched.includes(index)) return colorOf(q.pairs[index].left, RIGHT);
    if (selected === index) return wrong ? WRONG : "#FFD23F";
    return base;
  }

  return (
    <div className="animate-pop">
      <div className="panel px-5 py-4 text-center text-xl font-bold">
        Tekan satu kata di kiri, lalu artinya di kanan.
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-4">
          {left.map((it) => {
            const ws = wordStyle(it.t);
            const done = matched.includes(it.i);
            return (
              <button
                key={it.i}
                onClick={() => tapLeft(it.i)}
                disabled={done}
                className={`tap tile flex min-h-[72px] items-center justify-center gap-2 px-2 text-xl ${
                  wrong && selL === it.i ? "animate-shake" : ""
                }`}
                style={{ background: bgOf(it.i, selL, ws ? ws.bg : PAPER) }}
              >
                {ws && <Shape id={ws.shape} color={PAPER} size={28} />}
                <span className="font-display">{it.t}</span>
                {done && <CheckIcon size={22} />}
              </button>
            );
          })}
        </div>
        <div className="flex flex-col gap-4">
          {right.map((it) => {
            const done = matched.includes(it.i);
            return (
              <button
                key={it.i}
                onClick={() => tapRight(it.i)}
                disabled={done}
                className={`tap tile flex min-h-[72px] items-center justify-center gap-2 px-2 text-lg font-bold ${
                  wrong && selR === it.i ? "animate-shake" : ""
                }`}
                style={{ background: bgOf(it.i, selR, PAPER) }}
              >
                {it.t}
                {done && <CheckIcon size={22} />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
