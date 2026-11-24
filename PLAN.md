# Drive-to-QR (dtqr) — Build Plan

A web app that signs you in with Google, reads your Google Drive, lets you pick one
or more folders, walks their **entire subtree**, and generates a **printable A4 grid
of QR codes** — one per file — each labelled with text for identification.

---

## 1. What it does (user flow)

1. **Sign in** with your Google account (OAuth consent for read-only Drive).
2. **Browse / pick folders** — a list of your Drive folders (and Shared Drives);
   select one or many via checkboxes.
3. **Scan** — the app recursively reads every selected folder's subtree
   (all nested subfolders), collecting every file in **depth-first, folder order**.
4. **Generate** — a QR code is produced for each file, with its identifying text
   rendered directly beneath it.
5. **Lay out & print** — all QR codes appear in a grid. You adjust **columns per row**
   and **QR size** live; the layout is tuned for **A4** so you can fit as many as you
   want per page, then print (or Save as PDF) via the browser.

---

## 2. Key decisions (please confirm)

Resolved per your answers:

| # | Decision | Resolved |
|---|----------|----------|
| D1 | **What does each QR encode?** | The file's existing **public** `webViewLink`. Your files are already shared *anyone-with-link — Viewer*, so the app only **reads** the link; anyone scanning opens it without signing in. |
| D2 | **Label under each QR** | A **switchable** label: **full path**, or **file name** — plus **per-item editing** so you can override any individual label before printing. |
| D3 | **Include Google-native docs** (Docs/Sheets/Slides) | Yes — treated as files. |
| D4 | **Include files in nested _Shared Drives_** | Yes — My Drive + readable Shared Drives. |
| D5 | **Persistence** | **None.** No database, no saved state. |

