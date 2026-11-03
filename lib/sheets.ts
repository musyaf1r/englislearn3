export type ScoreData = {
  nama: string;
  levelId: number;
  levelName: string;
  correct: number;
  mistakes: number;
  total: number;
  score: number;
  stars: number;
  passed: boolean;
  xp: number;
  bestStreak: number;
};

// URL Google Apps Script Web App
// Bisa diatur lewat .env.local (NEXT_PUBLIC_GOOGLE_SHEETS_URL)
// atau langsung ditempel pada fallback string di bawah ini jika diinginkan
export const GOOGLE_SHEETS_WEB_APP_URL =
  process.env.NEXT_PUBLIC_GOOGLE_SHEETS_URL || "";

export async function submitScoreToSheet(
  data: ScoreData
): Promise<{ success: boolean; message?: string }> {
  const url = GOOGLE_SHEETS_WEB_APP_URL;

  // Format data yang akan dikirim ke Spreadsheet
  const payload = {
    waktu: new Date().toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Jakarta",
    }),
    nama: data.nama,
    level: `Level ${data.levelId} - ${data.levelName}`,
    nilai: data.score,
    benar: data.correct,
    salah: data.mistakes,
    total: data.total,
    bintang: data.stars,
    status: data.passed ? "Lulus" : "Belum Lulus",
    xp: data.xp,
    bestStreak: data.bestStreak,
  };

  // 1. Coba kirim via route internal Next.js (/api/submit-score)
  try {
    const apiRes = await fetch("/api/submit-score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (apiRes.ok) {
      const resJson = await apiRes.json();
      if (resJson.success) {
        return { success: true };
      }
    }
  } catch {
    // Abaikan jika route internal gagal atau aplikasi di-export statis (GitHub Pages)
  }

  // 2. Fallback: kirim langsung ke Google Apps Script Web App dari browser
  if (!url) {
    console.warn(
      "NEXT_PUBLIC_GOOGLE_SHEETS_URL belum diatur. Nilai tidak dikirim ke Spreadsheet."
    );
    return {
      success: false,
      message: "URL Spreadsheet belum diatur di .env.local",
    };
  }

  try {
    await fetch(url, {
      method: "POST",
      mode: "no-cors", // Mencegah blokir CORS browser pada redirect Google Apps Script
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    return { success: true };
  } catch (err) {
    console.error("Gagal mengirim nilai ke Google Sheets:", err);
    return { success: false, message: String(err) };
  }
}

