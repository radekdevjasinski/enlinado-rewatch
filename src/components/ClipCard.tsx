import type { Clip } from '../types/Clip';
import { ActiveClip, type ActiveClipProps } from './ActiveClip';
import { ClipThumbnail } from './ClipThumbnail';
import { SourceInfo } from './SourceInfo';

interface ClipCardProps {
  clip: Clip;
  isActive: boolean;
  playback: Omit<ActiveClipProps, 'clip'>;
}

export function ClipCard({ clip, isActive, playback }: ClipCardProps) {
  return (
    <article className="clip-card">
      <SourceInfo clip={clip} />
      {isActive ? <ActiveClip clip={clip} {...playback} /> : <ClipThumbnail clip={clip} />}
    </article>
  );
}
