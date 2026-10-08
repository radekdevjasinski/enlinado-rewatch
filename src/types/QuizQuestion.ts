import type { QuizQuestionType } from './QuizQuestionType';

export interface QuizQuestion {
  type: QuizQuestionType;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}
