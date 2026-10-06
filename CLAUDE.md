# Enlinadotok viewer

Prototype web app for learning English from short YouTube fragments: a vertical feed of clips, each with synced subtitles, a Polish translation and a short quiz. It exists to demonstrate the idea, so a working flow matters more than architecture.

The UI is in Polish. Code, identifiers and commit messages are in English.

## Commands

```
npm install
npm run dev       # local dev server
npm run build     # tsc --noEmit, then vite build into dist/
npm run preview   # serve the production build
```

There are no tests and no linter yet. `npm run build` is the only automated check, so run it before every commit.

## Stack

Vite, React 19, TypeScript (strict). No backend, no accounts, no router, no state library. Styling is one plain CSS file, `src/styles.css`, with design tokens as custom properties on `:root`.

## Layout

```
src/
  App.tsx, main.tsx, styles.css
  data/clips.json          all clip content
  types/                   one type per file (Clip, SubtitleLine, QuizQuestion, Phrase, ...)
  youtube/                 IFrame API loader, player factory, URL builders
  hooks/                   useYouTubePlayer, useCurrentTime, useActiveClipIndex,
                           useArrowNavigation, useScore
  subtitles/               pure helpers: current line, phrase matching
  components/              one component per file
.github/workflows/deploy.yml
```

How the pieces fit:

- `Feed` renders every clip as a `ClipCard` inside a scroll-snap container. `useActiveClipIndex` (IntersectionObserver) decides which card is active.
- Only the active card mounts `ActiveClip`, which owns the YouTube player. Other cards show a thumbnail. Leaving a card unmounts the player, which stops playback.
- `useYouTubePlayer` creates the player, maps its events to a `PlayerStatus`, and stops playback at `clip.end`. `useCurrentTime` polls `getCurrentTime()` every 200 ms while playing.
- `ClipStudy` (phrase, transcript, quiz button) and `QuizSheet` (quiz and summary) sit below the player. On phones the sheet slides up from the bottom; from 1024px they share the right-hand grid column.
- `useScore` keeps the set of correctly answered questions in `localStorage` under `enlinadotok.correctAnswers`, keyed as `<clipId>:<questionIndex>`.

## Hard constraints

These come from the YouTube embed rules and the original brief. Do not trade them away for a design.

- Use only the official YouTube IFrame Player API. Never download, host or proxy video files.
- Draw nothing on top of the player: no overlays, badges, custom play icons, progress bars or sheets covering it. Subtitles, quiz and progress bar go below it.
- Do not hide the player's controls or the YouTube logo. Keep the player at least 200×200 px.
- Keep `playsinline=1` and the `origin` parameter. Never add `noreferrer` to the player or its page; YouTube needs the Referer header. Links to the original use `rel="noopener"` only.
- Do not assume autoplay with sound works. The first clip starts on a tap; later clips try to start on their own and fall back to the visible play button.
- Embed errors (codes 100, 101, 150) show a message with a link to the original, and the feed keeps working.
- Each card shows the video title, the channel name and a link to the original opened at `start`.
- Do not invent what is said in a recording. If content is missing, leave a field marked `[DO UZUPEŁNIENIA]`.

## Clip data

Everything lives in `src/data/clips.json`. The schema is `src/types/Clip.ts`; the README explains how to add a clip.

- `start`, `end` and subtitle `from`/`to` are seconds from the start of the video, not from the start of the fragment. They may be fractional.
- The YouTube player takes whole seconds only, so `createClipPlayer` floors `start` and ceils `end`. The exact end is enforced by the polling in `useYouTubePlayer`.
- Subtitle lines are contiguous: each `to` equals the next line's `from`, and the last `to` equals `end`.
- `phrases` is optional. A phrase that appears in a subtitle line is highlighted there (first match wins, case-insensitive).
- Quiz questions are single choice with 1 to 3 questions per clip.

The current content was derived from an older generator project at `C:\Users\radek.dev\Documents\enlinadotok generator`: fragment times and questions from `processed_videos/*_quiz.txt`, line timings from the Whisper word timestamps in `raw_videos/*_words.txt`. The `.mp4` files there must never be used by this app.

## Design

The look follows the "Enlinadotok v2" project on claude.ai/design (project id `ce88cd76-1599-4fee-a978-357dda84c6c0`, file `Enlinadotok v2.dc.html`). Deliberate departures, all caused by the constraints above or by missing data:

- No pause icon, level badge or progress bar on the player; the quiz sheet stops below the player.
- 9:16 clips are not full screen with subtitles over the video.
- The feed scrolls between clips; the design switched clips with buttons.
- No level, streak or avatar, because there is no data or account for them.

## Things that bite

- In the desktop grid, `.clip-study` and `.quiz-sheet` share one cell. The transcript list is positioned, so the sheet needs its own `position` and `z-index` or the transcript paints through it.
- After `seekTo`, the polled time can briefly still be the old value. `hasEnteredFragmentRef` in `useYouTubePlayer` prevents that stale value from ending the fragment immediately. Reset it whenever you seek.
- `useYouTubePlayer` reads `shouldAutoplay` once through a ref on purpose. Putting it in the effect dependencies would recreate the player when the first clip starts.
- The player is mounted into a div created imperatively inside the host element, so React StrictMode's double effect does not fight the iframe that YouTube swaps in.
- Git on this machine converts line endings to CRLF. Scripts that parse project files should split on `/\r?\n/`.

## Deployment

GitHub Pages through `.github/workflows/deploy.yml`, triggered by a push to `main`. The workflow sets `BASE_PATH` to `/<repo name>/`, which `vite.config.ts` uses as `base`; locally it defaults to `/`.

As of 2026-10-06 the repository exists only locally. Nothing has been pushed and Pages is not enabled. The planned repo is `radekdevjasinski/enlinadotok-viewer`.

## Git

Work on a branch (`feature/`, `bugfix/`, `chore/`), use Conventional Commits, and never push without asking first. Every push to `main` publishes the site.
