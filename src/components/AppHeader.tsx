import { PLACEHOLDER_PROFILE } from '../profile/placeholderProfile';
import { Logo } from './Logo';
import { ProfileAvatar } from './ProfileAvatar';
import { ScoreBadge } from './ScoreBadge';
import { StreakLabel } from './StreakLabel';

interface AppHeaderProps {
  correctCount: number;
}

export function AppHeader({ correctCount }: AppHeaderProps) {
  return (
    <header className="app-header">
      <Logo />
      <div className="app-header__status">
        <StreakLabel days={PLACEHOLDER_PROFILE.streakDays} />
        <ScoreBadge correctCount={correctCount} />
        <ProfileAvatar initial={PLACEHOLDER_PROFILE.initial} />
      </div>
    </header>
  );
}
