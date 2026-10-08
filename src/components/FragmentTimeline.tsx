import type { SubtitleLine } from '../types/SubtitleLine';

interface FragmentTimelineProps {
  lines: SubtitleLine[];
  currentTime: number;
  activeIndex: number;
  isDisabled: boolean;
  areLinesRevealed: boolean;
  onSeek: (seconds: number) => void;
}

function getPlayedPercent(line: SubtitleLine, currentTime: number): number {
  const playedShare = (currentTime - line.from) / (line.to - line.from);
  return Math.min(Math.max(playedShare, 0), 1) * 100;
}

export function FragmentTimeline(props: FragmentTimelineProps) {
  const { lines, currentTime, activeIndex, areLinesRevealed } = props;

  return (
    <div className="fragment-timeline" role="group" aria-label="Zdania we fragmencie">
      {lines.map((line, index) => (
        <button
          key={line.from}
          type="button"
          className={
            index === activeIndex
              ? 'fragment-timeline__segment fragment-timeline__segment--active'
              : 'fragment-timeline__segment'
          }
          style={{ flexGrow: line.to - line.from }}
          disabled={props.isDisabled}
          title={areLinesRevealed ? line.en : undefined}
          aria-label={`Zdanie ${index + 1}`}
          onClick={() => props.onSeek(line.from)}
        >
          <span className="fragment-timeline__track">
            <span className="fragment-timeline__fill" style={{ width: `${getPlayedPercent(line, currentTime)}%` }} />
          </span>
        </button>
      ))}
    </div>
  );
}
