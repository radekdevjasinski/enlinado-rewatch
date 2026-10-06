import { useState } from 'react';
import type { Phrase } from '../types/Phrase';
import type { QuizQuestion } from '../types/QuizQuestion';
import { QuizProgressDots } from './QuizProgressDots';
import { QuizQuestionView } from './QuizQuestionView';
import { QuizSummary } from './QuizSummary';

interface QuizPanelProps {
  questions: QuizQuestion[];
  phrases: Phrase[];
  onCorrectAnswer: (questionIndex: number) => void;
  onClose: () => void;
  onReplay: () => void;
  onNext?: () => void;
}

function getAdvanceLabel(isAnswered: boolean, isLastQuestion: boolean): string {
  if (!isAnswered) return 'Wybierz odpowiedź';
  return isLastQuestion ? 'Zobacz podsumowanie' : 'Następne pytanie';
}

export function QuizPanel({ questions, phrases, onCorrectAnswer, onClose, onReplay, onNext }: QuizPanelProps) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const question = questions.at(questionIndex);
  const isAnswered = selectedOption !== null;
  const isLastQuestion = questionIndex === questions.length - 1;

  if (!question) {
    return <QuizSummary score={score} questionCount={questions.length} phrases={phrases} onReplay={onReplay} onNext={onNext} />;
  }

  const selectOption = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    if (optionIndex !== question.correct) return;
    setScore(score + 1);
    onCorrectAnswer(questionIndex);
  };

  const advance = () => {
    setQuestionIndex(questionIndex + 1);
    setSelectedOption(null);
  };

  return (
    <div className="quiz">
      <div className="quiz__header">
        <p className="eyebrow">
          Pytanie {questionIndex + 1}/{questions.length}
        </p>
        <QuizProgressDots questionCount={questions.length} currentIndex={questionIndex} isCurrentAnswered={isAnswered} />
      </div>
      <QuizQuestionView question={question} selectedOption={selectedOption} onSelect={selectOption} />
      <div className="quiz__actions">
        <button type="button" className="button button--secondary quiz__back-button" onClick={onClose}>
          Do klipu
        </button>
        <button type="button" className="button button--primary" disabled={!isAnswered} onClick={advance}>
          {getAdvanceLabel(isAnswered, isLastQuestion)}
        </button>
      </div>
    </div>
  );
}
