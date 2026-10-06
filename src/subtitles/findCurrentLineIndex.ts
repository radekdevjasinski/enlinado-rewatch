import type { SubtitleLine } from '../types/SubtitleLine';

export function findCurrentLineIndex(lines: SubtitleLine[], currentTime: number): number {
  const startedLineIndex = lines.findLastIndex((line) => currentTime >= line.from);
  return Math.max(startedLineIndex, 0);
}
