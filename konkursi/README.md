# Konkursi

A 4-minute 2D animated short for Anti-Corruption Week, built as code with
[Remotion](https://www.remotion.dev) (React + TypeScript, every drawing is SVG).

## Run it

```bash
npm install
npm run studio        # preview and scrub in the browser
npm run stills        # out/stills/scene-01.png … scene-09.png (review stills)
npm run render        # out/konkursi.mp4 — 1920×1080, 30 fps, H.264
```

## Where things live

| File | What it holds |
| --- | --- |
| `src/config.ts` | Frame size, `SHOW_SUBTITLES`, `INSTITUTION_NAME`, `UNIVERSITY`, surnames, `REPORT_LINE`, `HASHTAG`, `LOGO_PATH`, grain, VO file names and placeholder lengths |
| `src/timeline.ts` | **Every timing**: scenes, shots, events, cards and review-still times, in brief seconds. `sec()` is the only seconds→frames conversion. |
| `src/text.ts` | Every Albanian string, exactly as in the brief, and the subtitle chunks |
| `src/rig/` | The character rig (`Person.tsx`) and the cast (`cast.ts`) |
| `src/devices/` | Split screen, camera/push-in, text cards and subtitles, phone screens, wall clocks, lip-sync, grain |
| `src/sets/` | Apartments, institution (lobby, interview room, corridor, front steps), café/bar, street and bus, CV table |
| `src/scenes/` | Scenes 1–9 |

## Voice-over

Put the four recordings in `public/audio/` with the names in `src/config.ts`
(`vo1_kryetari_suela.wav`, `vo2_kryetari_era.wav`, `vo3_suela.wav`, `vo4_era.wav`).
The film measures each file when it loads: shots 6a, 6c and 6e grow or shrink to fit,
and everything after them shifts. When a file is present the speaker's mouth follows its
amplitude; when it is missing that stretch plays silent with an 8 Hz placeholder mouth that
pauses at commas and "...". There is no other audio in the film.

## Before the final render

- Fill the placeholders in `src/config.ts` (`INSTITUTION_NAME`, `UNIVERSITY`, surnames, `REPORT_LINE`).
- Add `public/logo.png` (an empty 240×120 outlined box is drawn until then).
- Add the four VO files.

## Fonts

Inter (400/600/700) from Google Fonts is stored in `public/fonts/` so renders never need the
network. `node scripts/fetch-fonts.mjs` downloads it again. The `FontTest` composition renders
`Ëëë... Çfarë përgjigje` in all three weights (`out/fonttest.png`).

## Licence note

Remotion is free for individuals, non-profits and small companies; larger for-profit
organisations need a company licence. See https://www.remotion.dev/license.
