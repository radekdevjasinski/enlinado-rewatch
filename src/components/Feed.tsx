import { useCallback, useRef, useState } from 'react';
import { useActiveClipIndex } from '../hooks/useActiveClipIndex';
import { useArrowNavigation } from '../hooks/useArrowNavigation';
import type { Clip } from '../types/Clip';
import { ClipCard } from './ClipCard';

interface FeedProps {
  clips: Clip[];
  onCorrectAnswer: (answerKey: string) => void;
}

export function Feed({ clips, onCorrectAnswer }: FeedProps) {
  const feedRef = useRef<HTMLDivElement>(null);
  const activeIndex = useActiveClipIndex(feedRef);
  const [hasPlaybackStarted, setHasPlaybackStarted] = useState(false);
  const [isTranslationVisible, setIsTranslationVisible] = useState(true);

  const scrollToClip = useCallback((clipIndex: number) => {
    feedRef.current?.children[clipIndex]?.scrollIntoView({ behavior: 'smooth' });
  }, []);
  const navigateByOffset = useCallback(
    (offset: number) => scrollToClip(activeIndex + offset),
    [activeIndex, scrollToClip],
  );
  const markPlaybackStarted = useCallback(() => setHasPlaybackStarted(true), []);
  const toggleTranslation = useCallback(() => setIsTranslationVisible((isVisible) => !isVisible), []);

  useArrowNavigation(navigateByOffset);

  return (
    <main ref={feedRef} className="feed">
      {clips.map((clip, clipIndex) => (
        <ClipCard
          key={clip.id}
          clip={clip}
          isActive={clipIndex === activeIndex}
          playback={{
            shouldAutoplay: hasPlaybackStarted,
            isTranslationVisible,
            onToggleTranslation: toggleTranslation,
            onPlaybackStarted: markPlaybackStarted,
            onCorrectAnswer,
            onPrevious: clipIndex > 0 ? () => scrollToClip(clipIndex - 1) : undefined,
            onNext: clipIndex < clips.length - 1 ? () => scrollToClip(clipIndex + 1) : undefined,
          }}
        />
      ))}
    </main>
  );
}
