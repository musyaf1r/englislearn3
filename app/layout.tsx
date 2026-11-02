import type { Metadata, Viewport } from "next";
import { Andika } from "next/font/google";
import "./globals.css";

// Andika dirancang khusus untuk pembaca pemula (huruf "a" satu lantai, "I" dan "l" jelas beda).
const andika = Andika({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-andika",
});

export const metadata: Metadata = {
  title: "Holiday Quest - Belajar Question Words",
  description:
    "Game seru untuk belajar question words (What, Where, Who, When, Why, How) dengan tema liburan.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#eaf5f7",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body className={andika.variable}>{children}</body>
    </html>
  );
}
