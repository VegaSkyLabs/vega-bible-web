'use client';

import { DraggableWordPiece } from './WordPiece';

interface WordBankProps {
  /** Array of available words to display */
  words: string[];
  /** Disables all word pieces when true */
  disabled?: boolean;
}

/**
 * Container displaying the pool of available words for a verse puzzle.
 * Users drag words from here into blank slots in the verse.
 *
 * @example
 * <WordBank words={['faith', 'hope', 'love']} />
 * <WordBank words={remainingWords} disabled={isSubmitted} />
 */
export function WordBank({ words, disabled = false }: WordBankProps) {
  if (words.length === 0) {
    return (
      <div className="flex items-center justify-center p-4 text-base-content/60 text-sm">
        All words have been placed!
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 justify-center p-4 bg-base-200/50 rounded-xl border border-base-300 shadow-sm">
      {words.map((word, index) => (
        <DraggableWordPiece
          key={`${word}-${index}`}
          id={`word-${word}-${index}`}
          word={word}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
