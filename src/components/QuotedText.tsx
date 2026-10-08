const QUOTED_FRAGMENT = /„([^”]*)”/;

interface QuotedTextProps {
  text: string;
}

export function QuotedText({ text }: QuotedTextProps) {
  return (
    <>
      {text.split(QUOTED_FRAGMENT).map((fragment, fragmentIndex) =>
        fragmentIndex % 2 === 1 ? (
          <strong key={fragmentIndex} className="quoted">
            {fragment}
          </strong>
        ) : (
          fragment
        ),
      )}
    </>
  );
}
