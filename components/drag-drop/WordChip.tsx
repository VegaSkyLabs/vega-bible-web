'use client';

import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface WordChipProps {
  id: string;
  word: string;
  isPlaced?: boolean;
  isCorrect?: boolean;
  isWrong?: boolean;
  isDragging?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export function WordChip({
  id,
  word,
  isPlaced = false,
  isCorrect = false,
  isWrong = false,
  disabled = false,
  onClick,
}: WordChipProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    data: { word },
    disabled,
  });

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
        zIndex: isDragging ? 1000 : undefined,
      }
    : undefined;

  // Determine styling based on state
  let chipClasses = 'px-3 py-2 rounded-lg font-medium text-sm transition-all select-none ';

  if (isDragging) {
    chipClasses += 'opacity-80 scale-105 shadow-lg cursor-grabbing ';
  } else if (disabled) {
    chipClasses += 'opacity-50 cursor-not-allowed ';
  } else {
    chipClasses += 'cursor-grab hover:scale-105 active:cursor-grabbing ';
  }

  if (isCorrect) {
    chipClasses += 'bg-success text-success-content ring-2 ring-success/50 ';
  } else if (isWrong) {
    chipClasses += 'bg-error text-error-content ring-2 ring-error/50 ';
  } else if (isPlaced) {
    chipClasses += 'bg-primary text-primary-content ';
  } else {
    chipClasses += 'bg-base-200 text-base-content hover:bg-base-300 ';
  }

  // Add shadow when dragging
  if (isDragging) {
    chipClasses += 'shadow-xl ';
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={chipClasses}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={`Drag word: ${word}`}
      aria-disabled={disabled}
    >
      {word}
    </div>
  );
}

// A simpler version for display in slots (not draggable from slot)
export function PlacedWordChip({
  word,
  feedback,
  showFeedback = true,
  onRemove,
}: {
  word: string;
  feedback: 'correct' | 'wrong' | 'pending' | 'hidden';
  showFeedback?: boolean;
  onRemove?: () => void;
}) {
  let chipClasses =
    'px-3 py-2 rounded-lg font-medium text-sm transition-all inline-flex items-center gap-2 ';

  if (showFeedback && feedback === 'correct') {
    chipClasses += 'bg-success text-success-content ';
  } else if (showFeedback && feedback === 'wrong') {
    chipClasses += 'bg-error text-error-content ';
  } else {
    chipClasses += 'bg-primary text-primary-content ';
  }

  return (
    <span className={chipClasses}>
      {word}
      {showFeedback && feedback === 'correct' && (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )}
      {showFeedback && feedback === 'wrong' && (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
      {onRemove && feedback !== 'correct' && (
        <button
          onClick={onRemove}
          className="ml-1 hover:text-error-content/80 transition-colors"
          aria-label="Remove word"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
}
