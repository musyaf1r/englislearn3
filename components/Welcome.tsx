"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import type { Profile } from "@/lib/types";
import { sfx } from "@/lib/sound";
import { AVATAR_IDS, Avatar, CheckIcon, Mascot } from "./art";

type Props = {
  players: Profile[];
  onLogin: (name: string, avatar: string) => void;
};

export default function Welcome({ players, onLogin }: Props) {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(AVATAR_IDS[0]);
  const [error, setError] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    const clean = name.trim().replace(/\s+/g, " ");
    if (clean.length < 2) {
      setError("Tulis namamu dulu, minimal 2 huruf.");
      return;
    }
    sfx.correct();
    onLogin(clean, avatar);
  }

  return (
    <div className="flex flex-col items-center pt-3 sm:pt-8">
      <p className="mb-1 text-xs font-bold tracking-[0.2em] text-ink/55 uppercase">
        Belajar sambil berpetualang
      </p>
      <h1 className="font-display title-sticker text-center text-5xl leading-tight sm:text-6xl">
        Holiday Quest
      </h1>
      <p className="mt-1 text-center text-base font-bold text-ink/65 sm:text-lg">
        Petualangan seru belajar question words
      </p>

      <div className="mt-5 flex w-full max-w-lg items-center gap-3">
        <Mascot size={88} className="animate-bob shrink-0" />
        <div className="panel flex-1 px-4 py-3 text-base leading-snug font-bold sm:text-lg">
          Hai, aku Kiko! Ayo belajar bertanya sambil liburan. Siapa namamu?
        </div>
      </div>

      <form onSubmit={submit} className="panel mt-4 w-full max-w-lg p-5 sm:p-7">
        <label htmlFor="name" className="block text-xl font-bold">
          Namamu
        </label>
        <input
          id="name"
          value={name}
          maxLength={12}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setName(e.target.value);
            setError("");
          }}
          placeholder="Ketik di sini"
          autoComplete="off"
          aria-describedby={error ? "name-error" : undefined}
          className="mt-2 w-full rounded-xl border border-ink/15 bg-[#f7fafb] px-4 py-3 text-xl font-bold placeholder:text-ink/35 focus:border-fern focus:bg-white focus:outline-none sm:text-2xl"
        />
        {error && (
          <p
            id="name-error"
            role="alert"
            className="animate-shake mt-2 text-lg font-bold text-melon"
          >
            {error}
          </p>
        )}

        <p className="mt-5 text-lg font-bold">Pilih teman petualanganmu</p>
        <div className="mt-2 grid grid-cols-3 gap-3">
          {AVATAR_IDS.map((id) => {
            const on = avatar === id;
            return (
              <button
                key={id}
                type="button"
                aria-pressed={on}
                aria-label={`Teman ${id}`}
                onClick={() => {
                  sfx.tap();
                  setAvatar(id);
                }}
                className="tap tile relative flex justify-center p-2"
                style={{ background: on ? "#e1f3ee" : undefined }}
              >
                <Avatar id={id} size={68} />
                {on && (
                  <span className="absolute -top-2 -right-2 grid size-7 place-items-center rounded-full border border-white bg-fern text-white shadow-sm">
                    <CheckIcon size={16} />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <button type="submit" className="btn tap btn-fern mt-6 w-full">
          Mulai main
        </button>
        <p className="mt-3 text-center text-base text-ink/70">
          Namamu hanya disimpan di perangkat ini.
        </p>
      </form>

      {players.length > 0 && (
        <div className="panel mt-5 w-full max-w-lg p-5 sm:p-7">
          <p className="text-xl font-bold">Sudah pernah main? Pilih namamu.</p>
          <div className="mt-3 flex flex-col gap-3">
            {players.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => {
                  sfx.correct();
                  onLogin(p.name, p.avatar);
                }}
                className="tap tile flex items-center gap-3 p-2 pr-4 text-left"
              >
                <Avatar id={p.avatar} size={52} />
                <span className="font-display min-w-0 flex-1 truncate text-xl">
                  {p.name}
                </span>
                <span className="rounded-full bg-lagoon px-3 py-1 text-sm font-bold text-ink/70">
                  {p.xp} XP
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
