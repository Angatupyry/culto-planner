# culto-planner

Web app for worship coordinators: plan the songs and specials for each service, keep the hour on track, and show the lyrics during the service.

**Stack:** Vite · React 19 · TypeScript · React Router · Supabase · dnd-kit · Netlify

## Getting started

```bash
pnpm install
cp .env.example .env.local   # fill in your Supabase URL and anon key
pnpm dev
```

Without `.env.local` the app still runs, with a banner saying Supabase is not connected.

## Database

The schema lives in `supabase/migrations/`. Two ways to apply it:

- **Dashboard:** open Supabase → SQL Editor, paste `supabase/migrations/20261122000000_init.sql`, run it.
- **CLI:**
  ```bash
  pnpm supabase login
  pnpm supabase link --project-ref <your-project-ref>
  pnpm supabase db push
  pnpm db:types          # regenerate src/lib/database.types.ts
  ```

Tables: `songs` (library), `services` (worship days), `service_items` (ordered songs + specials per day).
Row Level Security: everyone can read; only signed-in users can write.

## Scripts

| Command         | What it does                    |
| --------------- | ------------------------------- |
| `pnpm dev`      | Dev server                      |
| `pnpm build`    | Type-check and production build |
| `pnpm lint`     | ESLint                          |
| `pnpm format`   | Prettier                        |
| `pnpm db:types` | Regenerate Supabase types       |

## Deploy (Netlify)

Connect the GitHub repo in Netlify; `netlify.toml` already sets the build command, publish folder and SPA redirect.
Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` under Site settings → Environment variables.

## Design

Tokens in `src/styles/theme.ts` (JS) and `src/styles/tokens.css` (CSS variables), taken from the design canvas.
