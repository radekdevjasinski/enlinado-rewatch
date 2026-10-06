import type { Clip } from '../types/Clip';
import { buildWatchUrl } from '../youtube/buildWatchUrl';

interface SourceMetaProps {
  clip: Clip;
}

export function SourceMeta({ clip }: SourceMetaProps) {
  return (
    <p className="source-info__meta">
      <span>{clip.channel}</span>
      <a href={buildWatchUrl(clip)} target="_blank" rel="noopener">
        Oryginał na YouTube ↗
      </a>
    </p>
  );
}
