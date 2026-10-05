# Company Journey Map

An interactive **2.5D company map where the event agenda becomes a journey** —
Airport → Board Room → Signature Tower → ODC → EB 5. The map is the experience,
the route is the narrative, each location is a chapter of the agenda.

Built as a single self-contained page: **SVG + CSS + vanilla JS**, no build step,
no dependencies (fonts load from Google Fonts). Pink-on-white identity, full dark mode.

## Run it

Just open `index.html` in any modern browser. Or serve the folder:

```bash
python -m http.server 8791
# then open http://localhost:8791/index.html
```

A hosted, shareable version is also published as a Claude Artifact (private link).

## How it works

- **Left panel** is the scroll driver + clickable index. Scroll to travel the
  route; click any agenda row (or a card's "Next" button) to fly straight there.
- **Right map** is a fixed 2.5D SVG scene: iso buildings, a continuous route that
  draws itself up to the active stop, a traveler dot that moves along the path,
  and a camera that eases to each location. The **Overview** button pulls back to
  show the whole route.
- Scroll and click share one `setActive(i)` so the map, route, traveler, markers,
  cards, and progress bar always stay in sync.

## Editing the agenda

Everything — map layout **and** agenda content — comes from a single `LOC` array
near the top of the `<script>` in `index.html`. Each entry:

```js
{ n:'01', name:'Airport', title:'Arrival & Registration', time:'09:00 — 09:45',
  who:'Guest Relations', tags:['Check-in','Welcome'],
  desc:'…',
  x:430, y:1990, w:6.2, d:4, h:1.3 }   // x,y = world position · w,d,h = iso footprint & height
```

- Change `title` / `time` / `who` / `tags` / `desc` to set the real session content.
- Change `x` / `y` to move a building on the map; `w` / `d` / `h` to reshape it
  (taller `h` = tall tower, wide `w`+`d` = low sprawling block).
- Add or remove entries and everything (nav list, cards, route, markers) regenerates.

Colours live as CSS custom properties in `:root` (light) and the dark blocks —
`--pink`, `--deep`, `--soft`, `--ink`, building face tokens, etc.

## Possible next steps

Lightweight prototype first, on purpose. If the interaction feels right, candidates
for a later pass: port into Next.js + Tailwind, richer building artwork, GSAP/Lenis
smooth scroll, ambient audio, and real speaker/company data. Three.js/R3F only if
true 3D camera depth is wanted — the current SVG approach covers the 2.5D look far
more cheaply.

## Login (per-attendee journeys)

The site is behind a password page. Each attendee's password is their first name
plus a shared suffix (default `@india2026`, e.g. `imraan@india2026`); the password
decides which sessions and buildings they see. Attendee names are never shown in
the UI, and the full timetable lives server-side in `data/agendaSource.ts` — the
browser only receives the signed-in attendee's own rooms from `/api/me`.

- Set `SESSION_SECRET` in production (see `.env.example`).
- Needs a Node server (`next start` / Vercel), not a static export.
- Attendees, passwords and who attends what: `data/attendees.ts`, `data/agendaSource.ts`.
