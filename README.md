This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Menghubungkan nilai ke Google Sheets

Aplikasi mengirim hasil permainan ke tab pertama (gid `0`) pada spreadsheet yang sudah ditentukan. Script penerima ada di [`google-apps-script/Code.gs`](./google-apps-script/Code.gs).

1. Buka spreadsheet, pilih **Ekstensi > Apps Script**, lalu salin isi `Code.gs` ke editor Apps Script dan simpan.
2. Pilih **Deploy > New deployment > Web app**. Atur **Execute as** ke akun Anda dan akses ke **Anyone**, lalu deploy dan setujui izin yang diminta Google.
3. Salin URL Web app yang berakhiran `/exec`.
4. Buat `.env.local` di root proyek, lalu tambahkan:

   ```env
   GOOGLE_SHEETS_URL=https://script.google.com/macros/s/ID_DEPLOYMENT/exec
   ```

5. Mulai ulang server Next.js. Hasil permainan berikutnya akan otomatis ditambahkan sebagai baris baru; header akan dibuat otomatis jika tab masih kosong.

URL Web app dengan akses **Anyone** dapat menerima kiriman dari publik. Script hanya menambahkan kolom hasil permainan yang ditentukan dan memvalidasi nilainya, tetapi jangan gunakan endpoint ini untuk data sensitif.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
