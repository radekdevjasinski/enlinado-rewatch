import { useEffect, useRef } from 'react';
import type { Phrase } from '../types/Phrase';
import type { SubtitleLine } from '../types/SubtitleLine';
import { HighlightedText } from './HighlightedText';

interface TranscriptProps {
  lines: SubtitleLine[];
  phrases: Phrase[];
  activeIndex: number;
  isTranslationVisible: boolean;
  onToggleTranslation: () => void;
  onSeek: (seconds: number) => void;
}

export function Transcript(props: TranscriptProps) {
  const { lines, phrases, activeIndex, isTranslationVisible } = props;
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    const activeLine = list?.children[activeIndex];
    if (!list || !(activeLine instanceof HTMLElement)) return;
    list.scrollTop = activeLine.offsetTop - list.clientHeight / 2 + activeLine.clientHeight / 2;
  }, [activeIndex]);

  return (
    <section className="transcript">
      <div className="transcript__header">
        <h3 className="eyebrow">Transkrypcja</h3>
        <label className="transcript__toggle">
          <input type="checkbox" checked={isTranslationVisible} onChange={props.onToggleTranslation} />
          Tłumaczenie
        </label>
      </div>
      <ol ref={listRef} className="transcript__list">
        {lines.map((line, index) => (
          <li key={line.from}>
            <button
              type="button"
              className={index === activeIndex ? 'transcript-line transcript-line--active' : 'transcript-line'}
              onClick={() => props.onSeek(line.from)}
            >
              <span lang="en">
                <HighlightedText text={line.en} phrases={phrases} />
              </span>
              {isTranslationVisible && <span className="transcript-line__translation">{line.pl}</span>}
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}
