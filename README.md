# Nirmal Kumar G – Portfolio

Next.js (App Router) · React · TypeScript · Tailwind CSS v4 · Motion · Lucide.

```bash
npm run dev     # http://localhost:3000
npm run lint
npm run build && npm start
```

## Editing content
All copy lives in `src/content/`:
- `site.ts` – identity, contact details, nav, `resumeUrl` (drop a PDF in `public/` and set it to show a Resume button)
- `projects.ts` – add a project; set `image` (file in `public/images/work`) to replace the schematic visual
- `experience.ts`, `skills.ts`, `approach.ts`

Set `NEXT_PUBLIC_SITE_URL` (e.g. `https://example.com`) in production to enable the canonical URL,
social-share images, sitemap and structured-data URLs.
