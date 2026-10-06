import { useEffect, useState } from 'react';
import { useYouTubePlayer } from '../hooks/useYouTubePlayer';
import { findCurrentLineIndex } from '../subtitles/findCurrentLineIndex';
import type { Clip } from '../types/Clip';
import { ClipNavigation } from './ClipNavigation';
import { ClipStudy } from './ClipStudy';
import { formatQuestionCount } from './formatQuestionCount';
import { getPlayerFrameClassName } from './playerFrameClassName';
import { PlayerError } from './PlayerError';
import { ProgressBar } from './ProgressBar';
import { QuizPanel } from './QuizPanel';
import { QuizSheet } from './QuizSheet';
import { SourceInfo } from './SourceInfo';
import { SubtitleBox } from './SubtitleBox';

export interface ActiveClipProps {
  clip: Clip;
  shouldAutoplay: boolean;
  isTranslationVisible: boolean;
  onToggleTranslation: () => void;
  onPlaybackStarted: () => void;
  onCorrectAnswer: (answerKey: string) => void;
  onPrevious?: () => void;
  onNext?: () => void;
}

export function ActiveClip(props: ActiveClipProps) {
  const { clip, onPlaybackStarted, onNext } = props;
  const player = useYouTubePlayer(clip, props.shouldAutoplay);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [quizAttempt, setQuizAttempt] = useState(0);
  const { status, currentTime } = player;
  const hasError = status === 'error';
  const phrases = clip.phrases ?? [];
  const activeLineIndex = findCurrentLineIndex(clip.subtitles, currentTime);

  useEffect(() => {
    if (status === 'playing') onPlaybackStarted();
    if (status === 'ended') setIsQuizOpen(true);
  }, [status, onPlaybackStarted]);

  const openQuiz = () => {
    player.pause();
    setIsQuizOpen(true);
  };
  const closeQuiz = () => setIsQuizOpen(false);
  const replay = () => {
    setIsQuizOpen(false);
    setQuizAttempt(quizAttempt + 1);
    player.replay();
  };

  return (
    <>
      <div className="player-area">
        <div ref={player.hostRef} className={getPlayerFrameClassName(clip.aspect)} />
        <ProgressBar fraction={(currentTime - clip.start) / (clip.end - clip.start)} />
      </div>
      <div className="clip-body">
        <div className="clip-info">
          {(status === 'ready' || status === 'paused') && (
            <button type="button" className="button button--primary play-button" onClick={player.play}>
              ▶ Odtwórz fragment
            </button>
          )}
          <div className="clip-info__heading">
            <SourceInfo clip={clip} />
            <ClipNavigation onPrevious={props.onPrevious} onNext={onNext} />
          </div>
          {!hasError && (
            <SubtitleBox
              line={clip.subtitles[activeLineIndex]}
              phrases={phrases}
              isTranslationVisible={props.isTranslationVisible}
            />
          )}
        </div>
        {hasError && (
          <div className="clip-study">
            <PlayerError clip={clip} errorCode={player.errorCode} onNext={onNext} />
          </div>
        )}
        {!hasError && (
          <>
            <ClipStudy
              clip={clip}
              activeLineIndex={activeLineIndex}
              isHidden={isQuizOpen}
              isTranslationVisible={props.isTranslationVisible}
              onToggleTranslation={props.onToggleTranslation}
              onSeek={player.seekTo}
              onOpenQuiz={openQuiz}
            />
            <QuizSheet
              isOpen={isQuizOpen}
              label={`Quiz · ${formatQuestionCount(clip.quiz.length)}`}
              onOpen={openQuiz}
              onClose={closeQuiz}
            >
              <QuizPanel
                key={quizAttempt}
                questions={clip.quiz}
                phrases={phrases}
                onCorrectAnswer={(questionIndex) => props.onCorrectAnswer(`${clip.id}:${questionIndex}`)}
                onClose={closeQuiz}
                onReplay={replay}
                onNext={onNext}
              />
            </QuizSheet>
          </>
        )}
      </div>
    </>
  );
}
