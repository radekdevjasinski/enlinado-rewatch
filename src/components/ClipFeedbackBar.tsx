import type { ClipVote } from '../types/ClipVote';
import { FlagIcon } from './FlagIcon';
import { ThumbIcon } from './ThumbIcon';

interface ClipFeedbackBarProps {
  vote?: ClipVote;
  isReported: boolean;
  onVote: (vote: ClipVote) => void;
  onOpenReport: () => void;
}

export function ClipFeedbackBar({ vote, isReported, onVote, onOpenReport }: ClipFeedbackBarProps) {
  return (
    <div className="clip-feedback">
      <button
        type="button"
        className="clip-feedback__button clip-feedback__button--like"
        title="Podoba mi się"
        aria-label="Podoba mi się"
        aria-pressed={vote === 'like'}
        onClick={() => onVote('like')}
      >
        <ThumbIcon />
      </button>
      <span className="clip-feedback__divider" />
      <button
        type="button"
        className="clip-feedback__button clip-feedback__button--dislike"
        title="Nie podoba mi się"
        aria-label="Nie podoba mi się"
        aria-pressed={vote === 'dislike'}
        onClick={() => onVote('dislike')}
      >
        <ThumbIcon />
      </button>
      <span className="clip-feedback__divider" />
      <button
        type="button"
        className={
          isReported
            ? 'clip-feedback__button clip-feedback__button--report clip-feedback__button--reported'
            : 'clip-feedback__button clip-feedback__button--report'
        }
        title="Zgłoś"
        aria-label="Zgłoś klip"
        onClick={onOpenReport}
      >
        <FlagIcon />
      </button>
    </div>
  );
}
