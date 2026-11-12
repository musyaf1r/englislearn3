const SPREADSHEET_ID = "1PA71DPFJ5fnf7qVnG12W-W_wYdbWlZ9jAeVEV7ccwLU";
const SHEET_ID = 0;
const HEADERS = [
  "Waktu",
  "Nama",
  "Level",
  "Nilai",
  "Benar",
  "Salah",
  "Total",
  "Bintang",
  "Status",
  "XP",
  "Best Streak",
];

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("Data permintaan kosong.");
    }

    const data = JSON.parse(e.postData.contents);
    const row = [
      safeText(data.waktu, "Waktu", 50),
      safeText(data.nama, "Nama", 100),
      safeText(data.level, "Level", 150),
      requiredNumber(data.nilai, "Nilai", 0, 100),
      requiredNumber(data.benar, "Benar", 0),
      requiredNumber(data.salah, "Salah", 0),
      requiredNumber(data.total, "Total", 0),
      requiredNumber(data.bintang, "Bintang", 0, 3),
      validStatus(data.status),
      requiredNumber(data.xp, "XP", 0),
      requiredNumber(data.bestStreak, "Best Streak", 0),
    ];

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
      const sheet = spreadsheet.getSheetById(SHEET_ID);
      if (!sheet) {
        throw new Error("Tab dengan gid 0 tidak ditemukan.");
      }

      if (sheet.getLastRow() === 0) {
        sheet.appendRow(HEADERS);
      }
      sheet.appendRow(row);
    } finally {
      lock.releaseLock();
    }

    return jsonResponse({ success: true });
  } catch (error) {
    const message = error && error.message ? error.message : "Terjadi kesalahan.";
    return jsonResponse({ success: false, error: message });
  }
}

function requiredText(value, label, maxLength) {
  if (typeof value !== "string" || !value.trim() || value.length > maxLength) {
    throw new Error(label + " tidak valid.");
  }
  return value.trim();
}

function safeText(value, label, maxLength) {
  const text = requiredText(value, label, maxLength);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function requiredNumber(value, label, min, max) {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    !Number.isInteger(value) ||
    value < min ||
    (max !== undefined && value > max)
  ) {
    throw new Error(label + " tidak valid.");
  }
  return value;
}

function validStatus(value) {
  if (value !== "Lulus" && value !== "Belum Lulus") {
    throw new Error("Status tidak valid.");
  }
  return value;
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