**Read-only — the app never changes your Drive.** Since the files are already public,
the Google scope is the minimal **`https://www.googleapis.com/auth/drive.readonly`**. The
app only lists folders and reads `webViewLink`s; it never writes permissions or anything
else. (If some file turns out *not* to be public, its QR simply won't open for people
without access — the app won't try to fix it.)

**No DB, no custom auth.** Per your instruction there is no database and none of the
`CLAUDE.md` auth machinery (`requireSession`, JWT resource stack, Drizzle schemas). The
only identity step is the raw Google OAuth handshake required to call the Drive API on
your behalf; nothing is persisted.

---

## 3. Tech stack

- **Framework:** Next.js 15 (App Router) + TypeScript, **pnpm**.
- **Google sign-in:** Auth.js (NextAuth v5) Google provider — minimal, stateless
  (JWT only, no DB adapter). Used solely to obtain a Drive access token.
  - Scope requested: **`https://www.googleapis.com/auth/drive.readonly`** (read-only —
    the app never modifies your Drive).
  - Token kept in memory for the session; refreshed on expiry. Nothing persisted.
- **Google Drive:** `googleapis` (Drive API v3) called from **server actions**.
- **QR rendering:** `qrcode.react` (renders crisp **SVG** — scales perfectly for print).
- **Styling:** Tailwind, **Dracula palette** per `CLAUDE.md` (Montserrat font).
- **Print:** CSS `@media print` + `@page { size: A4 }`, CSS Grid for the layout.
- **i18n:** `en.ts` / `es.ts` dictionaries per conventions (locale cookie).

No database. No external services beyond Google.

---

## 4. Architecture

### Routes (`src/lib/routes.ts`)
```
HOME        = "/"            → landing + sign-in
SELECT      = "/select"      → pick folders
RESULT      = "/result"      → QR grid + print controls
```

### Pages
- `app/page.tsx` — landing; "Sign in with Google" when signed out, else redirect to `/select`.
- `app/(protected)/select/page.tsx` — server component; lists folders; client checkbox form.
- `app/(protected)/result/page.tsx` — server component; receives selected folder ids,
  runs the recursive scan server-side, passes the flat file list to the client grid.

### Server actions (`src/actions/drive.ts`)
- `listFolders()` — top-level folders + Shared Drives for the picker.
- `scanFolders(folderIds: string[])` — recursive BFS/DFS over subtrees; returns an
  ordered flat list of `{ id, name, path, webViewLink, mimeType }`.
  - Uses `files.list` with `'<id>' in parents and trashed=false`, paginated,
    `includeItemsFromAllDrives: true`, `supportsAllDrives: true`.
  - Guards against folder cycles (shortcuts) with a visited-set.

### Components (`src/components/`, mirroring routes)
- `components/select/folder-list.tsx` — checkbox list, "select all", submit.
- `components/result/print-controls.tsx` — **columns** slider/number + **QR size** +
  **label mode** toggle (`path` | `name`); `print()` button. State drives CSS variables.
- `components/result/qr-grid/index.tsx` — the grid container (A4-aware).
- `components/result/qr-grid/qr-cell.tsx` — one QR + an **editable** label beneath
  (click to edit; defaults to the chosen label mode, override persists in-session only).
- Feature components carry a kebab-case `data-testid` per conventions; `ui/` primitives don't.

### Types (`src/types/index.ts`)
- `DriveFile = { id; name; path; webViewLink; mimeType }`.
- `LabelMode = "path" | "name"`.
- `ActionResult<T>` shared type per conventions.

---

## 5. The printable grid (the core UX)

- Grid uses `grid-template-columns: repeat(var(--cols), 1fr)` — `--cols` bound to the
  control, so dragging the slider re-flows the whole sheet instantly.
- QR size bound to `--qr` (mm), so cells stay physical-print-accurate.
- `@page { size: A4; margin: 10mm }` + `print-color-adjust: exact`.
- `break-inside: avoid` on each cell so no QR is split across page breaks.
- Controls are hidden in print (`@media print { .controls { display: none } }`).
- **Label mode** (path vs. name) switches every cell's text at once; any cell can be
  **edited inline** to override its text before printing.
- Label text truncates/wraps under the QR; long paths get an ellipsis with full text
  in `title`.

**Result:** you drag "columns" up to pack more per row (smaller QR) or down for fewer,
larger QR — then print and every A4 page is full.

---

## 6. Google Cloud setup (one-time, by you)

I'll document these steps; they require your Google account:
1. Create a Google Cloud project.
2. Enable the **Google Drive API**.
3. Configure the **OAuth consent screen** (External, add your email as a test user).
4. Create **OAuth 2.0 Client ID** (Web) with **two** redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (local dev)
   - `https://<your-app>.vercel.app/api/auth/callback/google` (production)
5. Put `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `AUTH_SECRET` in `.env.local` locally
   and in **Vercel → Project → Environment Variables** for production. Set `AUTH_URL` /
   `NEXTAUTH_URL` to the Vercel URL in production.

---

## 7. Build steps

1. Scaffold Next.js + Tailwind + pnpm; add Dracula palette to `globals.css`, Montserrat.
2. `src/lib/routes.ts`, `src/types/index.ts`, i18n skeleton (`en.ts`/`es.ts`).
3. Auth.js Google provider (`drive.readonly` scope) + JWT with token refresh; sign-in guard.
4. `src/actions/drive.ts`: `listFolders`, recursive `scanFolders`.
5. `/select` page + folder-list client component.
6. `/result` page + `qr-grid` + `qr-cell` (editable label) + `print-controls`
   (columns, size, label mode).
7. Print CSS (A4) and live column/size controls.
8. README with the Google Cloud setup + run instructions.

---

## 8. Known limits / notes

- **Sharing is assumed, not enforced.** The app reads existing links read-only. If a
  file isn't actually public, its QR just won't open for people without access — the app
  won't detect or fix that.
- **Volume:** thousands of files = thousands of QR SVGs in one page. Fine for hundreds;
  if you routinely have 1000s, I'll add pagination-by-print-page or virtualization.
- **Rate limits:** very large subtrees make many Drive API calls; requests are
  paginated and can be throttled/batched if needed.

---

## 9. Open questions

_All resolved._
- **Deploy:** Vercel (prod) + localhost (dev) — redirect URIs set in §6.
- **Labels:** path | name | per-item custom edit (text input). No extras (no size/date).

---

*Everything is locked. Approve and I'll start building (step 1: scaffold).*
