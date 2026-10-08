import { formatClockTime } from './formatClockTime';

interface PlaybackControlsProps {
  isPlaying: boolean;
  isDisabled: boolean;
  elapsedSeconds: number;
  durationSeconds: number;
  onPreviousLine: () => void;
  onToggle: () => void;
  onNextLine: () => void;
}

export function PlaybackControls(props: PlaybackControlsProps) {
  const { isPlaying, isDisabled } = props;

  return (
    <div className="playback-controls">
      <p className="playback-controls__time">
        {formatClockTime(props.elapsedSeconds)}{' '}
        <span className="playback-controls__duration">/ {formatClockTime(props.durationSeconds)}</span>
      </p>
      <div className="playback-controls__buttons">
        <button
          type="button"
          className="playback-controls__line-button"
          disabled={isDisabled}
          onClick={props.onPreviousLine}
          aria-label="Poprzednie zdanie"
        >
          <span className="icon-skip" />
        </button>
        <button
          type="button"
          className="playback-controls__toggle"
          disabled={isDisabled}
          onClick={props.onToggle}
          aria-label={isPlaying ? 'Zatrzymaj fragment' : 'Odtwórz fragment'}
        >
          <span className={isPlaying ? 'icon-pause' : 'icon-play'} />
        </button>
        <button
          type="button"
          className="playback-controls__line-button"
          disabled={isDisabled}
          onClick={props.onNextLine}
          aria-label="Następne zdanie"
        >
          <span className="icon-skip icon-skip--next" />
        </button>
      </div>
    </div>
  );
}
