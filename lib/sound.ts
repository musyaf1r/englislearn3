let ctx: AudioContext | null = null;
let muted = false;

export function setMuted(value: boolean) {
  muted = value;
  if (value && typeof window !== "undefined" && "speechSynthesis" in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      /* abaikan */
    }
  }
}

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!ctx) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(
  freq: number,
  start: number,
  dur: number,
  type: OscillatorType = "sine",
  vol = 0.15,
) {
  if (muted) return;
  const c = getCtx();
  if (!c) return;
  try {
    const t0 = c.currentTime + start;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  } catch {
    /* abaikan */
  }
}

export const sfx = {
  tap: () => tone(660, 0, 0.08, "triangle", 0.08),
  pair: () => {
    tone(784, 0, 0.1, "triangle", 0.12);
    tone(988, 0.08, 0.12, "triangle", 0.12);
  },
  correct: () => {
    tone(523, 0, 0.12, "triangle");
    tone(659, 0.1, 0.12, "triangle");
    tone(784, 0.2, 0.22, "triangle");
  },
  wrong: () => {
    tone(220, 0, 0.18, "sawtooth", 0.07);
    tone(165, 0.15, 0.26, "sawtooth", 0.07);
  },
  win: () => {
    [523, 659, 784, 1047, 784, 1047, 1319].forEach((f, i) =>
      tone(f, i * 0.12, 0.22, "triangle", 0.12),
    );
  },
  lose: () => {
    [392, 330, 262].forEach((f, i) =>
      tone(f, i * 0.2, 0.3, "sine", 0.12),
    );
  },
};

/** Ucapkan teks bahasa Inggris. `force` = true untuk tombol 🔊 (tetap bunyi walau suara dimatikan). */
export function speak(text: string, force = false) {
  if (muted && !force) return;
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = 0.85;
    u.pitch = 1.1;
    window.speechSynthesis.speak(u);
  } catch {
    /* abaikan */
  }
}
