import { Logo } from './Logo';
import { ScoreBadge } from './ScoreBadge';

interface AppHeaderProps {
  correctCount: number;
}

export function AppHeader({ correctCount }: AppHeaderProps) {
  return (
    <header className="app-header">
      <Logo />
      <ScoreBadge correctCount={correctCount} />
    </header>
  );
}
