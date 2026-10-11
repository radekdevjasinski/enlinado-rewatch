# Enlinado Rewatch viewer

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
                           useArrowNavigation, useScore, useClipFeedback
  subtitles/               pure helpers: current line, phrase matching
  quiz/                    pure helpers: draw questions for an attempt, shuffle options
  random/                  shuffle
  profile/                 placeholder streak and avatar values
  components/              one component per file
.github/workflows/deploy.yml
```

How the pieces fit:

- `App` shuffles the clips once per page load, so the feed order is random on every visit.
- `Feed` renders clips as `ClipCard`s inside a scroll-snap container, but only up to `CLIPS_RENDERED_AHEAD` cards past the active one. More cards are appended as the user scrolls, so the DOM does not grow with the size of `clips.json`. `useActiveClipIndex` (IntersectionObserver) decides which card is active and re-observes the cards when their count changes.
- Only the active card mounts `ActiveClip`, which owns the YouTube player. Other cards show a thumbnail. Leaving a card unmounts the player, which stops playback.
- `useYouTubePlayer` creates the player, maps its events to a `PlayerStatus`, and stops playback at `clip.end`. `useCurrentTime` polls `getCurrentTime()` every 200 ms while playing.
- `PlayerStatus` goes `loading` (iframe not ready) → `ready` → `starting` (play requested, no frame yet: the player reports `UNSTARTED` or `BUFFERING`) → `playing`. While it is `loading` or `starting`, `PlayerLoadingNotice` takes the place of the subtitle box below the player. On the public site `starting` can last 10-15 s, most likely a pre-roll ad slot, during which the player itself is black.
- `ActiveClip` walks each clip through three phases (`ClipPhase`): `listening` (`ListeningPrompt` instead of the subtitle box, transcript blurred and inert), `reading` (subtitles and transcript) and `quiz`. The end of the fragment in `listening` replays it in `reading`; the end in `reading` opens the quiz. `PhaseStepper` lets the user jump to any phase.
- `.player-area` stacks the player, then the subtitle box (`ListeningPrompt` in `listening`), then `.fragment-controls`; the source row with the channel name and the link to the original comes after that, in `.clip-info`. `.fragment-controls` holds `FragmentTimeline` (one clickable segment per subtitle line, width proportional to its duration) and `PlaybackControls` (time, previous line, play/pause, next line). Next on the last line calls `finish()`.
- `.clip-side` wraps the stepper, `ClipStudy` and `QuizSheet`. On phones it is `display: contents`, so the sheet still positions against `.clip-body`; from 1024px it is the right-hand card with the stepper as its header. `ClipNavigation` is a pill next to the channel name, desktop only.
- The clip's CEFR level comes from `clip.level`. `LevelChip` shows it with its Polish name in front of the channel badge, on phones and desktop, on active and inactive cards. It is not in the header, where it read as an account setting.
- The channel name is a badge (`.channel-badge` in `SourceMeta`) that links to the original at `start`. There is no separate "Oryginał na YouTube" link (Radek's decision, 2026-10-11).
- Below 1024px the open quiz hides the subtitle box and `.fragment-controls` (`.player-area--quiz`), because the sheet may not cover the player and would otherwise be left with almost no height in a short window.
- The header shows the same items at every width: logo, `StreakLabel`, `ScoreBadge` and `ProfileAvatar`.
- `ClipFeedbackBar` (like, dislike, report) sits in the source row of the active card. `useClipFeedback` keeps the vote and the reported flag in `localStorage` under `enlinado-rewatch.clipFeedback`, keyed by clip id. There are no counters and nothing is sent anywhere: `ReportDialog` only marks the clip as reported and `ClipReport` shows a thank-you toast. The dialog and the toast render inside `.clip-side`, so they cover the area below the player on phones and the right-hand card on desktop, never the player.
- `src/profile/placeholderProfile.ts` feeds the parts of the design that do not work yet: `StreakLabel` and `ProfileAvatar` (header) and the streak in `QuizSummary`. The values are neutral placeholders, not real data.
- `ClipStudy` (transcript, quiz button) and `QuizSheet` (quiz and summary) sit below the player. On phones the sheet slides up from the bottom; from 1024px they share the right-hand grid column.
- `useScore` keeps the set of correctly answered questions in `localStorage` under `enlinado-rewatch.correctAnswers`, keyed as `<clipId>:<questionIndex>`.

## Hard constraints

These come from the YouTube embed rules and the original brief. Do not trade them away for a design.

- Use only the official YouTube IFrame Player API. Never download, host or proxy video files.
- Draw nothing on top of the player: no overlays, badges, custom play icons, progress bars or sheets covering it. Subtitles, quiz and progress bar go below it.
- Do not hide the player's controls or the YouTube logo. Keep the player at least 200×200 px.
- Keep `playsinline=1` and the `origin` parameter. Never add `noreferrer` to the player or its page; YouTube needs the Referer header. Links to the original use `rel="noopener"` only.
- Do not assume autoplay with sound works. The first clip starts on a tap; later clips try to start on their own and fall back to the visible play button.
- Embed errors (codes 100, 101, 150) show a message with a link to the original, and the feed keeps working.
- Each card shows the channel name and a link to the original opened at `start`. Inactive cards also show the video title; the active card leaves it to the YouTube player, which displays it itself (Radek's decision, 2026-10-06).
- Do not invent what is said in a recording. If content is missing, leave a field marked `[DO UZUPEŁNIENIA]`.

## Clip data

Everything lives in `src/data/clips.json`. The schema is `src/types/Clip.ts`; the README explains how to add a clip.

- `start`, `end` and subtitle `from`/`to` are seconds from the start of the video, not from the start of the fragment. They may be fractional.
- The YouTube player takes whole seconds only, so `createClipPlayer` floors `start` and ceils `end`. The exact end is enforced by the polling in `useYouTubePlayer`.
- Subtitle lines are contiguous: each `to` equals the next line's `from`, and the last `to` equals `end`.
- `phrases` is optional. A phrase that appears in a subtitle line is highlighted there (first match wins, case-insensitive).
- Each clip has 5 quiz questions. Every question has a `type`: `single_choice` or `true_false`.
- A quiz attempt draws 3 random questions (`QUESTIONS_PER_ATTEMPT` in `src/quiz/drawQuizQuestions.ts`) and shuffles the options of `single_choice` questions. `true_false` keeps its order. The draw happens once per `QuizPanel` mount, so "Obejrzyj ponownie" redraws.
- The score key uses the question's index in `clips.json`, not its position in the attempt, so reordering questions in the file changes which ones count as already answered.
- `../enlinado-rewatch-clip-generator/CLAUDE.md` (a sibling folder, outside this repository) is the spec for what a generated clip must contain. Keep it in sync with `src/types/` when the schema changes.

The current content was derived from an older generator project at `C:\Users\radek.dev\Documents\enlinadotok generator`: fragment times and questions from `processed_videos/*_quiz.txt`, line timings from the Whisper word timestamps in `raw_videos/*_words.txt`. The `.mp4` files there must never be used by this app.

## Design

The look follows the "Enlinadotok v3" project file on claude.ai/design (project id `ce88cd76-1599-4fee-a978-357dda84c6c0`, file `Enlinadotok v3.dc.html`). Deliberate departures, all caused by the constraints above or by missing data:

- No pause icon, level badge or progress bar on the player; the quiz sheet stops below the player.
- 9:16 clips are not full screen with subtitles over the video.
- The feed scrolls between clips; the design switched clips with buttons.
- Streak and avatar are shown as non-working placeholders (Radek's decision, 2026-10-08), because there is no data or account for them yet.
- Like, dislike and report have no counters and no backend (Radek's decision, 2026-10-11). On 9:16 clips they use the same pill as 16:9 clips instead of a rail drawn over the video, and the report dialog does not cover the player.
- Subtitles sit between the player and the playback controls, not below the controls (Radek's decision, 2026-10-11).
- The level badge is never drawn on the player, and the active card still has no title of its own.

## Things that bite

- `useArrowNavigation` listens on `window` and calls `preventDefault` on the up and down arrows. `ReportDialog` stops key events from bubbling so the arrows can move between its radio buttons instead of scrolling the feed.
- In the desktop grid, `.clip-study` and `.quiz-sheet` share one cell. The transcript list is positioned, so the sheet needs its own `position` and `z-index` or the transcript paints through it.
- After `seekTo`, the polled time can briefly still be the old value. `hasEnteredFragmentRef` in `useYouTubePlayer` prevents that stale value from ending the fragment immediately. Reset it whenever you seek.
- `useYouTubePlayer` reads `shouldAutoplay` once through a ref on purpose. Putting it in the effect dependencies would recreate the player when the first clip starts.
- The player is mounted into a div created imperatively inside the host element, so React StrictMode's double effect does not fight the iframe that YouTube swaps in.
- `disablePlayerCaptions` calls the undocumented `unloadModule('captions')` every time playback starts, so YouTube's own captions do not spoil the `listening` phase. It is not part of the official IFrame API and may stop working without notice.
- Every seek goes through `seekTo`, which resets `hasEnteredFragmentRef`. A seek to exactly `clip.end` would therefore never end the fragment, so use `finish()` for that case.
- `FragmentTimeline` only sets the segment tooltip (the English line) outside the `listening` phase, so hovering does not reveal the subtitles early.
- Git on this machine converts line endings to CRLF. Scripts that parse project files should split on `/\r?\n/`.

## Deployment

GitHub Pages through `.github/workflows/deploy.yml`, triggered by a push to `main`. The workflow sets `BASE_PATH` to `/<repo name>/`, which `vite.config.ts` uses as `base`; locally it defaults to `/`.

The repository is `radekdevjasinski/enlinado-rewatch`. Pages is enabled with GitHub Actions as the source, and the site is at https://radekdevjasinski.github.io/enlinado-rewatch/.

## Git

Work on a branch (`feature/`, `bugfix/`, `chore/`), use Conventional Commits, and never push without asking first. Every push to `main` publishes the site.
