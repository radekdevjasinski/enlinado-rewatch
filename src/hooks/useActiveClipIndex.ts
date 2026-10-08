import { useEffect, useState, type RefObject } from 'react';

const ACTIVE_VISIBILITY_THRESHOLD = 0.6;

export function useActiveClipIndex(feedRef: RefObject<HTMLElement | null>, cardCount: number): number {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const feed = feedRef.current;
    if (!feed) return;
    const cards = Array.from(feed.children);
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting);
        if (visibleEntry) setActiveIndex(cards.indexOf(visibleEntry.target));
      },
      { root: feed, threshold: ACTIVE_VISIBILITY_THRESHOLD },
    );
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [feedRef, cardCount]);

  return activeIndex;
}
