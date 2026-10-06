interface ProgressBarProps {
  fraction: number;
}

export function ProgressBar({ fraction }: ProgressBarProps) {
  const percent = Math.min(Math.max(fraction, 0), 1) * 100;

  return (
    <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(percent)}>
      <div className="progress__fill" style={{ width: `${percent}%` }} />
    </div>
  );
}
