import type { Clip } from '../types/Clip';
import { buildThumbnailUrl } from '../youtube/buildWatchUrl';
import { getPlayerFrameClassName } from './playerFrameClassName';

interface ClipThumbnailProps {
  clip: Clip;
}

export function ClipThumbnail({ clip }: ClipThumbnailProps) {
  return (
    <div className={getPlayerFrameClassName(clip.aspect)}>
      <img src={buildThumbnailUrl(clip)} alt={`Miniatura: ${clip.title}`} loading="lazy" />
    </div>
  );
}
