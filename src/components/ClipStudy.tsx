import type { Clip } from '../types/Clip';
import { formatQuestionCount } from './formatQuestionCount';
import { PhraseOfClip } from './PhraseOfClip';
import { Transcript } from './Transcript';

interface ClipStudyProps {
  clip: Clip;
  activeLineIndex: number;
  isHidden: boolean;
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
      <PhraseOfClip phrase={phrases[0]} />
      <Transcript
        lines={clip.subtitles}
        phrases={phrases}
        activeIndex={props.activeLineIndex}
        isTranslationVisible={props.isTranslationVisible}
        onToggleTranslation={props.onToggleTranslation}
        onSeek={props.onSeek}
      />
      <button type="button" className="button button--primary clip-study__quiz-button" onClick={props.onOpenQuiz}>
        Rozwiąż quiz · {formatQuestionCount(clip.quiz.length)}
      </button>
    </div>
  );
}
