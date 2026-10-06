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
  if (isActive) {
    return (
      <article className="clip-card">
        <ActiveClip clip={clip} {...playback} />
      </article>
    );
  }

  return (
    <article className="clip-card">
      <div className="player-area">
        <ClipThumbnail clip={clip} />
      </div>
      <div className="clip-body">
        <div className="clip-info">
          <SourceInfo clip={clip} />
        </div>
      </div>
    </article>
  );
}
