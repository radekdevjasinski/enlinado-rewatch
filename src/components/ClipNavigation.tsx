interface ClipNavigationProps {
  onPrevious?: () => void;
  onNext?: () => void;
}

export function ClipNavigation({ onPrevious, onNext }: ClipNavigationProps) {
  return (
    <div className="clip-navigation">
      <button type="button" className="round-button" disabled={!onPrevious} onClick={onPrevious} aria-label="Poprzedni klip">
        ↑
      </button>
      <button type="button" className="round-button" disabled={!onNext} onClick={onNext} aria-label="Następny klip">
        ↓
      </button>
    </div>
  );
}
