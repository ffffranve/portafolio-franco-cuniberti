// @ts-check
import { defineConfig } from 'astro/config';

// SITE and BASE_PATH are set by the GitHub Pages workflow.
// Locally they default to the root so `npm run dev` just works.
export default defineConfig({
  site: process.env.SITE ?? 'http://localhost:4321',
  base: process.env.BASE_PATH ?? '/',
  devToolbar: { enabled: false },
});
