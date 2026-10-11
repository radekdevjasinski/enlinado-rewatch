interface ClipNavigationProps {
  onPrevious?: () => void;
  onNext?: () => void;
}

export function ClipNavigation({ onPrevious, onNext }: ClipNavigationProps) {
  return (
    <div className="clip-navigation">
      <button type="button" className="clip-navigation__button" disabled={!onPrevious} onClick={onPrevious}>
        Poprzedni
      </button>
      <span className="clip-navigation__divider" />
      <button type="button" className="clip-navigation__button" disabled={!onNext} onClick={onNext}>
        Następny
      </button>
    </div>
  );
}
