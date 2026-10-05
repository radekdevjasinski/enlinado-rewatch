import type { Clip } from '../types/Clip';
import { buildWatchUrl } from '../youtube/buildWatchUrl';

interface PlayerErrorProps {
  clip: Clip;
  errorCode: number | null;
  onNext?: () => void;
}

function describeError(errorCode: number | null): string {
  if (errorCode === 100) return 'Ten film został usunięty albo jest prywatny.';
  if (errorCode === 101 || errorCode === 150) {
    return 'Właściciel filmu nie pozwala odtwarzać go poza YouTube’em.';
  }
  return 'Nie udało się odtworzyć tego filmu.';
}

export function PlayerError({ clip, errorCode, onNext }: PlayerErrorProps) {
  return (
    <div className="player-error" role="alert">
      <p>{describeError(errorCode)}</p>
      <a href={buildWatchUrl(clip)} target="_blank" rel="noopener">
        Otwórz oryginał na YouTubie ↗
      </a>
      {onNext && (
        <button type="button" className="button button--primary" onClick={onNext}>
          Następny klip
        </button>
      )}
    </div>
  );
}
