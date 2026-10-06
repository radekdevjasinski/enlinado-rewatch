export function formatQuestionCount(questionCount: number): string {
  if (questionCount === 1) return '1 pytanie';
  if (questionCount >= 2 && questionCount <= 4) return `${questionCount} pytania`;
  return `${questionCount} pytań`;
}
