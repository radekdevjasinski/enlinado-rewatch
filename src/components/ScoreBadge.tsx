interface ScoreBadgeProps {
  correctCount: number;
}

export function ScoreBadge({ correctCount }: ScoreBadgeProps) {
  return (
    <p className="score-badge" aria-label={`Poprawne odpowiedzi: ${correctCount}`}>
      ✓ {correctCount}
    </p>
  );
}
