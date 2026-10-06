import { useRef, type PointerEvent, type ReactNode } from 'react';

const SWIPE_DISTANCE_PX = 40;

interface QuizSheetProps {
  isOpen: boolean;
  label: string;
  onOpen: () => void;
  onClose: () => void;
  children: ReactNode;
}

export function QuizSheet({ isOpen, label, onOpen, onClose, children }: QuizSheetProps) {
  const pointerStartY = useRef<number | null>(null);
  const hasSwiped = useRef(false);

  const startDrag = (event: PointerEvent<HTMLButtonElement>) => {
    pointerStartY.current = event.clientY;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const finishDrag = (event: PointerEvent<HTMLButtonElement>) => {
    if (pointerStartY.current === null) return;
    const dragDistance = event.clientY - pointerStartY.current;
    pointerStartY.current = null;
    hasSwiped.current = Math.abs(dragDistance) >= SWIPE_DISTANCE_PX;
    if (dragDistance <= -SWIPE_DISTANCE_PX && !isOpen) onOpen();
    if (dragDistance >= SWIPE_DISTANCE_PX && isOpen) onClose();
  };

  const toggle = () => {
    if (hasSwiped.current) {
      hasSwiped.current = false;
      return;
    }
    if (isOpen) onClose();
    else onOpen();
  };

  return (
    <aside className={isOpen ? 'quiz-sheet quiz-sheet--open' : 'quiz-sheet'}>
      <button
        type="button"
        className="quiz-sheet__handle"
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Zwiń quiz' : 'Rozwiń quiz'}
        onPointerDown={startDrag}
        onPointerUp={finishDrag}
        onClick={toggle}
      >
        <span className="quiz-sheet__grip" />
        {!isOpen && (
          <span className="quiz-sheet__peek">
            <strong>{label}</strong>
            <span>↑ Przesuń w górę</span>
          </span>
        )}
      </button>
      <div className="quiz-sheet__content" inert={!isOpen}>
        {children}
      </div>
    </aside>
  );
}
