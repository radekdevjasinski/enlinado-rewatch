# Enlinadotok

Prototyp aplikacji do nauki angielskiego: pionowy feed krótkich fragmentów filmów z YouTube'a z napisami i quizem po każdym klipie. Vite + React + TypeScript, bez backendu.

Filmy są odtwarzane wyłącznie przez oficjalny YouTube IFrame Player API. Aplikacja niczego nie pobiera ani nie hostuje.

## Uruchomienie lokalne

```
npm install
npm run dev
```

Produkcyjny build: `npm run build` (wynik w `dist/`), podgląd: `npm run preview`.

## Dodawanie nowego klipu

Wszystkie klipy są w `src/data/clips.json`. Dopisz do tablicy nowy obiekt:

```json
{
  "id": "clip-08",
  "videoId": "dQw4w9WgXcQ",
  "start": 42,
  "end": 58,
  "aspect": "16:9",
  "level": "B1",
  "title": "Tytuł filmu",
  "channel": "Nazwa kanału",
  "phrases": [
    { "en": "English phrase", "pl": "polskie znaczenie" }
  ],
  "subtitles": [
    { "from": 42.0, "to": 45.5, "en": "English line", "pl": "Polskie tłumaczenie" }
  ],
  "quiz": [
    {
      "type": "single_choice",
      "question": "Pytanie po polsku lub angielsku",
      "options": ["Odpowiedź A", "Odpowiedź B", "Odpowiedź C"],
      "correct": 0,
      "explanation": "Krótkie wyjaśnienie po polsku"
    }
  ]
}
```

Zasady:

- `id` musi być unikalne. Służy też jako klucz licznika poprawnych odpowiedzi w `localStorage`.
- `videoId` to fragment adresu po `watch?v=`.
- `start` i `end` to sekundy liczone od początku filmu.
- `from` i `to` w napisach też są liczone od początku filmu, nie od `start`.
- `aspect` to `"16:9"` albo `"9:16"` (Shorts).
- `level` to poziom angielskiego w skali CEFR: `"A1"`, `"A2"`, `"B1"`, `"B2"`, `"C1"` albo `"C2"`.
- `phrases` jest opcjonalne. Wszystkie zwroty trafiają do podsumowania quizu. Zwrot, który występuje w linii napisów, jest w niej podświetlany.
- `type` to `"single_choice"` albo `"true_false"`. Pytanie `true_false` ma odpowiedzi `["Prawda", "Fałsz"]` w tej kolejności.
- `correct` to indeks poprawnej odpowiedzi, liczony od 0.
- Klip ma 5 pytań. Aplikacja losuje z nich 3 na każde podejście i miesza kolejność odpowiedzi (poza `true_false`).

Pełny opis tego, co musi zawierać klip, jest w `../enlinadotokClipGenerator/CLAUDE.md`.

Przed dodaniem sprawdź, czy film da się osadzić: otwórz `https://www.youtube.com/embed/<videoId>`. Jeśli właściciel wyłączył osadzanie, aplikacja pokaże komunikat z linkiem do oryginału zamiast odtwarzacza.

### Pola do uzupełnienia

Brakujące dane są oznaczone w `clips.json` tekstem `[DO UZUPEŁNIENIA]`. Obecnie żaden klip nie ma takich pól.

`start` i `end` mogą być ułamkowe (np. `106.12`). Odtwarzacz YouTube przyjmuje tylko pełne sekundy, więc film startuje od sekundy zaokrąglonej w dół, a dokładny koniec fragmentu pilnuje aplikacja.

## Wdrożenie

Strona jest publikowana na GitHub Pages przez workflow `.github/workflows/deploy.yml` po każdym pushu na `main`. Ścieżka `base` dla Vite jest ustawiana w workflow z nazwy repozytorium (zmienna `BASE_PATH`), więc zmiana nazwy repo nie wymaga zmian w kodzie.

Ponowne wdrożenie po zmianie klipów:

```
git checkout -b feature/nowy-klip
npm run build
git add src/data/clips.json
git commit -m "feat: add new clip"
git push -u origin feature/nowy-klip
```

Potem otwórz pull request do `main` i go scal. Po scaleniu zakładka Actions na GitHubie pokaże postęp, a strona odświeży się po około minucie.

Jednorazowa konfiguracja repozytorium: Settings → Pages → Source: **GitHub Actions**.
