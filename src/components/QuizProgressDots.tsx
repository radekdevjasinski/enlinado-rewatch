interface QuizProgressDotsProps {
  questionCount: number;
  currentIndex: number;
  isCurrentAnswered: boolean;
}

export function QuizProgressDots({ questionCount, currentIndex, isCurrentAnswered }: QuizProgressDotsProps) {
  const getDotClassName = (dotIndex: number) => {
    const isDone = dotIndex < currentIndex || (dotIndex === currentIndex && isCurrentAnswered);
    if (isDone) return 'quiz-dot quiz-dot--done';
    return dotIndex === currentIndex ? 'quiz-dot quiz-dot--current' : 'quiz-dot';
  };

  return (
    <div className="quiz-dots" aria-hidden="true">
      {Array.from({ length: questionCount }, (_, dotIndex) => (
        <span key={dotIndex} className={getDotClassName(dotIndex)} />
      ))}
    </div>
  );
}
