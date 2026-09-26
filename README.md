# ⛈️ ELMA — El-Niño Local Monitoring & Accountability

**Cross-track civic platform:** county flood transparency (Track 2) + community emergency safety (Track 3).

## Quick start

```bash
npm install
cp .env.example .env.local   # optional
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

| Area | Route | Notes |
|------|--------|--------|
| Transparency | `/transparency` | Ward projects, paper vs field, **MapLibre map** |
| Policy AI | `/policy` | Qwen via ModelScope (+ OpenRouter or offline fallback) |
| Voice & text assistant | `/channels/phone` → Voice tab | Qwen chat + browser speech in/out |
| Emergency | `/emergency` | Web form + **USSD stub** `POST /api/ussd` |
| Alerts | `/alerts` | Verified vs rumor feed with motion |
| Shelters | `/shelters` | Occupancy + map |
| Moderator | `/moderate?key=…` | Set `ELMA_MODERATOR_KEY` in production |

## Stack

- **Next.js 14**, **Tailwind CSS v4**, **Shadcn UI**, **Framer Motion**
- **MapLibre** + `react-map-gl`
- **Supabase** optional (`supabase/schema.sql`) — `src/lib/data/repository.ts` falls back to demo seed + memory store
- **PWA**: `manifest.webmanifest`, `public/sw.js` (shell cache)

## USSD / SMS stub

Plain body or JSON `{ "text": "..." }`:

```text
REPORT|flooding|Nyalenda A|Water waist deep at Ring Road stage
```

## Data

Without Supabase env vars, the app uses Kisumu demo data and in-memory reports/alerts (moderation persists until server restart).

## License

MIT
