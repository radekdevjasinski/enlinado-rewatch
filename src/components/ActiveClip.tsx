import { useEffect, useEffectEvent, useState } from 'react';
import { useYouTubePlayer } from '../hooks/useYouTubePlayer';
import { findCurrentLineIndex } from '../subtitles/findCurrentLineIndex';
import type { Clip } from '../types/Clip';
import type { ClipPhase } from '../types/ClipPhase';
import { ClipNavigation } from './ClipNavigation';
import { ClipStudy } from './ClipStudy';
import { formatQuestionCount } from './formatQuestionCount';
import { FragmentSlider } from './FragmentSlider';
import { ListeningPrompt } from './ListeningPrompt';
import { PhaseStepper } from './PhaseStepper';
import { getPlayerFrameClassName } from './playerFrameClassName';
import { PlaybackControls } from './PlaybackControls';
import { PlayerError } from './PlayerError';
import { QuizPanel } from './QuizPanel';
import { QuizSheet } from './QuizSheet';
import { SourceMeta } from './SourceMeta';
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
  const [phase, setPhase] = useState<ClipPhase>('listening');
  const [quizAttempt, setQuizAttempt] = useState(0);
  const { status, currentTime } = player;
  const hasError = status === 'error';
  const isQuizOpen = phase === 'quiz';
  const phrases = clip.phrases ?? [];
  const activeLineIndex = findCurrentLineIndex(clip.subtitles, currentTime);

  const openQuiz = () => {
    player.pause();
    setPhase('quiz');
  };
  const showSubtitles = () => setPhase('reading');
  const restartWithoutSubtitles = () => {
    setPhase('listening');
    player.replay();
  };
  const replay = () => {
    setPhase('reading');
    setQuizAttempt(quizAttempt + 1);
    player.replay();
  };

  const selectPhase = (selectedPhase: ClipPhase) => {
    if (selectedPhase === phase) return;
    if (selectedPhase === 'listening') restartWithoutSubtitles();
    if (selectedPhase === 'reading') showSubtitles();
    if (selectedPhase === 'quiz') openQuiz();
  };

  const togglePlayback = () => {
    if (status === 'playing') player.pause();
    else if (status === 'ended') player.replay();
    else player.play();
  };

  const seekWithinFragment = (seconds: number) => {
    if (seconds >= clip.end) player.finish();
    else player.seekTo(seconds);
  };

  const advanceAfterFragmentEnd = useEffectEvent(() => {
    if (phase === 'listening') {
      setPhase('reading');
      player.replay();
    }
    if (phase === 'reading') setPhase('quiz');
  });

  useEffect(() => {
    if (status === 'playing') onPlaybackStarted();
    if (status === 'ended') advanceAfterFragmentEnd();
  }, [status, onPlaybackStarted]);

  return (
    <>
      <div className="player-area">
        <div ref={player.hostRef} className={getPlayerFrameClassName(clip.aspect)} />
        <FragmentSlider
          start={clip.start}
          end={clip.end}
          currentTime={currentTime}
          isDisabled={status === 'loading' || hasError}
          onSeek={seekWithinFragment}
        />
      </div>
      <div className="clip-body">
        <div className="clip-info">
          {!hasError && phase === 'listening' && (
            <p className="subtitle-box subtitle-box--concealed">Napisy są ukryte na tym etapie.</p>
          )}
          {!hasError && phase !== 'listening' && (
            <SubtitleBox
              line={clip.subtitles[activeLineIndex]}
              phrases={phrases}
              isTranslationVisible={props.isTranslationVisible}
            />
          )}
          {!hasError && (
            <PlaybackControls
              isPlaying={status === 'playing'}
              isDisabled={status === 'loading'}
              onRestart={player.replay}
              onToggle={togglePlayback}
              onFinish={player.finish}
            />
          )}
          <div className="source-info">
            <SourceMeta clip={clip} />
          </div>
        </div>
        {hasError && (
          <div className="clip-side">
            <div className="clip-study">
              <PlayerError clip={clip} errorCode={player.errorCode} onNext={onNext} />
            </div>
          </div>
        )}
        {!hasError && (
          <div className="clip-side">
            <PhaseStepper currentPhase={phase} onSelect={selectPhase} />
            {phase === 'listening' ? (
              <ListeningPrompt isHidden={isQuizOpen} onShowSubtitles={showSubtitles} />
            ) : (
              <ClipStudy
                clip={clip}
                activeLineIndex={activeLineIndex}
                isHidden={isQuizOpen}
                isTranslationVisible={props.isTranslationVisible}
                onToggleTranslation={props.onToggleTranslation}
                onSeek={player.seekTo}
                onOpenQuiz={openQuiz}
              />
            )}
            <QuizSheet
              isOpen={isQuizOpen}
              label={`Quiz · ${formatQuestionCount(clip.quiz.length)}`}
              onOpen={openQuiz}
              onClose={showSubtitles}
            >
              <QuizPanel
                key={quizAttempt}
                questions={clip.quiz}
                phrases={phrases}
                onCorrectAnswer={(questionIndex) => props.onCorrectAnswer(`${clip.id}:${questionIndex}`)}
                onClose={showSubtitles}
                onReplay={replay}
                onNext={onNext}
              />
            </QuizSheet>
          </div>
        )}
        <ClipNavigation onPrevious={props.onPrevious} onNext={onNext} />
      </div>
    </>
  );
}
