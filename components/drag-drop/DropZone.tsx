'use client';

import { useDroppable } from '@dnd-kit/core';
import { PlacedWordPiece } from './WordPiece';
import type { SlotFeedback } from '@/types/drag-drop';

interface DropZoneProps {
  /** Unique identifier for the drop zone */
  id: string;
  /** Position index in the verse (used for aria-label) */
  index: number;
  /** The word currently placed in this slot, or null if empty */
  placedWord: string | null;
  /** Visual feedback state for the slot */
  feedback: SlotFeedback;
  /** Expected character count for sizing hints */
  expectedWordLength?: number;
  /** Shows underscore hints matching expected word length */
  showSizeHint?: boolean;
  /** Disables drop interactions when true */
  disabled?: boolean;
  /** Callback when the placed word is removed */
  onRemove?: () => void;
}

/**
 * A droppable slot where words can be placed in verse completion puzzles.
 * Uses @dnd-kit for drag-and-drop functionality with visual feedback states.
 *
 * @example
 * <DropZone id="slot-0" index={0} placedWord={null} feedback="hidden" />
 * <DropZone id="slot-1" index={1} placedWord="grace" feedback="correct" />
 */
export function DropZone({
  id,
  index,
  placedWord,
  feedback,
  expectedWordLength,
  showSizeHint = false,
  disabled = false,
  onRemove,
}: DropZoneProps) {
  const { isOver, setNodeRef } = useDroppable({
    id,
    data: { index },
    disabled,
  });

  // Calculate width based on expected word length (if showing size hint)
  const minWidth = showSizeHint && expectedWordLength
    ? `${Math.max(expectedWordLength * 0.55 + 1.5, 3)}rem`
    : '4rem';

  // Determine styling based on state
  let zoneClasses = 'inline-flex items-center justify-center rounded-lg transition-all mx-1 ';

  if (placedWord) {
    // Has a word placed
    zoneClasses += 'p-0 ';
  } else {
    // Empty slot
    zoneClasses += 'px-3 py-2 border-2 border-dashed ';

    if (isOver && !disabled) {
      zoneClasses += 'border-primary bg-primary/20 scale-105 ';
    } else if (disabled) {
      zoneClasses += 'border-base-300 bg-base-200 opacity-50 ';
    } else {
      zoneClasses += 'border-base-300 bg-base-100 hover:border-primary/50 ';
    }
  }

  // Feedback coloring for empty slots
  if (!placedWord && feedback === 'wrong') {
    zoneClasses += 'border-error bg-error/10 ';
  }

  return (
    <span
      ref={setNodeRef}
      className={zoneClasses}
      style={{ minWidth: placedWord ? undefined : minWidth }}
      role="region"
      aria-label={placedWord ? `Slot ${index + 1}: ${placedWord}` : `Empty slot ${index + 1}`}
    >
      {placedWord ? (
        <PlacedWordPiece
          word={placedWord}
          feedback={feedback}
          showFeedback={feedback !== 'hidden'}
          onRemove={!disabled && feedback !== 'correct' ? onRemove : undefined}
        />
      ) : (
        <span className="text-base-content/40 text-sm">
          {showSizeHint ? '_'.repeat(Math.max(expectedWordLength || 3, 3)) : '___'}
        </span>
      )}
    </span>
  );
}
