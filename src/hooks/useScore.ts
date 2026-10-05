import { useCallback, useState } from 'react';

const STORAGE_KEY = 'enlinadotok.correctAnswers';

function readStoredAnswerKeys(): string[] {
  const storedValue = localStorage.getItem(STORAGE_KEY);
  if (!storedValue) return [];
  try {
    const parsed: unknown = JSON.parse(storedValue);
    return Array.isArray(parsed) ? parsed.filter((key) => typeof key === 'string') : [];
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

export function useScore() {
  const [correctAnswerKeys, setCorrectAnswerKeys] = useState(readStoredAnswerKeys);

  const recordCorrectAnswer = useCallback((answerKey: string) => {
    setCorrectAnswerKeys((previousKeys) => {
      if (previousKeys.includes(answerKey)) return previousKeys;
      const updatedKeys = [...previousKeys, answerKey];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedKeys));
      return updatedKeys;
    });
  }, []);

  return { correctCount: correctAnswerKeys.length, recordCorrectAnswer };
}
