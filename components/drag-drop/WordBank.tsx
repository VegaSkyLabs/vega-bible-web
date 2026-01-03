'use client';

import { WordChip } from './WordChip';

interface WordBankProps {
  words: string[];
  disabled?: boolean;
}

export function WordBank({ words, disabled = false }: WordBankProps) {
  if (words.length === 0) {
    return (
      <div className="flex items-center justify-center p-4 text-base-content/60 text-sm">
        All words have been placed!
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 justify-center p-4 bg-base-200/50 rounded-xl">
      {words.map((word, index) => (
        <WordChip
          key={`${word}-${index}`}
          id={`word-${word}-${index}`}
          word={word}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
