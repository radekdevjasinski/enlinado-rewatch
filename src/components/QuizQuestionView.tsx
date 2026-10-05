import type { QuizQuestion } from '../types/QuizQuestion';

interface QuizQuestionViewProps {
  question: QuizQuestion;
  selectedOption: number | null;
  onSelect: (optionIndex: number) => void;
}

function getOptionClassName(question: QuizQuestion, selectedOption: number | null, optionIndex: number): string {
  if (selectedOption === null) return 'quiz-option';
  if (optionIndex === question.correct) return 'quiz-option quiz-option--correct';
  if (optionIndex === selectedOption) return 'quiz-option quiz-option--wrong';
  return 'quiz-option';
}

export function QuizQuestionView({ question, selectedOption, onSelect }: QuizQuestionViewProps) {
  const isAnswered = selectedOption !== null;

  return (
    <div className="quiz-question">
      <h3>{question.question}</h3>
      <ul className="quiz-options">
        {question.options.map((option, optionIndex) => (
          <li key={option}>
            <button
              type="button"
              className={getOptionClassName(question, selectedOption, optionIndex)}
              disabled={isAnswered}
              onClick={() => onSelect(optionIndex)}
            >
              {option}
            </button>
          </li>
        ))}
      </ul>
      {isAnswered && (
        <p className="quiz-feedback" role="status">
          <strong>{selectedOption === question.correct ? 'Dobrze!' : 'Nie tym razem.'}</strong>{' '}
          {question.explanation}
        </p>
      )}
    </div>
  );
}
