import type { Clip } from '../types/Clip';
import { buildWatchUrl } from '../youtube/buildWatchUrl';

interface SourceInfoProps {
  clip: Clip;
}

export function SourceInfo({ clip }: SourceInfoProps) {
  return (
    <header className="source-info">
      <h2 className="source-info__title">{clip.title}</h2>
      <p className="source-info__meta">
        <span>{clip.channel}</span>
        <a href={buildWatchUrl(clip)} target="_blank" rel="noopener">
          Oryginał na YouTube ↗
        </a>
      </p>
    </header>
  );
}
