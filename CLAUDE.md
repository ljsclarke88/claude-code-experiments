# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
npm install

# Start the server (local dev)
node index.js
```

The app runs at `http://localhost:3000`. There is no build step — the frontend is served as static files from `public/`.

For local dev, create a `.env` file (see `.env.example`) with your `GEMINI_API_KEY`. This file is gitignored and must never be committed.

## Architecture

This is a single-feature Node.js app with an Express backend and a vanilla JS frontend.

**Backend (`index.js`)** — one POST endpoint at `/` that accepts `{ message: string }` and calls `gemini-2.5-flash` to generate a haiku. The system prompt instructs the model to use the three input words as inspiration for each line in strict 5-7-5 form, drawing on wabi-sabi and mono no aware. In production (Vercel), the app is exported as a default export and `app.listen` is skipped — Vercel manages the server lifecycle.

**Frontend (`public/index.html`)** — all logic lives in inline `<script>` tags. The flow is:

1. User clicks on the WebGL Earth globe (powered by `webglearth.com/v2/api.js`)
2. `convertCoordinatesToWords(lat, lng)` calls the Nominatim API to reverse-geocode to city/region/country
3. The three place words are passed to `sendMessage(words)`, which POSTs to `/`
4. The haiku lines are rendered into `#chat-log` with staggered CSS fade-up animations

The globe uses two tile layers from MapTiler — pure satellite below zoom 4, hybrid (satellite + labels) above it — swapped via a `requestAnimationFrame` zoom monitor.

**API keys in use:**
- `GEMINI_API_KEY` — environment variable only; set in `.env` locally, set in Vercel dashboard for production. Never hardcoded.
- MapTiler key — hardcoded in `index.html` (free tier, map tiles only)

## Deployment (Vercel)

The repo includes `vercel.json` for zero-config Vercel deployment:

1. Push the repo to GitHub
2. Import it at [vercel.com](https://vercel.com) → New Project → select the repo
3. Add `GEMINI_API_KEY` as an environment variable in the Vercel project settings
4. Deploy — Vercel auto-deploys on every push to `main`

The Gemini free tier allows 1,500 requests/day and 15/minute. No billing is triggered unless you explicitly enable it.
