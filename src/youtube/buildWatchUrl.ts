import type { Clip } from '../types/Clip';

export function buildWatchUrl(clip: Clip): string {
  return `https://www.youtube.com/watch?v=${clip.videoId}&t=${clip.start}s`;
}

export function buildThumbnailUrl(clip: Clip): string {
  return `https://i.ytimg.com/vi/${clip.videoId}/hqdefault.jpg`;
}
