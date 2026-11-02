import type { ShapeId } from "@/lib/wordstyle";

export const INK = "#183044";

type IconProps = { size?: number; className?: string };

/* ------------------------------------------------------------------ */
/* Ikon kecil                                                          */
/* ------------------------------------------------------------------ */
export function StarIcon({
  filled = true,
  size = 28,
  className,
}: IconProps & { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden>
      <path
        d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z"
        fill={filled ? "#FFD23F" : "#E4DFC9"}
        stroke={INK}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HeartIcon({
  filled = true,
  size = 28,
  className,
}: IconProps & { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden>
      <path
        d="M12 20.5C5 16 2.5 12.5 2.5 9a4.8 4.8 0 0 1 9.5-1 4.8 4.8 0 0 1 9.5 1c0 3.5-2.5 7-9.5 11.5z"
        fill={filled ? "#FF5C7A" : "#E4DFC9"}
        stroke={INK}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FlameIcon({ size = 28, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden>
      <path
        d="M12 2c1 4 5 5.5 5 11a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5 0 2 1 2.5 1.5 2.5C10.5 8 11 5 12 2z"
        fill="#FF8A3D"
        stroke={INK}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Stroke({
  size = 28,
  className,
  children,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="3.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  );
}

export const CheckIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M5 12.5l4.5 4.5L19 7" />
  </Stroke>
);
export const CrossIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Stroke>
);
export const BackIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M15 5l-7 7 7 7" />
  </Stroke>
);

export function SoundIcon({
  off = false,
  size = 28,
  className,
}: IconProps & { off?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 9.5v5h4l5 4V5.5l-5 4z" fill="currentColor" />
      {off ? (
        <path d="M17 9.5l5 5M22 9.5l-5 5" />
      ) : (
        <>
          <path d="M16.5 9a4 4 0 0 1 0 6" />
          <path d="M19 6.5a7.5 7.5 0 0 1 0 11" />
        </>
      )}
    </svg>
  );
}

export function LockIcon({ size = 28, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden>
      <path
        d="M8.5 11V8a3.5 3.5 0 0 1 7 0v3"
        fill="none"
        stroke={INK}
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <rect x="5.5" y="11" width="13" height="9.5" rx="2.5" fill="#9AA3BD" stroke={INK} strokeWidth="2" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Bentuk kata tanya                                                   */
/* ------------------------------------------------------------------ */
function burstPoints(): string {
  const pts: string[] = [];
  for (let i = 0; i < 24; i++) {
    const r = i % 2 ? 36 : 46;
    const a = (Math.PI * 2 * i) / 24 - Math.PI / 2;
    pts.push(`${(50 + r * Math.cos(a)).toFixed(1)},${(50 + r * Math.sin(a)).toFixed(1)}`);
  }
  return pts.join(" ");
}
const BURST = burstPoints();

export function Shape({
  id,
  color,
  size = 40,
  className,
}: {
  id: ShapeId;
  color: string;
  size?: number;
  className?: string;
}) {
  const p = {
    fill: color,
    stroke: INK,
    strokeWidth: 6,
    strokeLinejoin: "round" as const,
  };
  let el;
  switch (id) {
    case "circle":
      el = <circle cx="50" cy="50" r="43" {...p} />;
      break;
    case "pin":
      el = <path d="M50 94C20 62 10 48 10 36a40 40 0 0 1 80 0c0 12-10 26-40 58z" {...p} />;
      break;
    case "squircle":
      el = <rect x="8" y="8" width="84" height="84" rx="30" {...p} />;
      break;
    case "hexagon":
      el = <path d="M50 6L88 28V72L50 94L12 72V28z" {...p} />;
      break;
    case "diamond":
      el = <path d="M50 5L95 50L50 95L5 50z" {...p} />;
      break;
    case "triangle":
      el = <path d="M50 9L93 87H7z" {...p} />;
      break;
    case "burst":
      el = <polygon points={BURST} {...p} />;
      break;
    case "heart":
      el = <path d="M50 90C14 64 8 44 8 32a21 21 0 0 1 42-8 21 21 0 0 1 42 8c0 12-6 32-42 58z" {...p} />;
      break;
    case "plus":
      el = <path d="M38 8h24v30h30v24H62v30H38V62H8V38h30z" {...p} />;
      break;
    case "octagon":
      el = <path d="M32 6h36l26 26v36L68 94H32L6 68V32z" {...p} />;
      break;
  }
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden>
      {el}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Maskot: Kiko si burung                                              */
/* ------------------------------------------------------------------ */
export type Mood = "happy" | "cheer" | "sad";

export function Mascot({
  mood = "happy",
  size = 96,
  className,
}: {
  mood?: Mood;
  size?: number;
  className?: string;
}) {
  const sw = { stroke: INK, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} className={className} aria-hidden>
      <path d="M50 26c-3-10 1-17 8-20 0 6 2 10 5 12 3-5 8-6 13-5-3 4-3 9-2 13z" fill="#3FD6C4" strokeWidth="4" {...sw} />
      <path d="M22 68c-9 6-11 17-6 26 9-2 15-9 17-19z" fill="#E8742A" strokeWidth="4" {...sw} />
      <path d="M98 68c9 6 11 17 6 26-9-2-15-9-17-19z" fill="#E8742A" strokeWidth="4" {...sw} />
      <ellipse cx="60" cy="68" rx="40" ry="40" fill="#FF8F3F" strokeWidth="5" {...sw} />
      <ellipse cx="60" cy="86" rx="22" ry="19" fill="#FFE9B8" />
      {mood === "cheer" ? (
        <>
          <path d="M35 58q11-14 22 0" fill="none" strokeWidth="5" {...sw} />
          <path d="M63 58q11-14 22 0" fill="none" strokeWidth="5" {...sw} />
        </>
      ) : (
        <>
          <circle cx="46" cy="56" r="12" fill="#fff" strokeWidth="4" {...sw} />
          <circle cx="74" cy="56" r="12" fill="#fff" strokeWidth="4" {...sw} />
          <circle cx="47" cy={mood === "sad" ? 60 : 57} r="5.5" fill={INK} />
          <circle cx="73" cy={mood === "sad" ? 60 : 57} r="5.5" fill={INK} />
        </>
      )}
      {mood === "sad" && (
        <>
          <path d="M33 42l21 6M87 42l-21 6" fill="none" strokeWidth="4" {...sw} />
          <path d="M36 70c-5 7-5 11 0 11s5-4 0-11z" fill="#74B8FF" strokeWidth="2.5" {...sw} />
        </>
      )}
      {mood === "sad" ? (
        <path d="M50 74l20 0-10 11z" fill="#FFD23F" strokeWidth="4" {...sw} />
      ) : (
        <>
          <path d="M49 68h22l-11 10z" fill="#FFD23F" strokeWidth="4" {...sw} />
          <path d="M52 80h16l-8 9z" fill="#FFB830" strokeWidth="4" {...sw} />
        </>
      )}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Avatar anak                                                         */
/* ------------------------------------------------------------------ */
const AVATARS: Record<string, string> = {
  cat: "#FF9F4A",
  bear: "#E8B873",
  bunny: "#FF8FC0",
  robot: "#74B8FF",
  sprout: "#8EE46B",
  chick: "#FFD84A",
};
export const AVATAR_IDS = Object.keys(AVATARS);

export function Avatar({
  id,
  size = 64,
  className,
}: {
  id: string;
  size?: number;
  className?: string;
}) {
  const key = id in AVATARS ? id : "cat";
  const bg = AVATARS[key];
  const o = { stroke: INK, strokeWidth: 5, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
  let decor;
  switch (key) {
    case "cat":
      decor = (
        <>
          <path d="M20 44L24 10L50 28z" fill={bg} {...o} />
          <path d="M80 44L76 10L50 28z" fill={bg} {...o} />
        </>
      );
      break;
    case "bear":
      decor = (
        <>
          <circle cx="24" cy="28" r="13" fill={bg} {...o} />
          <circle cx="76" cy="28" r="13" fill={bg} {...o} />
        </>
      );
      break;
    case "bunny":
      decor = (
        <>
          <ellipse cx="35" cy="20" rx="9" ry="19" fill={bg} {...o} />
          <ellipse cx="65" cy="20" rx="9" ry="19" fill={bg} {...o} />
        </>
      );
      break;
    case "robot":
      decor = (
        <>
          <path d="M50 26V10" fill="none" {...o} />
          <circle cx="50" cy="8" r="6" fill="#FF5C7A" {...o} strokeWidth={4} />
          <rect x="10" y="48" width="10" height="22" rx="4" fill="#9AA3BD" {...o} />
          <rect x="80" y="48" width="10" height="22" rx="4" fill="#9AA3BD" {...o} />
        </>
      );
      break;
    case "sprout":
      decor = (
        <>
          <path d="M50 28C44 12 30 10 22 14c4 11 15 15 28 14z" fill="#3DBE6B" {...o} />
          <path d="M50 28C56 12 70 10 78 14c-4 11-15 15-28 14z" fill="#3DBE6B" {...o} />
        </>
      );
      break;
    default:
      decor = <path d="M42 26c-3-9 1-15 8-17 7 2 11 8 8 17z" fill="#FFB830" {...o} />;
  }
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden>
      {decor}
      <circle cx="50" cy="60" r="34" fill={bg} {...o} />
      <circle cx="38" cy="56" r="4.5" fill={INK} />
      <circle cx="62" cy="56" r="4.5" fill={INK} />
      <circle cx="29" cy="68" r="5.5" fill="#FF5C7A" opacity="0.35" />
      <circle cx="71" cy="68" r="5.5" fill="#FF5C7A" opacity="0.35" />
      {key === "chick" ? (
        <path d="M43 65h14l-7 9z" fill="#FF8F3F" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      ) : (
        <path d="M42 69q8 8 16 0" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      )}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Ikon level                                                          */
/* ------------------------------------------------------------------ */
export function LevelIcon({
  id,
  size = 56,
  className,
}: {
  id: number;
  size?: number;
  className?: string;
}) {
  const s = { stroke: INK, strokeWidth: 4, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
  let el;
  switch (id) {
    case 1:
      el = (
        <>
          <circle cx="42" cy="22" r="11" fill="#FFD23F" {...s} />
          <path d="M6 42c6-6 10 6 16 0s10 6 16 0 10 6 16 0" fill="none" {...s} />
          <path d="M6 54c6-6 10 6 16 0s10 6 16 0 10 6 16 0" fill="none" {...s} />
        </>
      );
      break;
    case 2:
      el = (
        <>
          <path d="M5 54L27 16L49 54z" fill="#FFFFFF" {...s} />
          <path d="M30 54L46 28L62 54z" fill="#FFFFFF" {...s} />
          <path d="M20 28l7-12 7 12-7-3z" fill="#74B8FF" stroke="none" />
        </>
      );
      break;
    case 3:
      el = (
        <>
          <circle cx="32" cy="34" r="25" fill="#FF9F4A" {...s} />
          <circle cx="32" cy="35" r="15" fill="#FFE08A" {...s} />
          <circle cx="27" cy="32" r="2.4" fill={INK} />
          <circle cx="37" cy="32" r="2.4" fill={INK} />
          <path d="M28 40q4 4 8 0" fill="none" {...s} strokeWidth={3} />
        </>
      );
      break;
    case 4:
      el = (
        <>
          <rect x="6" y="28" width="17" height="28" fill="#FFFFFF" {...s} />
          <rect x="23" y="10" width="19" height="46" fill="#FFFFFF" {...s} />
          <rect x="42" y="30" width="15" height="26" fill="#FFFFFF" {...s} />
          <path d="M29 20h7M29 30h7M29 40h7M12 38h5M47 40h5" fill="none" {...s} strokeWidth={3} />
        </>
      );
      break;
    case 5:
      el = (
        <>
          <ellipse cx="32" cy="52" rx="24" ry="8" fill="#FFD98A" {...s} />
          <path d="M33 47C35 37 33 29 37 20" fill="none" {...s} />
          <path d="M37 20c-8-7-15-3-17 1 6-1 11 0 17-1z" fill="#3DBE6B" {...s} strokeWidth={3} />
          <path d="M37 20c8-7 15-3 17 1-6-1-11 0-17-1z" fill="#3DBE6B" {...s} strokeWidth={3} />
        </>
      );
      break;
    default:
      el = (
        <>
          <path d="M8 48L8 22L21 34L32 14L43 34L56 22L56 48z" fill="#FFD23F" {...s} />
          <rect x="8" y="48" width="48" height="8" rx="2" fill="#FFD23F" {...s} />
          <circle cx="32" cy="38" r="3.5" fill="#FF5C7A" stroke={INK} strokeWidth={2.5} />
        </>
      );
  }
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} aria-hidden>
      {el}
    </svg>
  );
}
