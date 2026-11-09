import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const sheetUrl =
      process.env.GOOGLE_SHEETS_URL ||
      process.env.NEXT_PUBLIC_GOOGLE_SHEETS_URL;

    if (!sheetUrl) {
      return NextResponse.json(
        { success: false, error: "GOOGLE_SHEETS_URL belum dikonfigurasi" },
        { status: 400 }
      );
    }

    const response = await fetch(sheetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(body),
    });

    const data = await response.text();
    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: `Google Apps Script membalas HTTP ${response.status}` },
        { status: 502 }
      );
    }

    let result: unknown;
    try {
      result = JSON.parse(data);
    } catch {
      result = null;
    }

    if (
      response.headers.get("content-type")?.includes("text/html") ||
      (typeof result === "object" &&
        result !== null &&
        (("success" in result && result.success === false) ||
          ("result" in result && result.result === "error")))
    ) {
      return NextResponse.json(
        { success: false, error: "Google Apps Script menolak atau gagal memproses data." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error submitting to Google Sheets:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

