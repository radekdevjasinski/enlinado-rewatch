import { useEffect, useRef } from 'react';
import type { Phrase } from '../types/Phrase';
import type { SubtitleLine } from '../types/SubtitleLine';
import { formatClockTime } from './formatClockTime';
import { HighlightedText } from './HighlightedText';

interface TranscriptProps {
  lines: SubtitleLine[];
  phrases: Phrase[];
  fragmentStart: number;
  activeIndex: number;
  isConcealed: boolean;
  isTranslationVisible: boolean;
  onToggleTranslation: () => void;
  onSeek: (seconds: number) => void;
}

export function Transcript(props: TranscriptProps) {
  const { lines, phrases, activeIndex, isConcealed, isTranslationVisible } = props;
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
          Tłumaczenie
          <input
            type="checkbox"
            role="switch"
            className="switch"
            checked={isTranslationVisible}
            onChange={props.onToggleTranslation}
          />
        </label>
      </div>
      <div className="transcript__body">
        <ol
          ref={listRef}
          className={isConcealed ? 'transcript__list transcript__list--concealed' : 'transcript__list'}
          inert={isConcealed}
          aria-hidden={isConcealed}
        >
          {lines.map((line, index) => (
            <li key={line.from}>
              <button
                type="button"
                className={index === activeIndex ? 'transcript-line transcript-line--active' : 'transcript-line'}
                onClick={() => props.onSeek(line.from)}
              >
                <span className="transcript-line__time">{formatClockTime(line.from - props.fragmentStart)}</span>
                <span className="transcript-line__text">
                  <span lang="en">
                    <HighlightedText text={line.en} phrases={phrases} />
                  </span>
                  {isTranslationVisible && <span className="transcript-line__translation">{line.pl}</span>}
                </span>
              </button>
            </li>
          ))}
        </ol>
        {isConcealed && (
          <div className="transcript__notice">
            <p className="transcript__notice-card">
              <strong>Transkrypcja w kroku 2</strong>
              Najpierw spróbuj zrozumieć ze słuchu
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
