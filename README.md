# Enlinado Rewatch

Prototype of an app for learning English: a vertical feed of short YouTube fragments with subtitles and a quiz after each clip. Vite, React and TypeScript, no backend.

Videos play only through the official YouTube IFrame Player API. The app downloads and hosts nothing.

## Run it

```
npm install
npm run dev
```

`npm run build` checks the types and writes the production build to `dist/`. `npm run preview` serves that build.

## Clips

All clips are in `src/data/clips.json`. Most come from the generator in `../enlinado-rewatch-clip-generator`, whose `publish` command appends to this file. The full description of a clip is in `../enlinado-rewatch-clip-generator/CLAUDE.md`, and the types in `src/types/` are the final word.

After the file changes, run `npm run build`, watch the new clips with `npm run dev` and commit `clips.json`.

To add a clip by hand, append an object like this:

```json
{
  "id": "clip-0120",
  "videoId": "dQw4w9WgXcQ",
  "start": 42,
  "end": 58,
  "aspect": "16:9",
  "level": "B1",
  "title": "Video title",
  "channel": "Channel name",
  "phrases": [
    { "en": "English phrase", "pl": "polskie znaczenie" }
  ],
  "subtitles": [
    { "from": 42.0, "to": 45.5, "en": "English line", "pl": "Polskie tłumaczenie" }
  ],
  "quiz": [
    {
      "type": "single_choice",
      "question": "Pytanie po polsku",
      "options": ["Odpowiedź A", "Odpowiedź B", "Odpowiedź C"],
      "correct": 0,
      "explanation": "Krótkie wyjaśnienie po polsku"
    }
  ]
}
```

- `id` is unique and never reused, also after a clip is deleted: the score in `localStorage` is saved under it.
- One clip per video: `videoId` (the part of the address after `watch?v=`) appears once in the file.
- `start`, `end`, `from` and `to` are seconds from the start of the video and may be fractional. YouTube starts at the whole second below `start`; the app enforces the exact end.
- `aspect` is `"16:9"` or `"9:16"`. `level` is a CEFR level from `"A1"` to `"C2"`.
- `phrases` is optional. Every phrase goes to the quiz summary and is highlighted in the subtitle line that contains it.
- A clip has 5 questions. The app draws 3 per attempt and shuffles the options.
- `type` is `"single_choice"` or `"true_false"`. A `true_false` question has the options `["Prawda", "Fałsz"]` in that order, and they are not shuffled.
- `correct` is the index of the right option, counted from 0.
- Unknown data is marked `[DO UZUPEŁNIENIA]`.

Check that the video can be embedded: open `https://www.youtube.com/embed/<videoId>`. When the owner has turned embedding off, the app shows a link to the original instead of the player.

## Deployment

The workflow `.github/workflows/deploy.yml` publishes the site to GitHub Pages on every push to `main`. It sets Vite's `base` path from the repository name (`BASE_PATH`), so renaming the repository needs no code change.

One-time setup on GitHub: create the repository, push `main`, then Settings → Pages → Source: **GitHub Actions**.
