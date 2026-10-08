interface LevelBadgeProps {
  level: string;
}

export function LevelBadge({ level }: LevelBadgeProps) {
  return (
    <p className="level-badge" title="Poziom klipu – wkrótce">
      Poziom {level}
    </p>
  );
}
