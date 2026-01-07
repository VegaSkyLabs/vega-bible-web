'use client';

import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface DraggableWordPieceProps {
  /** Unique identifier for drag tracking */
  id: string;
  /** The word to display */
  word: string;
  /** Whether the word is placed in a slot */
  isPlaced?: boolean;
  /** Shows green success styling when true */
  isCorrect?: boolean;
  /** Shows red error styling when true */
  isWrong?: boolean;
  /** External dragging state (used by DragOverlay) */
  isDragging?: boolean;
  /** Disables dragging interaction */
  disabled?: boolean;
  /** Optional click handler */
  onClick?: () => void;
}

/**
 * A draggable word piece for verse completion puzzles.
 * Uses @dnd-kit for drag-and-drop functionality.
 *
 * @example
 * <DraggableWordPiece id="word-1" word="Jesus" />
 * <DraggableWordPiece id="word-2" word="loves" isCorrect />
 */
export function DraggableWordPiece({
  id,
  word,
  isPlaced = false,
  isCorrect = false,
  isWrong = false,
  isDragging: externalIsDragging = false,
  disabled = false,
  onClick,
}: DraggableWordPieceProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging: internalIsDragging } = useDraggable({
    id,
    data: { word },
    disabled,
  });

  // Use external isDragging for overlay, internal for actual draggable
  const isDragging = externalIsDragging || internalIsDragging;

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
        zIndex: isDragging ? 1000 : undefined,
      }
    : undefined;

  // Determine styling based on state
  let chipClasses = 'px-3 py-2 rounded-lg font-medium text-sm transition-all select-none ';

  if (internalIsDragging) {
    // Hide the original element when dragging (overlay will show instead)
    chipClasses += 'opacity-0 ';
  } else if (externalIsDragging) {
    // Style for the drag overlay
    chipClasses += 'shadow-lg scale-105 cursor-grabbing ';
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

interface PlacedWordPieceProps {
  /** The word to display */
  word: string;
  /** Visual feedback state for the placed word */
  feedback: 'correct' | 'wrong' | 'pending' | 'hidden';
  /** Whether to show feedback icons (checkmark/X) */
  showFeedback?: boolean;
  /** Callback when remove button is clicked */
  onRemove?: () => void;
}

/**
 * A non-draggable word piece displayed in a drop slot.
 * Shows visual feedback (correct/wrong) and optional remove button.
 *
 * @example
 * <PlacedWordPiece word="grace" feedback="correct" />
 * <PlacedWordPiece word="faith" feedback="wrong" onRemove={() => {}} />
 */
export function PlacedWordPiece({
  word,
  feedback,
  showFeedback = true,
  onRemove,
}: PlacedWordPieceProps) {
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
