export function shuffle<Item>(items: readonly Item[]): Item[] {
  const shuffled = [...items];
  for (let lastIndex = shuffled.length - 1; lastIndex > 0; lastIndex--) {
    const swapIndex = Math.floor(Math.random() * (lastIndex + 1));
    [shuffled[lastIndex], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[lastIndex]];
  }
  return shuffled;
}
