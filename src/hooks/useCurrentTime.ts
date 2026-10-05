import { useEffect, useState, type RefObject } from 'react';

const POLL_INTERVAL_MS = 200;

export function useCurrentTime(playerRef: RefObject<YT.Player | null>, isPolling: boolean): number {
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (!isPolling) return;
    const intervalId = window.setInterval(() => {
      const player = playerRef.current;
      if (player) setCurrentTime(player.getCurrentTime());
    }, POLL_INTERVAL_MS);
    return () => window.clearInterval(intervalId);
  }, [isPolling, playerRef]);

  return currentTime;
}
