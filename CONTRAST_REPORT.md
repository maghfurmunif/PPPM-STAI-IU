# Contrast Report — initial scan

Files with `text-slate-300` (examples):

- `src/App.tsx` — Loading fallback uses `text-slate-300`
- `src/components/dashboard/Logbook.tsx` — small labels and icon color (`text-slate-300`)
- `src/components/dashboard/KKNCompleteHistory.tsx` — status labels use `text-slate-300`
- `src/pages/dashboard/mahasiswa/sections/KKNSection.tsx` — option tiles and helper text use `text-slate-300`
- `src/pages/dashboard/admin/sections/AdminKKN.tsx` — headings and empty-state text use `text-slate-300`
- `src/components/layout/Footer.tsx` — footer uses `text-slate-300` on dark background (OK)

Notes:
- I updated `src/index.css` to increase contrast of `.text-slate-300/.text-slate-400/.text-slate-500` to more readable values.
- Many `text-slate-300` usages are intended as muted/empty-state text on light cards; with the updated utilities they should now be more legible.
- Next recommended steps:
  1. Manual review of chat/logbook areas (`Logbook`, `KKNSection`) to ensure no text remains unreadable over images or colored backgrounds.
  2. Optionally replace specific `text-slate-300` usages (for tiny/disabled text) with `text-slate-400` or `text-slate-500` where stronger contrast is needed.
  3. Add an automated contrast check (axe or a small Node script) to prevent regressions.

If you want, I can now (a) auto-patch the highest-risk occurrences to `text-slate-500`, or (b) focus only on chat/logbook components — which do you prefer?
