import { formatStreakDays } from './formatStreakDays';

interface StreakLabelProps {
  days: number;
}

export function StreakLabel({ days }: StreakLabelProps) {
  return (
    <p className="streak-label" title="Seria dni – wkrótce">
      Seria <strong>{formatStreakDays(days)}</strong>
    </p>
  );
}
