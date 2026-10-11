import { useId, useState, type KeyboardEvent } from 'react';

const REPORT_REASONS = [
  'Zły poziom trudności',
  'Błędne napisy lub tłumaczenie',
  'Wideo nie działa',
  'Nieodpowiednia treść',
];

interface ReportDialogProps {
  clipTitle: string;
  onCancel: () => void;
  onSubmit: () => void;
}

export function ReportDialog({ clipTitle, onCancel, onSubmit }: ReportDialogProps) {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const titleId = useId();
  const reasonGroupName = useId();

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    event.stopPropagation();
    if (event.key === 'Escape') onCancel();
  };

  return (
    <div className="report-backdrop" onClick={onCancel} onKeyDown={handleKeyDown}>
      <div
        className="report-dialog"
        role="dialog"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <header>
          <h3 id={titleId} className="report-dialog__title">
            Zgłoś klip
          </h3>
          <p className="report-dialog__text">Co jest nie tak z „{clipTitle}”?</p>
        </header>
        <div className="report-reasons" role="radiogroup" aria-labelledby={titleId}>
          {REPORT_REASONS.map((reason, reasonIndex) => (
            <label key={reason} className="report-reason">
              <input
                type="radio"
                className="report-reason__input"
                name={reasonGroupName}
                autoFocus={reasonIndex === 0}
                checked={selectedReason === reason}
                onChange={() => setSelectedReason(reason)}
              />
              {reason}
            </label>
          ))}
        </div>
        <div className="report-dialog__actions">
          <button type="button" className="button button--secondary" onClick={onCancel}>
            Anuluj
          </button>
          <button type="button" className="button button--accent" disabled={selectedReason === null} onClick={onSubmit}>
            Wyślij zgłoszenie
          </button>
        </div>
      </div>
    </div>
  );
}
