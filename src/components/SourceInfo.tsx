import type { Clip } from '../types/Clip';
import { SourceMeta } from './SourceMeta';

interface SourceInfoProps {
  clip: Clip;
}

export function SourceInfo({ clip }: SourceInfoProps) {
  return (
    <header className="source-info">
      <h2 className="source-info__title">{clip.title}</h2>
      <SourceMeta clip={clip} />
    </header>
  );
}
