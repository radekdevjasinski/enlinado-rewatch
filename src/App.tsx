import { Feed } from './components/Feed';
import { ScoreBadge } from './components/ScoreBadge';
import clipsData from './data/clips.json';
import { useScore } from './hooks/useScore';
import type { Clip } from './types/Clip';

export function App() {
  const clips = clipsData as Clip[];
  const { correctCount, recordCorrectAnswer } = useScore();

  return (
    <div className="app">
      <header className="app-header">
        <h1>Enlinadotok</h1>
        <ScoreBadge correctCount={correctCount} />
      </header>
      <Feed clips={clips} onCorrectAnswer={recordCorrectAnswer} />
    </div>
  );
}
