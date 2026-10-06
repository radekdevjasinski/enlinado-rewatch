import { useCallback, useEffect, useRef, useState } from 'react';
import type { Clip } from '../types/Clip';
import type { PlayerStatus } from '../types/PlayerStatus';
import { createClipPlayer } from '../youtube/createClipPlayer';
import { loadYouTubeApi } from '../youtube/loadYouTubeApi';
import { useCurrentTime } from './useCurrentTime';

function resolveStatus(previous: PlayerStatus, playerState: YT.PlayerState): PlayerStatus {
  if (playerState === YT.PlayerState.PLAYING) return 'playing';
  if (playerState === YT.PlayerState.ENDED) return 'ended';
  if (playerState === YT.PlayerState.PAUSED && previous === 'playing') return 'paused';
  return previous;
}

export function useYouTubePlayer(clip: Clip, shouldAutoplay: boolean) {
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YT.Player | null>(null);
  const shouldAutoplayRef = useRef(shouldAutoplay);
  const hasEnteredFragmentRef = useRef(false);
  const [status, setStatus] = useState<PlayerStatus>('loading');
  const [errorCode, setErrorCode] = useState<number | null>(null);
  const currentTime = useCurrentTime(playerRef, status === 'playing');

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let isCancelled = false;
    const mountPoint = document.createElement('div');
    host.append(mountPoint);

    const handlers = {
      onReady: () => {
        setStatus((previous) => (previous === 'loading' ? 'ready' : previous));
        if (shouldAutoplayRef.current) playerRef.current?.playVideo();
      },
      onStateChange: (playerState: YT.PlayerState) =>
        setStatus((previous) => resolveStatus(previous, playerState)),
      onError: (code: number) => {
        setErrorCode(code);
        setStatus('error');
      },
    };

    loadYouTubeApi()
      .then((api) => {
        if (!isCancelled) playerRef.current = createClipPlayer(api, mountPoint, clip, handlers);
      })
      .catch(() => setStatus('error'));

    return () => {
      isCancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
      host.replaceChildren();
    };
  }, [clip]);

  useEffect(() => {
    if (status !== 'playing') return;
    if (currentTime < clip.end) {
      hasEnteredFragmentRef.current = true;
      return;
    }
    if (!hasEnteredFragmentRef.current) return;
    playerRef.current?.pauseVideo();
    setStatus('ended');
  }, [currentTime, status, clip.end]);

  const play = useCallback(() => playerRef.current?.playVideo(), []);
  const pause = useCallback(() => playerRef.current?.pauseVideo(), []);

  const seekTo = useCallback((seconds: number) => {
    hasEnteredFragmentRef.current = false;
    playerRef.current?.seekTo(seconds, true);
    playerRef.current?.playVideo();
  }, []);

  const replay = useCallback(() => seekTo(clip.start), [clip.start, seekTo]);

  return { hostRef, status, errorCode, currentTime, play, pause, seekTo, replay };
}
