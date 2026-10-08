import type { QuizQuestion } from '../types/QuizQuestion';
import { shuffle } from '../random/shuffle';

export function shuffleOptions(question: QuizQuestion): QuizQuestion {
  if (question.type === 'true_false') return question;
  const optionOrder = shuffle(question.options.map((_, optionIndex) => optionIndex));

  return {
    ...question,
    options: optionOrder.map((optionIndex) => question.options[optionIndex]),
    correct: optionOrder.indexOf(question.correct),
  };
}
