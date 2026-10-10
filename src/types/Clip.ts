import type { ClipAspect } from './ClipAspect';
import type { ClipLevel } from './ClipLevel';
import type { Phrase } from './Phrase';
import type { QuizQuestion } from './QuizQuestion';
import type { SubtitleLine } from './SubtitleLine';

export interface Clip {
  id: string;
  videoId: string;
  start: number;
  end: number;
  aspect: ClipAspect;
  level: ClipLevel;
  title: string;
  channel: string;
  phrases?: Phrase[];
  subtitles: SubtitleLine[];
  quiz: QuizQuestion[];
}
