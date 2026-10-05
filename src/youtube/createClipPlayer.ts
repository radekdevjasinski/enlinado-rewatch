import type { Clip } from '../types/Clip';

export interface ClipPlayerHandlers {
  onReady: () => void;
  onStateChange: (playerState: YT.PlayerState) => void;
  onError: (errorCode: number) => void;
}

export function createClipPlayer(
  api: typeof YT,
  mountPoint: HTMLElement,
  clip: Clip,
  handlers: ClipPlayerHandlers,
): YT.Player {
  return new api.Player(mountPoint, {
    videoId: clip.videoId,
    width: '100%',
    height: '100%',
    playerVars: {
      start: Math.floor(clip.start),
      end: Math.ceil(clip.end),
      playsinline: 1,
      origin: window.location.origin,
      rel: 0,
    },
    events: {
      onReady: handlers.onReady,
      onStateChange: (event) => handlers.onStateChange(event.data),
      onError: (event) => handlers.onError(event.data),
    },
  });
}
