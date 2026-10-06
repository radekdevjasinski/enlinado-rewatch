import type { Phrase } from '../types/Phrase';

interface PhraseOfClipProps {
  phrase?: Phrase;
}

export function PhraseOfClip({ phrase }: PhraseOfClipProps) {
  if (!phrase) return null;

  return (
    <section className="phrase-of-clip">
      <h3 className="eyebrow">Zwrot z klipu</h3>
      <p className="phrase-of-clip__text" lang="en">
        {phrase.en}
      </p>
      <p className="phrase-of-clip__translation">{phrase.pl}</p>
    </section>
  );
}
