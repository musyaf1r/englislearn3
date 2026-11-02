"use client";

import type { Profile } from "@/lib/types";
import { LEVELS } from "@/lib/levels";
import { getRank } from "@/lib/ranks";
import { Avatar, INK, LevelIcon, LockIcon, SoundIcon, StarIcon } from "./art";

type Props = {
  profile: Profile;
  muted: boolean;
  onToggleMute: () => void;
  onOpenLevel: (id: number) => void;
  onLogout: () => void;
};

// Peta digambar di kanvas 360 lebar; posisi node dalam persen lebar.
const W = 360;
const XS = [28, 68, 32, 70, 30, 52];
const TOP = 90;
const STEP = 228;
const H = TOP + STEP * (LEVELS.length - 1) + 120;

const pts = LEVELS.map((_, i) => ({
  x: (XS[i % XS.length] / 100) * W,
  y: TOP + STEP * i,
}));

const ROAD = pts
  .map((p, i) => {
    if (i === 0) return `M${p.x} ${p.y}`;
    const a = pts[i - 1];
    return `C${a.x} ${a.y + STEP / 2} ${p.x} ${p.y - STEP / 2} ${p.x} ${p.y}`;
  })
  .join(" ");

export default function LevelMap({
  profile,
  muted,
  onToggleMute,
  onOpenLevel,
  onLogout,
}: Props) {
  const { cur, next, progress } = getRank(profile.xp);
  const totalStars = Object.values(profile.stars).reduce((a, b) => a + b, 0);
  const isUnlocked = (id: number) => id === 1 || (profile.stars[id - 1] ?? 0) > 0;
  const currentId = LEVELS.find(
    (l) => isUnlocked(l.id) && (profile.stars[l.id] ?? 0) === 0,
  )?.id;

  return (
    <div className="animate-pop">
      <div className="panel p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <Avatar id={profile.avatar} size={64} className="shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold tracking-[0.15em] text-ink/50 uppercase">
              Petualang
            </p>
            <p className="font-display truncate text-xl sm:text-2xl">{profile.name}</p>
            <p className="mt-0.5 inline-flex rounded-full bg-lagoon px-2.5 py-0.5 text-sm font-bold text-ink/70">
              {cur.name}
            </p>
          </div>
          <div className="rounded-2xl bg-[#fbf4df] px-3 py-2 text-center">
            <p className="font-display flex items-center justify-center gap-1 text-2xl">
              <StarIcon size={26} />
              {totalStars}
            </p>
            <p className="text-xs font-bold text-ink/60">dari {LEVELS.length * 3}</p>
          </div>
        </div>

        <div
          className="mt-4 h-3 overflow-hidden rounded-full bg-lagoon"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
          aria-label="Kemajuan pangkat"
        >
          <div
            className="h-full bg-sun transition-all duration-700"
            style={{ width: `${Math.max(4, Math.round(progress * 100))}%` }}
          />
        </div>
        <p className="mt-2 text-sm font-bold text-ink/65">
          {next
            ? `${next.min - profile.xp} XP lagi untuk jadi ${next.name}`
            : `${profile.xp} XP. Pangkat tertinggi!`}
        </p>

        <div className="mt-4 flex flex-wrap gap-2 border-t border-ink/10 pt-4">
          <button
            onClick={onToggleMute}
            aria-pressed={muted}
            aria-label={muted ? "Nyalakan suara" : "Matikan suara"}
            className="btn btn-paper btn-sm tap whitespace-nowrap"
          >
            <SoundIcon off={muted} size={22} />
            {muted ? "Hening" : "Suara"}
          </button>
          <button
            onClick={onLogout}
            className="btn btn-paper btn-sm tap whitespace-nowrap"
          >
            Ganti pemain
          </button>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs font-bold tracking-[0.18em] text-ink/50 uppercase">
          Pilih perjalananmu
        </p>
        <h2 className="font-display title-sticker mt-1 text-3xl sm:text-4xl">
          Peta petualangan
        </h2>
      </div>

      <div className="relative mx-auto mt-6 w-full max-w-[420px]">
        <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" aria-hidden>
          <path d={ROAD} fill="none" stroke={INK} strokeWidth="26" strokeLinecap="round" />
          <path d={ROAD} fill="none" stroke="#FFE9A8" strokeWidth="16" strokeLinecap="round" />
          <path
            d={ROAD}
            fill="none"
            stroke={INK}
            strokeOpacity="0.35"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="2 14"
          />
        </svg>

        {LEVELS.map((l, i) => {
          const open = isUnlocked(l.id);
          const stars = profile.stars[l.id] ?? 0;
          const isBoss = l.id === LEVELS.length;
          const size = isBoss ? 112 : 96;
          return (
            <div
              key={l.id}
              className="absolute flex w-44 flex-col items-center"
              style={{
                left: `${(pts[i].x / W) * 100}%`,
                top: `${(pts[i].y / H) * 100}%`,
                transform: `translate(-50%, -${size / 2}px)`,
              }}
            >
              {currentId === l.id && (
                <span
                  className="font-display animate-bob absolute -top-2 z-10 rounded-full border border-white bg-sun px-3 py-0.5 text-base shadow-md"
                  style={
                    i > 0 && pts[i - 1].x > pts[i].x
                      ? { right: "50%", marginRight: size / 2 - 16 }
                      : { left: "50%", marginLeft: size / 2 - 16 }
                  }
                >
                  Main!
                </span>
              )}
              <button
                disabled={!open}
                onClick={() => onOpenLevel(l.id)}
                aria-label={open ? `Level ${l.id}, ${l.name}` : `Level ${l.id} terkunci`}
                className="tap grid place-items-center rounded-full"
                style={{
                  width: size,
                  height: size,
                  background: open ? l.colors[0] : "#D9D5C3",
                }}
              >
                {open ? <LevelIcon id={l.id} size={size * 0.62} /> : <LockIcon size={44} />}
              </button>
              <p className="font-display mt-3 rounded-xl border border-ink/10 bg-paper px-3 py-1 text-center text-base leading-tight shadow-sm">
                {l.name}
              </p>
              {open ? (
                <div className="mt-1 flex" aria-label={`${stars} dari 3 bintang`}>
                  {[1, 2, 3].map((n) => (
                    <StarIcon key={n} filled={n <= stars} size={28} />
                  ))}
                </div>
              ) : (
                <p className="mt-1 rounded-full bg-paper/90 px-2.5 py-0.5 text-xs font-bold text-ink/60">
                  Selesaikan level {l.id - 1}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
