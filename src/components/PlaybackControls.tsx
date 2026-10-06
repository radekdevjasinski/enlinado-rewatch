interface PlaybackControlsProps {
  isPlaying: boolean;
  isDisabled: boolean;
  onRestart: () => void;
  onToggle: () => void;
  onFinish: () => void;
}

export function PlaybackControls({ isPlaying, isDisabled, onRestart, onToggle, onFinish }: PlaybackControlsProps) {
  return (
    <div className="playback-controls">
      <button
        type="button"
        className="button button--secondary playback-controls__jump"
        disabled={isDisabled}
        onClick={onRestart}
        aria-label="Od początku fragmentu"
      >
        ⏮&#xFE0E;
      </button>
      <button type="button" className="button button--primary play-button" disabled={isDisabled} onClick={onToggle}>
        {isPlaying ? '⏸ Zatrzymaj fragment' : '▶ Odtwórz fragment'}
      </button>
      <button
        type="button"
        className="button button--secondary playback-controls__jump"
        disabled={isDisabled}
        onClick={onFinish}
        aria-label="Do końca fragmentu"
      >
        ⏭&#xFE0E;
      </button>
    </div>
  );
}
