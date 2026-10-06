interface FragmentSliderProps {
  start: number;
  end: number;
  currentTime: number;
  isDisabled: boolean;
  onSeek: (seconds: number) => void;
}

export function FragmentSlider({ start, end, currentTime, isDisabled, onSeek }: FragmentSliderProps) {
  const position = Math.min(Math.max(currentTime, start), end);

  return (
    <input
      type="range"
      className="fragment-slider"
      min={start}
      max={end}
      step={0.1}
      value={position}
      disabled={isDisabled}
      onChange={(event) => onSeek(Number(event.target.value))}
      aria-label="Pozycja we fragmencie"
    />
  );
}
