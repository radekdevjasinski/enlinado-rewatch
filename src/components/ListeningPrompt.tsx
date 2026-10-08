interface ListeningPromptProps {
  onShowSubtitles: () => void;
}

export function ListeningPrompt({ onShowSubtitles }: ListeningPromptProps) {
  return (
    <div className="listening-prompt">
      <div>
        <h3 className="listening-prompt__title">Najpierw tylko słuchaj</h3>
        <p className="listening-prompt__text">Ile rozumiesz bez napisów?</p>
      </div>
      <button type="button" className="pill-button" onClick={onShowSubtitles}>
        Pokaż napisy →
      </button>
    </div>
  );
}
