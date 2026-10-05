import { useState } from 'react';
import type { QuizQuestion } from '../types/QuizQuestion';
import { QuizQuestionView } from './QuizQuestionView';

interface QuizPanelProps {
  questions: QuizQuestion[];
  onCorrectAnswer: (questionIndex: number) => void;
  onReplay: () => void;
  onNext?: () => void;
}

export function QuizPanel({ questions, onCorrectAnswer, onReplay, onNext }: QuizPanelProps) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const question = questions.at(questionIndex);
  const hasNextQuestion = selectedOption !== null && questionIndex < questions.length - 1;

  const selectOption = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    if (optionIndex === question?.correct) onCorrectAnswer(questionIndex);
  };

  const showNextQuestion = () => {
    setQuestionIndex(questionIndex + 1);
    setSelectedOption(null);
  };

  return (
    <aside className="quiz-panel">
      <p className="quiz-panel__progress">
        Quiz {questions.length > 0 && `${questionIndex + 1}/${questions.length}`}
      </p>
      {question ? (
        <QuizQuestionView question={question} selectedOption={selectedOption} onSelect={selectOption} />
      ) : (
        <p className="placeholder">Quiz do uzupełnienia w clips.json.</p>
      )}
      {hasNextQuestion && (
        <button type="button" className="button button--primary" onClick={showNextQuestion}>
          Następne pytanie
        </button>
      )}
      <div className="quiz-panel__actions">
        <button type="button" className="button" onClick={onReplay}>
          Obejrzyj ponownie
        </button>
        {onNext && (
          <button type="button" className="button button--primary" onClick={onNext}>
            Następny klip
          </button>
        )}
      </div>
    </aside>
  );
}
