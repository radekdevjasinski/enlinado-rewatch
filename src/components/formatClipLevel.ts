import type { ClipLevel } from '../types/ClipLevel';

const LEVEL_NAMES: Record<ClipLevel, string> = {
  A1: 'Początkujący',
  A2: 'Podstawowy',
  B1: 'Średnio zaawansowany',
  B2: 'Średnio zaawansowany+',
  C1: 'Zaawansowany',
  C2: 'Biegły',
};

export function formatClipLevel(level: ClipLevel): string {
  return `${level} · ${LEVEL_NAMES[level]}`;
}
