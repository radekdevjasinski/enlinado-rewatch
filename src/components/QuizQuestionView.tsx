import type { QuizQuestion } from '../types/QuizQuestion';

const OPTION_LETTERS = 'ABCDEF';

interface QuizQuestionViewProps {
  question: QuizQuestion;
  selectedOption: number | null;
  onSelect: (optionIndex: number) => void;
}

function getOptionClassName(question: QuizQuestion, selectedOption: number | null, optionIndex: number): string {
  if (selectedOption === null) return 'quiz-option';
  if (optionIndex === question.correct) return 'quiz-option quiz-option--correct';
  if (optionIndex === selectedOption) return 'quiz-option quiz-option--wrong';
  return 'quiz-option quiz-option--dimmed';
}

export function QuizQuestionView({ question, selectedOption, onSelect }: QuizQuestionViewProps) {
  const isAnswered = selectedOption !== null;
  const isCorrect = selectedOption === question.correct;

  return (
    <div className="quiz-question">
      <h3 className="quiz-question__text">{question.question}</h3>
      <ul className="quiz-options">
        {question.options.map((option, optionIndex) => (
          <li key={option}>
            <button
              type="button"
              className={getOptionClassName(question, selectedOption, optionIndex)}
              disabled={isAnswered}
              onClick={() => onSelect(optionIndex)}
            >
              <span className="quiz-option__letter">{OPTION_LETTERS[optionIndex]}</span>
              {option}
            </button>
          </li>
        ))}
      </ul>
      {isAnswered && (
        <div className={isCorrect ? 'quiz-feedback quiz-feedback--correct' : 'quiz-feedback quiz-feedback--wrong'} role="status">
          <strong>{isCorrect ? 'Dobrze!' : 'Nie tym razem'}</strong>
          <p>{question.explanation}</p>
        </div>
      )}
    </div>
  );
}
