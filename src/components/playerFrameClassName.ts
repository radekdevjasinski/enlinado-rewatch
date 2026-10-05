import type { ClipAspect } from '../types/ClipAspect';

export function getPlayerFrameClassName(aspect: ClipAspect): string {
  const modifier = aspect === '9:16' ? 'portrait' : 'landscape';
  return `player-frame player-frame--${modifier}`;
}
