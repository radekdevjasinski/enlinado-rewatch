import type { ClipAspect } from './ClipAspect';
import type { QuizQuestion } from './QuizQuestion';
import type { SubtitleLine } from './SubtitleLine';

export interface Clip {
  id: string;
  videoId: string;
  start: number;
  end: number;
  aspect: ClipAspect;
  title: string;
  channel: string;
  subtitles: SubtitleLine[];
  quiz: QuizQuestion[];
}
