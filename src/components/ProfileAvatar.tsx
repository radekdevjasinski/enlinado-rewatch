interface ProfileAvatarProps {
  initial: string;
}

export function ProfileAvatar({ initial }: ProfileAvatarProps) {
  return (
    <button type="button" className="profile-avatar" disabled title="Konto – wkrótce" aria-label="Konto (wkrótce)">
      {initial}
    </button>
  );
}
