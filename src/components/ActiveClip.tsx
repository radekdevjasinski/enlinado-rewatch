import { useEffect } from 'react';
import { useYouTubePlayer } from '../hooks/useYouTubePlayer';
import type { Clip } from '../types/Clip';
import { getPlayerFrameClassName } from './playerFrameClassName';
import { PlayerError } from './PlayerError';
import { QuizPanel } from './QuizPanel';
import { Subtitles } from './Subtitles';

export interface ActiveClipProps {
  clip: Clip;
  shouldAutoplay: boolean;
  isTranslationVisible: boolean;
  onToggleTranslation: () => void;
  onPlaybackStarted: () => void;
  onCorrectAnswer: (answerKey: string) => void;
  onNext?: () => void;
}

export function ActiveClip(props: ActiveClipProps) {
  const { clip, onPlaybackStarted, onNext } = props;
  const { hostRef, status, errorCode, currentTime, play, replay } = useYouTubePlayer(clip, props.shouldAutoplay);
  const isPlayButtonVisible = status === 'ready' || status === 'paused';

  useEffect(() => {
    if (status === 'playing') onPlaybackStarted();
  }, [status, onPlaybackStarted]);

  return (
    <>
      <div ref={hostRef} className={getPlayerFrameClassName(clip.aspect)} />
      <div className="clip-details">
        {status === 'error' && <PlayerError clip={clip} errorCode={errorCode} onNext={onNext} />}
        {isPlayButtonVisible && (
          <button type="button" className="button button--primary play-button" onClick={play}>
            ▶ Odtwórz fragment
          </button>
        )}
        {status !== 'error' && (
          <Subtitles
            lines={clip.subtitles}
            currentTime={currentTime}
            isTranslationVisible={props.isTranslationVisible}
            onToggleTranslation={props.onToggleTranslation}
          />
        )}
        {status === 'ended' && (
          <QuizPanel
            questions={clip.quiz}
            onCorrectAnswer={(questionIndex) => props.onCorrectAnswer(`${clip.id}:${questionIndex}`)}
            onReplay={replay}
            onNext={onNext}
          />
        )}
      </div>
    </>
  );
}
