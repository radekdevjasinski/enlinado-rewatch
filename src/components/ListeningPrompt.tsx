interface ListeningPromptProps {
  isHidden: boolean;
  onShowSubtitles: () => void;
}

export function ListeningPrompt({ isHidden, onShowSubtitles }: ListeningPromptProps) {
  return (
    <div className="clip-study listening-prompt" inert={isHidden}>
      <h3 className="listening-prompt__title">Najpierw posłuchaj bez napisów</h3>
      <p className="listening-prompt__text">
        Sprawdź, ile rozumiesz ze słuchu. Po zakończeniu fragment odtworzy się jeszcze raz, już z napisami.
      </p>
      <button type="button" className="button button--secondary" onClick={onShowSubtitles}>
        Pomiń i pokaż napisy
      </button>
    </div>
  );
}
