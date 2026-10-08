import type { DrawnQuestion } from '../types/DrawnQuestion';
import type { QuizQuestion } from '../types/QuizQuestion';
import { shuffle } from '../random/shuffle';
import { shuffleOptions } from './shuffleOptions';

export const QUESTIONS_PER_ATTEMPT = 3;

export function countAttemptQuestions(questions: QuizQuestion[]): number {
  return Math.min(questions.length, QUESTIONS_PER_ATTEMPT);
}

export function drawQuizQuestions(questions: QuizQuestion[]): DrawnQuestion[] {
  const indexedQuestions = questions.map((question, sourceIndex) => ({
    sourceIndex,
    question: shuffleOptions(question),
  }));
  return shuffle(indexedQuestions).slice(0, QUESTIONS_PER_ATTEMPT);
}
