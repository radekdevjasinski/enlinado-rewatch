import { useState } from 'react';
import type { ClipFeedback } from '../types/ClipFeedback';
import type { ClipVote } from '../types/ClipVote';

const STORAGE_KEY = 'enlinadotok.clipFeedback';

function readStoredFeedback(): Record<string, ClipFeedback> {
  const storedValue = localStorage.getItem(STORAGE_KEY);
  if (!storedValue) return {};
  try {
    const parsed: unknown = JSON.parse(storedValue);
    const isRecord = typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed);
    return isRecord ? (parsed as Record<string, ClipFeedback>) : {};
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return {};
  }
}

export function useClipFeedback(clipId: string) {
  const [feedback, setFeedback] = useState<ClipFeedback>(() => readStoredFeedback()[clipId] ?? {});

  const storeFeedback = (updatedFeedback: ClipFeedback) => {
    setFeedback(updatedFeedback);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...readStoredFeedback(), [clipId]: updatedFeedback }));
  };

  const toggleVote = (vote: ClipVote) => {
    storeFeedback({ ...feedback, vote: feedback.vote === vote ? undefined : vote });
  };
  const markReported = () => storeFeedback({ ...feedback, isReported: true });

  return { vote: feedback.vote, isReported: feedback.isReported === true, toggleVote, markReported };
}
