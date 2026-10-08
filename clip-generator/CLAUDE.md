# Enlinadotok clip generator

This file describes the output of the clip generator: what one clip must contain so the Enlinadotok viewer can show it. It does not cover how to find videos, pick fragments or transcribe them.

The viewer reads an array of clip objects from `src/data/clips.json`. The schema lives in the viewer's `src/types/` (`Clip`, `SubtitleLine`, `Phrase`, `QuizQuestion`). If this file and those types disagree, the types win and this file needs an update.

## One clip

```json
{
  "id": "clip-08",
  "videoId": "5MuIMqhT8DM",
  "start": 106.12,
  "end": 123,
  "aspect": "16:9",
  "title": "Sleep Is Your Superpower | Matt Walker | TED",
  "channel": "TED",
  "phrases": [
    { "en": "soak up", "pl": "wchłaniać" }
  ],
  "subtitles": [
    { "from": 106.12, "to": 109.54, "en": "and now to actually prepare your brain,", "pl": "a teraz, żeby właściwie przygotować mózg," }
  ],
  "quiz": [
    {
      "type": "single_choice",
      "question": "Co znaczy „soak up”?",
      "options": ["Wchłaniać", "Wysuszać", "Powtarzać"],
      "correct": 0,
      "explanation": "„Soak up” to „wchłaniać, chłonąć”, tak jak gąbka chłonie wodę."
    }
  ]
}
```

## Fields

| Field | Type | Required | Rules |
|---|---|---|---|
| `id` | string | yes | Unique across the file, format `clip-NNNN` (older clips use `clip-NN`). Never reuse or renumber an existing id, even after a clip is deleted: it is part of the saved score key. |
| `videoId` | string | yes | The YouTube id, the part after `watch?v=`. |
| `start` | number | yes | Fragment start in seconds from the start of the video. May be fractional. |
| `end` | number | yes | Fragment end in seconds from the start of the video. Greater than `start`. |
| `aspect` | string | yes | `"16:9"` or `"9:16"` (Shorts). |
| `title` | string | yes | The original YouTube title, unchanged. |
| `channel` | string | yes | The channel name as shown on YouTube. |
| `phrases` | array | yes for generated clips | 4 to 5 items, see below. |
| `subtitles` | array | yes | At least one line, see below. |
| `quiz` | array | yes | Exactly 5 questions, see below. |

Do not add fields the viewer does not know. A new field needs a change in the viewer first.

The viewer shows clips in random order, so a clip must not depend on any other clip: no series, no "part 2", no reference to an earlier clip.

The video itself must have no subtitles burned into the picture. The viewer hides subtitles in the first step so the learner listens first, and burned-in text defeats that.

## Subtitles

Each line is `{ "from", "to", "en", "pl" }`.

- `from` and `to` are seconds from the start of the video, not from the start of the fragment.
- Lines are contiguous. The first `from` equals the clip's `start`, each `to` equals the next line's `from`, and the last `to` equals the clip's `end`.
- `en` is exactly what is said in the recording, in the speaker's words. Do not correct grammar, fill in missing words or tidy up false starts.
- `pl` is a natural Polish translation of that one line.
- Keep a line to one phrase or clause, roughly 1 to 4 seconds. The viewer shows one line at a time and draws one timeline segment per line.
- `from` values are unique within a clip.

## Phrases

Each phrase is `{ "en", "pl" }`.

- `en` appears word for word in at least one subtitle line of the clip. The viewer highlights it there (case-insensitive, first matching phrase per line wins).
- `pl` is the meaning in this context, short enough to fit one row in the quiz summary.
- Pick phrases worth learning: idioms, phrasal verbs, collocations. Skip single common words.
- `en` values are unique within a clip.

## Quiz

Each clip has exactly 5 questions. The viewer draws 3 of them at random for every attempt, so:

- Every question must make sense on its own. No "as in the previous question", no question that gives away the answer to another one.
- Any 3 of the 5 should make a reasonable quiz. Do not write 5 variations of the same question.

Each question is `{ "type", "question", "options", "correct", "explanation" }`.

| Field | Rules |
|---|---|
| `type` | `"single_choice"` or `"true_false"`. |
| `question` | The question text. Polish, with English quoted where the question is about the language. |
| `options` | The answers. All different from each other. |
| `correct` | Index of the right answer in `options`, counted from 0. |
| `explanation` | One or two Polish sentences shown after answering. Quote the words from the recording that prove the answer. |

Quoting inside `question` and `explanation`: wrap quoted words, English or Polish, in Polish quotation marks `„…”`. The viewer removes the marks and shows the text in bold (in a question: in colour). Do not use `"…"` or nest quotes, and do not use `„…”` for anything that should not be emphasised.

Rules for `single_choice`:

- 3 options, exactly one correct.
- The viewer shuffles the options. Never refer to a position or to other options: no "A i B", "obie powyższe", "żadna z powyższych".
- Wrong options are plausible but clearly wrong for someone who understood the fragment.

Rules for `true_false`:

- `options` is exactly `["Prawda", "Fałsz"]`, in that order. The viewer does not shuffle these.
- `correct` is `0` for a true statement and `1` for a false one.
- Start `question` with `Prawda czy fałsz:` followed by the statement.

Recommended mix for the 5 questions:

1. Comprehension: what was said or what happened in the fragment.
2. Gap fill: `Uzupełnij zdanie: „… ___ …”` with a sentence quoted from the subtitles.
3. True or false about the content.
4. Vocabulary: the meaning of a word or phrase from `phrases`.
5. One more comprehension or vocabulary question on a different part of the fragment.

Use at most 2 `true_false` questions per clip.

## Never invent content

Everything in a clip must come from the recording.

- Subtitles are what was actually said.
- Questions and explanations rely only on the fragment between `start` and `end`. No outside knowledge about the speakers, no names that are not spoken in the fragment.
- If something is unknown, write `[DO UZUPEŁNIENIA]` in that field instead of guessing.

## Checklist before a clip is done

- `id` is unique and `start` < `end`.
- Subtitle times are contiguous and span exactly `start` to `end`.
- Every phrase `en` is found in a subtitle line.
- There are exactly 5 questions and each has a `type`.
- `correct` is a valid index into `options`, and options are unique.
- `true_false` options are `["Prawda", "Fałsz"]`.
- No question depends on another question or on option order.
- The file is valid JSON and the viewer's `npm run build` passes.
