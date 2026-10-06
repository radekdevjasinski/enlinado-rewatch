import { findPhraseMatch } from '../subtitles/findPhraseMatch';
import type { Phrase } from '../types/Phrase';

interface HighlightedTextProps {
  text: string;
  phrases: Phrase[];
}

export function HighlightedText({ text, phrases }: HighlightedTextProps) {
  const match = findPhraseMatch(text, phrases);
  if (!match) return <>{text}</>;

  return (
    <>
      {text.slice(0, match.start)}
      <span className="highlight">{text.slice(match.start, match.end)}</span>
      {text.slice(match.end)}
    </>
  );
}
