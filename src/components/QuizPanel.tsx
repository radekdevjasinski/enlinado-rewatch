import { useState } from 'react';
import { drawQuizQuestions } from '../quiz/drawQuizQuestions';
import type { Phrase } from '../types/Phrase';
import type { QuizQuestion } from '../types/QuizQuestion';
import { QuizProgressDots } from './QuizProgressDots';
import { QuizQuestionView } from './QuizQuestionView';
import { QuizSummary } from './QuizSummary';

interface QuizPanelProps {
  questions: QuizQuestion[];
  phrases: Phrase[];
  onCorrectAnswer: (questionIndex: number) => void;
  onReplay: () => void;
  onNext?: () => void;
}

function getAdvanceLabel(isAnswered: boolean, isLastQuestion: boolean): string {
  if (!isAnswered) return 'Wybierz odpowiedź';
  return isLastQuestion ? 'Zobacz podsumowanie' : 'Następne pytanie';
}

export function QuizPanel({ questions, phrases, onCorrectAnswer, onReplay, onNext }: QuizPanelProps) {
  const [drawnQuestions] = useState(() => drawQuizQuestions(questions));
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const drawnQuestion = drawnQuestions.at(questionIndex);
  const questionCount = drawnQuestions.length;
  const isAnswered = selectedOption !== null;
  const isLastQuestion = questionIndex === questionCount - 1;

  if (!drawnQuestion) {
    return <QuizSummary score={score} questionCount={questionCount} phrases={phrases} onReplay={onReplay} onNext={onNext} />;
  }
  const { question, sourceIndex } = drawnQuestion;

  const selectOption = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    if (optionIndex !== question.correct) return;
    setScore(score + 1);
    onCorrectAnswer(sourceIndex);
  };

  const advance = () => {
    setQuestionIndex(questionIndex + 1);
    setSelectedOption(null);
  };

  return (
    <div className="quiz">
      <div className="quiz__header">
        <p className="eyebrow">
          Pytanie {questionIndex + 1}/{questionCount}
        </p>
        <QuizProgressDots questionCount={questionCount} currentIndex={questionIndex} isCurrentAnswered={isAnswered} />
      </div>
      <QuizQuestionView question={question} selectedOption={selectedOption} onSelect={selectOption} />
      <div className="quiz__actions">
        <button type="button" className="button button--primary" disabled={!isAnswered} onClick={advance}>
          {getAdvanceLabel(isAnswered, isLastQuestion)}
        </button>
      </div>
    </div>
  );
}
