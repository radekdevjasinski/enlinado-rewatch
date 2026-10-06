import type { Phrase } from '../types/Phrase';

export interface PhraseMatch {
  start: number;
  end: number;
}

export function findPhraseMatch(text: string, phrases: Phrase[]): PhraseMatch | null {
  const lowerCaseText = text.toLowerCase();
  for (const phrase of phrases) {
    const start = lowerCaseText.indexOf(phrase.en.toLowerCase());
    if (start !== -1) return { start, end: start + phrase.en.length };
  }
  return null;
}
