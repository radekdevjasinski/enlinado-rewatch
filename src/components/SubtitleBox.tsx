import type { Phrase } from '../types/Phrase';
import type { SubtitleLine } from '../types/SubtitleLine';
import { HighlightedText } from './HighlightedText';

interface SubtitleBoxProps {
  line?: SubtitleLine;
  phrases: Phrase[];
  isTranslationVisible: boolean;
}

export function SubtitleBox({ line, phrases, isTranslationVisible }: SubtitleBoxProps) {
  if (!line) return <p className="subtitle-box placeholder">Napisy do uzupełnienia w clips.json.</p>;

  return (
    <div className="subtitle-box" aria-live="off">
      <p className="subtitle-box__text" lang="en">
        <HighlightedText text={line.en} phrases={phrases} />
      </p>
      {isTranslationVisible && <p className="subtitle-box__translation">{line.pl}</p>}
    </div>
  );
}
