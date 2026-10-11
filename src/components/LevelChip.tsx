import type { ClipLevel } from '../types/ClipLevel';
import { formatClipLevel } from './formatClipLevel';

interface LevelChipProps {
  level: ClipLevel;
}

export function LevelChip({ level }: LevelChipProps) {
  return <span className="level-chip">{formatClipLevel(level)}</span>;
}
