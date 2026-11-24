# Drive to QR (dtqr)

Sign in with Google, pick one or more Drive folders, and get a **printable A4 sheet of
QR codes** — one per file in the entire subtree, each labelled for identification.

- Each QR encodes the file's existing Drive link (`webViewLink`); since your files are
  shared *anyone-with-link*, scanning opens the file without signing in.
- **Navigable folder tree** on the first screen — expand any folder and select
  subfolders/subtrees at any depth.
- Walks every selected folder's **full subtree**, depth-first, files grouped by folder.
- Live print controls: **columns per row**, **QR size (mm)**, a **label mode**
  (path / name) with **per-item inline editing**, and **crop marks** (dashed cut lines).
- **Include / exclude** individual QR codes from the grid before printing.
- Edge-to-edge A4 printing with **zero page margins**.
- Read-only Drive access. No database — nothing is persisted.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind 4 (Dracula palette) · Auth.js v5
(Google, JWT) · `googleapis` (Drive v3) · `qrcode.react` · **pnpm**.

## Prerequisites

- Node.js 18.18+ and **pnpm**.
- A Google account with the Drive folders you want to turn into QR codes.

## 1. Google Cloud setup (one-time)

1. Go to the [Google Cloud Console](https://console.cloud.google.com) and create a
   project (or pick an existing one).
2. **APIs & Services → Library →** enable the **Google Drive API**.
3. **APIs & Services → OAuth consent screen:**
   - User type **External**.
   - Fill in the app name and your support email.
   - Add the scope `https://www.googleapis.com/auth/drive.readonly`.
   - Under **Test users**, add your own Google email (required while the app is in
     "Testing" mode).
4. **APIs & Services → Credentials → Create credentials → OAuth client ID:**
   - Application type **Web application**.
   - **Authorized redirect URIs** — add both:
     - `http://localhost:3000/api/auth/callback/google` (local dev)
     - `https://<your-app>.vercel.app/api/auth/callback/google` (production)
   - Copy the **Client ID** and **Client secret**.

## 2. Environment variables

Copy the example file and fill it in:

```bash
cp .env.example .env.local
```

| Variable | Value |
|---|---|
| `GOOGLE_CLIENT_ID` | OAuth client ID from step 1.4 |
| `GOOGLE_CLIENT_SECRET` | OAuth client secret from step 1.4 |
| `AUTH_SECRET` | Session encryption secret — generate with `npx auth secret` |
| `AUTH_URL` | Omit locally; set to your deployment URL in production |

## 3. Run locally

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000, sign in with Google, pick folders, and generate.
Use your browser's **Print** dialog (or the in-app Print button) to print to A4 or
Save as PDF.

## 4. Deploy to Vercel

1. Push the repo to GitHub and import it in Vercel.
2. In **Project → Settings → Environment Variables**, add `GOOGLE_CLIENT_ID`,
   `GOOGLE_CLIENT_SECRET`, `AUTH_SECRET`, and `AUTH_URL` (your Vercel URL).
3. Make sure the Vercel callback URL is in the OAuth client's authorized redirect URIs
   (step 1.4).
4. Deploy.

## Notes

- **Sharing is assumed, not enforced.** The app reads links read-only; if a file isn't
  actually shared publicly, its QR simply won't open for people without access.
- **Large subtrees** make many Drive API calls and render many QR codes on one page —
  fine for hundreds of files; thousands may be slow to print.

## License

[GNU Affero General Public License v3.0](./LICENSE) (AGPL-3.0-only).
