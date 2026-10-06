import { AppHeader } from './components/AppHeader';
import { Feed } from './components/Feed';
import clipsData from './data/clips.json';
import { useScore } from './hooks/useScore';
import type { Clip } from './types/Clip';

export function App() {
  const clips = clipsData as Clip[];
  const { correctCount, recordCorrectAnswer } = useScore();

  return (
    <div className="app">
      <AppHeader correctCount={correctCount} />
      <Feed clips={clips} onCorrectAnswer={recordCorrectAnswer} />
    </div>
  );
}
