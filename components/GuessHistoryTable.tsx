'use client';

import { useMemo } from 'react';
import { ComparisonResult, HintStatus, Direction } from '@/lib/guessComparison';
import { ALL_CATEGORIES } from '@/lib/bibleMetadata';
import CategoryBadge from './CategoryBadge';

interface GuessHistoryTableProps {
  guesses: ComparisonResult[];
}

// Get background color class based on status
function getStatusColor(status: HintStatus): string {
  switch (status) {
    case 'correct':
      return 'bg-success text-success-content';
    case 'close':
      return 'bg-warning text-warning-content';
    case 'wrong':
      return 'bg-error text-error-content';
  }
}

// Get arrow indicator for numerical values (chapter/verse)
function getArrow(direction: Direction): string {
  switch (direction) {
    case 'up':
      return '↑';
    case 'down':
      return '↓';
    case 'none':
      return '';
  }
}

// Get arrow indicator for Testament (timeline: Old → New)
function getTestamentArrow(direction: Direction): string {
  switch (direction) {
    case 'down':
      return '→'; // Go forward (Old → New)
    case 'up':
      return '←'; // Go back (New → Old)
    case 'none':
      return '';
  }
}

export default function GuessHistoryTable({ guesses }: GuessHistoryTableProps) {
  // Track eliminated and confirmed categories
  const categoryStatus = useMemo(() => {
    const eliminated = new Set<string>();
    let confirmed: string | null = null;

    for (const guess of guesses) {
      if (guess.category.status === 'wrong' && guess.category.value !== '?') {
        eliminated.add(guess.category.value);
      } else if (guess.category.status === 'correct') {
        confirmed = guess.category.value;
      }
    }

    return { eliminated, confirmed };
  }, [guesses]);

  if (guesses.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Category Elimination Tracker */}
      <div className="mb-5 p-3 bg-base-200 rounded-lg">
        <div className="text-xs font-bold opacity-70 mb-2">Categories</div>
        <div className="flex flex-wrap gap-1">
          {ALL_CATEGORIES.map((category) => {
            const isEliminated = categoryStatus.eliminated.has(category);
            const isConfirmed = categoryStatus.confirmed === category;
            const status = isConfirmed
              ? 'confirmed'
              : isEliminated
                ? 'eliminated'
                : 'default';

            return (
              <CategoryBadge
                key={category}
                category={category}
                status={status}
              />
            );
          })}
        </div>
      </div>

      {/* Header */}
      <div className="grid grid-cols-5 gap-1 mb-2 text-xs font-bold opacity-70 text-center">
        <div>Book</div>
        <div>Testament</div>
        <div>Category</div>
        <div>Chapter</div>
        <div>Verse</div>
      </div>

      {/* Guess rows */}
      <div className="space-y-1">
        {[...guesses].reverse().map((guess, index) => (
          <div
            key={index}
            className="grid grid-cols-5 gap-1 text-sm animate-fade-in"
          >
            {/* Book */}
            <div
              className={`rounded-lg p-2 text-center font-medium truncate ${getStatusColor(
                guess.book.status
              )}`}
              title={guess.book.value}
            >
              {guess.book.value}
            </div>

            {/* Testament with arrow */}
            <div
              className={`rounded-lg p-2 text-center font-medium flex items-center justify-center gap-1 ${getStatusColor(
                guess.testament.status
              )}`}
            >
              <span>{guess.testament.value}</span>
              {guess.testament.direction !== 'none' && (
                <span className="text-lg font-bold">
                  {getTestamentArrow(guess.testament.direction)}
                </span>
              )}
            </div>

            {/* Category */}
            <div
              className={`rounded-lg p-2 text-center font-medium truncate ${getStatusColor(
                guess.category.status
              )}`}
              title={guess.category.value}
            >
              {guess.category.value}
            </div>

            {/* Chapter with arrow */}
            <div
              className={`rounded-lg p-2 text-center font-medium flex items-center justify-center gap-1 ${getStatusColor(
                guess.chapter.status
              )}`}
            >
              <span>{guess.chapter.value || '?'}</span>
              {guess.chapter.direction !== 'none' && (
                <span className="text-lg font-bold">
                  {getArrow(guess.chapter.direction)}
                </span>
              )}
            </div>

            {/* Verse with arrow */}
            <div
              className={`rounded-lg p-2 text-center font-medium flex items-center justify-center gap-1 ${getStatusColor(
                guess.verse.status
              )}`}
            >
              <span>{guess.verse.value || '?'}</span>
              {guess.verse.direction !== 'none' && (
                <span className="text-lg font-bold">
                  {getArrow(guess.verse.direction)}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 flex justify-center gap-4 text-xs opacity-70">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-success" />
          <span>Correct</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-warning" />
          <span>Close</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-error" />
          <span>Wrong</span>
        </div>
        <div className="flex items-center gap-1">
          <span>↑↓</span>
          <span>Higher/Lower</span>
        </div>
        <div className="flex items-center gap-1">
          <span>←→</span>
          <span>Old/New</span>
        </div>
      </div>
    </div>
  );
}
