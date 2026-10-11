import { useEffect, useState } from 'react';
import { ReportDialog } from './ReportDialog';

const TOAST_DURATION_MS = 2200;

interface ClipReportProps {
  clipTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onReported: () => void;
}

export function ClipReport({ clipTitle, isOpen, onClose, onReported }: ClipReportProps) {
  const [isToastVisible, setIsToastVisible] = useState(false);

  useEffect(() => {
    if (!isToastVisible) return;
    const timeoutId = window.setTimeout(() => setIsToastVisible(false), TOAST_DURATION_MS);
    return () => window.clearTimeout(timeoutId);
  }, [isToastVisible]);

  const submitReport = () => {
    onReported();
    onClose();
    setIsToastVisible(true);
  };

  return (
    <>
      {isOpen && <ReportDialog clipTitle={clipTitle} onCancel={onClose} onSubmit={submitReport} />}
      {isToastVisible && (
        <p className="report-toast" role="status">
          Dziękujemy — sprawdzimy ten klip
        </p>
      )}
    </>
  );
}
