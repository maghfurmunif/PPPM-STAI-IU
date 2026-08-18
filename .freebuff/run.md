# Run doc — PPPM STAI IU (react-example)

## Reproduce the artifacts a fresh checkout needs

1. **`.env`** — copy it from the main checkout (`D:\IPUNK FILE\STAIIU\webpppm\pm2\.env`).
   In this thread the workspace IS the main checkout, so `.env` is already present.
   It holds Supabase URL/keys and `GEMINI_API_KEY` (secrets — never commit).
2. **Dependencies** — `npm install` (lockfile `package-lock.json` pins all versions, e.g. vite 6.4.x, tailwindcss 4.3.0).
   If a worktree is a full copy of this checkout, `node_modules` is already installed.

## Run the dev server

- Script: `npm run dev` → `vite --port=3000 --host=0.0.0.0`
- Default port: **3000**. If occupied, pass a free port (e.g. `npm run dev -- --port=3001`).
- Start detached on Windows:

```powershell
powershell -NoProfile -Command "(Start-Process -FilePath 'npm.cmd' -ArgumentList 'run','dev' -RedirectStandardOutput '<log>' -RedirectStandardError '<log>.err' -WindowStyle Hidden -PassThru).Id"
```

stdout and stderr must go to DIFFERENT files (PowerShell fails if both point at one path).
Then confirm the pid survived and the URL answers:

```powershell
powershell -NoProfile -Command "Get-Process -Id <pid>"
powershell -NoProfile -Command "(Invoke-WebRequest -Uri 'http://127.0.0.1:3000' -UseBasicParsing).StatusCode"   # expect 200
```

- The wrapper command often appears to hang/times out — the server still starts; check the port/pid separately.
- Register the preview at `http://127.0.0.1:3000` with the printed pid.

## Gotchas

- `src/index.css` must use the canonical v4 form (`@import "tailwindcss";` at the top).
  The legacy `@tailwind base/components/utilities` directives break `@apply` ("Cannot apply unknown utility class `bg-slate-50`") and 500 the page.
- There is also a production server (`npm run build && npm start`, port 8080 in `server.ts`) that serves `dist/` plus the Express/`@google/genai` API — not needed for the dev preview.
