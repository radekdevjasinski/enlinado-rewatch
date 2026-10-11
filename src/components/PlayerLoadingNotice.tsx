export function PlayerLoadingNotice() {
  return (
    <div className="player-loading" role="status">
      <span className="player-loading__spinner" aria-hidden="true" />
      <div>
        <h3 className="player-loading__title">Ładowanie filmu…</h3>
        <p className="player-loading__text">Może potrwać kilkanaście sekund. Jeśli nie ruszy, naciśnij ▶.</p>
      </div>
    </div>
  );
}
