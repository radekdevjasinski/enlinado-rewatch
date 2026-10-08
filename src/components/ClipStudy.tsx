import { countAttemptQuestions } from '../quiz/drawQuizQuestions';
import type { Clip } from '../types/Clip';
import { formatQuestionCount } from './formatQuestionCount';
import { Transcript } from './Transcript';

interface ClipStudyProps {
  clip: Clip;
  activeLineIndex: number;
  isHidden: boolean;
  isTranscriptConcealed: boolean;
  isTranslationVisible: boolean;
  onToggleTranslation: () => void;
  onSeek: (seconds: number) => void;
  onOpenQuiz: () => void;
}

export function ClipStudy(props: ClipStudyProps) {
  const { clip } = props;
  const phrases = clip.phrases ?? [];

  return (
    <div className="clip-study" inert={props.isHidden}>
      <Transcript
        lines={clip.subtitles}
        phrases={phrases}
        fragmentStart={clip.start}
        activeIndex={props.activeLineIndex}
        isConcealed={props.isTranscriptConcealed}
        isTranslationVisible={props.isTranslationVisible}
        onToggleTranslation={props.onToggleTranslation}
        onSeek={props.onSeek}
      />
      <button type="button" className="button button--primary clip-study__quiz-button" onClick={props.onOpenQuiz}>
        Rozwiąż quiz · {formatQuestionCount(countAttemptQuestions(clip.quiz))}
      </button>
    </div>
  );
}
