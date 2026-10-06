import type { ClipPhase } from '../types/ClipPhase';

const PHASE_STEPS: { phase: ClipPhase; label: string }[] = [
  { phase: 'listening', label: 'Bez napisów' },
  { phase: 'reading', label: 'Z napisami' },
  { phase: 'quiz', label: 'Quiz' },
];

interface PhaseStepperProps {
  currentPhase: ClipPhase;
  onSelect: (phase: ClipPhase) => void;
}

function getStepClassName(stepIndex: number, currentIndex: number): string {
  if (stepIndex === currentIndex) return 'phase-step phase-step--active';
  if (stepIndex < currentIndex) return 'phase-step phase-step--done';
  return 'phase-step';
}

export function PhaseStepper({ currentPhase, onSelect }: PhaseStepperProps) {
  const currentIndex = PHASE_STEPS.findIndex((step) => step.phase === currentPhase);

  return (
    <ol className="phase-stepper" aria-label="Etapy klipu">
      {PHASE_STEPS.map((step, stepIndex) => (
        <li key={step.phase}>
          <button
            type="button"
            className={getStepClassName(stepIndex, currentIndex)}
            aria-current={stepIndex === currentIndex ? 'step' : undefined}
            onClick={() => onSelect(step.phase)}
          >
            {stepIndex + 1}. {step.label}
          </button>
        </li>
      ))}
    </ol>
  );
}
