'use client';

import { ComparisonResult, HintStatus, Direction } from '@/lib/guessComparison';
import {
  ArrowLongUpIcon,
  ArrowLongDownIcon,
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';

interface LastGuessSummaryProps {
  guess: ComparisonResult;
  onViewAll: () => void;
  className?: string;
  id?: string;
}

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

function ArrowIcon({ direction }: { direction: Direction }) {
  if (direction === 'none') return null;
  const Icon = direction === 'up' ? ArrowLongUpIcon : ArrowLongDownIcon;
  return <Icon className="h-5 w-5" />;
}

function TestamentArrowIcon({ direction }: { direction: Direction }) {
  if (direction === 'none') return null;
  const Icon = direction === 'up' ? ArrowLongLeftIcon : ArrowLongRightIcon;
  return <Icon className="h-5 w-5" />;
}

export default function LastGuessSummary({ guess, onViewAll, className, id }: LastGuessSummaryProps) {
  return (
    <div id={id} className={`bg-base-100 rounded-xl shadow-lg p-4 animate-fade-in ${className ?? ''}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[12px] font-bold uppercase opacity-60">Last Guess</span>
        <button
          onClick={onViewAll}
          className="text-[12px] text-primary hover:underline font-medium"
        >
          View all <ChevronDownIcon className="h-4 w-4 inline" />
        </button>
      </div>

      {/* Header */}
      <div className="grid grid-cols-5 gap-1 mb-2 text-xs font-bold opacity-70 text-center">
        <div>Book</div>
        <div>Testament</div>
        <div>Category</div>
        <div>Chapter</div>
        <div>Verse</div>
      </div>

      <div className="grid grid-cols-5 gap-1 text-sm">
        {/* Book */}
        <div
          className={`rounded-lg p-2 text-center font-medium truncate ${getStatusColor(
            guess.book.status
          )}`}
          title={guess.book.value}
        >
          {guess.book.value}
        </div>

        {/* Testament */}
        <div
          className={`rounded-lg p-2 text-center font-medium flex items-center justify-center gap-1 ${getStatusColor(
            guess.testament.status
          )}`}
        >
          <span>{guess.testament.value}</span>
          <TestamentArrowIcon direction={guess.testament.direction} />
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

        {/* Chapter */}
        <div
          className={`rounded-lg p-2 text-center font-medium flex items-center justify-center gap-1 ${getStatusColor(
            guess.chapter.status
          )}`}
        >
          <span>{guess.chapter.value || '?'}</span>
          <ArrowIcon direction={guess.chapter.direction} />
        </div>

        {/* Verse */}
        <div
          className={`rounded-lg p-2 text-center font-medium flex items-center justify-center gap-1 ${getStatusColor(
            guess.verse.status
          )}`}
        >
          <span>{guess.verse.value || '?'}</span>
          <ArrowIcon direction={guess.verse.direction} />
        </div>
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
          <span>←</span>
          <span>→</span>
          <span>Old/New</span>
        </div>
      </div>
    </div>
  );
}
