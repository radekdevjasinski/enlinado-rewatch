import type { Clip } from '../types/Clip';
import { buildWatchUrl } from '../youtube/buildWatchUrl';
import { LevelChip } from './LevelChip';

interface SourceMetaProps {
  clip: Clip;
}

export function SourceMeta({ clip }: SourceMetaProps) {
  return (
    <p className="source-info__meta">
      <LevelChip level={clip.level} />
      <a
        className="channel-badge"
        href={buildWatchUrl(clip)}
        target="_blank"
        rel="noopener"
        title="Otwórz oryginał na YouTube"
      >
        {clip.channel} ↗
      </a>
    </p>
  );
}
