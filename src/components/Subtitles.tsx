import { useEffect, useRef } from 'react';
import type { SubtitleLine } from '../types/SubtitleLine';

interface SubtitlesProps {
  lines: SubtitleLine[];
  currentTime: number;
  isTranslationVisible: boolean;
  onToggleTranslation: () => void;
}

export function Subtitles({ lines, currentTime, isTranslationVisible, onToggleTranslation }: SubtitlesProps) {
  const listRef = useRef<HTMLOListElement>(null);
  const activeIndex = lines.findIndex((line) => currentTime >= line.from && currentTime < line.to);

  useEffect(() => {
    const list = listRef.current;
    const activeLine = list?.children[activeIndex];
    if (!list || !(activeLine instanceof HTMLElement)) return;
    list.scrollTop = activeLine.offsetTop - list.clientHeight / 2 + activeLine.clientHeight / 2;
  }, [activeIndex]);

  return (
    <section className="subtitles">
      <label className="subtitles__toggle">
        <input type="checkbox" checked={isTranslationVisible} onChange={onToggleTranslation} />
        Pokaż tłumaczenie
      </label>
      {lines.length === 0 && <p className="placeholder">Napisy do uzupełnienia w clips.json.</p>}
      <ol ref={listRef} className="subtitles__list">
        {lines.map((line, index) => (
          <li
            key={`${line.from}-${index}`}
            className={index === activeIndex ? 'subtitle-line subtitle-line--active' : 'subtitle-line'}
          >
            <span lang="en">{line.en}</span>
            {isTranslationVisible && <span className="subtitle-line__translation">{line.pl}</span>}
          </li>
        ))}
      </ol>
    </section>
  );
}
