import type { ClipVote } from './ClipVote';

export interface ClipFeedback {
  vote?: ClipVote;
  isReported?: boolean;
}
