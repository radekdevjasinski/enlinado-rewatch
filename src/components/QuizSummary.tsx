import type { Phrase } from '../types/Phrase';

interface QuizSummaryProps {
  score: number;
  questionCount: number;
  phrases: Phrase[];
  onReplay: () => void;
  onNext?: () => void;
}

function describeScore(score: number, questionCount: number): string {
  if (questionCount === 0) return 'Quiz do uzupełnienia';
  if (score === questionCount) return 'Perfekcyjnie!';
  if (score * 2 >= questionCount) return 'Dobra robota!';
  return 'Spróbuj jeszcze raz';
}

export function QuizSummary({ score, questionCount, phrases, onReplay, onNext }: QuizSummaryProps) {
  return (
    <div className="quiz">
      <div className="quiz-summary__result">
        <div className="quiz-summary__score">
          {score}/{questionCount}
        </div>
        <div>
          <h3 className="quiz-summary__title">{describeScore(score, questionCount)}</h3>
          <p className="quiz-summary__points">+{score} pkt</p>
        </div>
      </div>
      {phrases.length > 0 && (
        <>
          <h4 className="eyebrow">Zwroty z klipu</h4>
          <dl className="phrase-list">
            {phrases.map((phrase) => (
              <div key={phrase.en} className="phrase-list__row">
                <dt lang="en">{phrase.en}</dt>
                <dd>{phrase.pl}</dd>
              </div>
            ))}
          </dl>
        </>
      )}
      <div className="quiz__actions">
        <button type="button" className="button button--secondary" onClick={onReplay}>
          Obejrzyj ponownie
        </button>
        {onNext && (
          <button type="button" className="button button--primary" onClick={onNext}>
            Następny klip
          </button>
        )}
      </div>
    </div>
  );
}
