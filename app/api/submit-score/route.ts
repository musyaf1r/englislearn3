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
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error submitting to Google Sheets:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

