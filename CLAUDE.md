# Portafolio Franco Cuniberti

This folder (`C:\Users\AMD\portafolio`) is the only source of the portfolio. Edit and deploy from here.
`Desktop\Portafolio Fire Base` is an old copy that ChatGPT edited; its changes were merged here on 2026-10-29. Do not edit it.

## Sites
- Main site: https://portafolio-franco-cuniberti.web.app (Firebase Hosting, site `portafolio-franco-cuniberti`, project `portafolio-fc`).
- https://portafolio-fc.web.app and https://franco-cuniberti.web.app: 301 redirects to the main site (other entries in `firebase.json`).
- GitHub Pages (https://ffffranve.github.io/portafolio-franco-cuniberti/): serves only `github-redirect/`, a page that forwards to the main site.

## Publish a change
```bash
npm run build
firebase deploy --only hosting
```
Then commit and push to `main` so the history stays in git. Commit as `Franco Cuniberti <cunibertifranco@gmail.com>`.
In PowerShell use `firebase.cmd` (script execution is blocked).

## Videos
- Content and order: `src/data/portfolio.ts`. Short videos fill a 3-column grid: rows "1a 1b 1c / 2a 2b 2c".
- Compress new videos into `public/videos/` with ffmpeg: 720p, keep the source fps, GOP 2 s, CRF 25, AAC 128k, `+faststart`, poster JPG at 1 s.
- Use a new file name for each new version (for example `-v2`), so browsers don't show a cached old copy.
- GitHub rejects files over 100 MB: use a two-pass bitrate encode for long videos.

## Google
- `public/robots.txt`, `public/sitemap.xml`, and JSON-LD in `src/layouts/Base.astro`.
- Search Console: URL-prefix property `https://portafolio-franco-cuniberti.web.app`, verified with `public/google8a0a16b8011474d6.html` (never delete it).
