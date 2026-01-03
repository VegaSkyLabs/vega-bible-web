'use client';

import { useDroppable } from '@dnd-kit/core';
import { PlacedWordChip } from './WordChip';
import type { SlotFeedback } from '@/types/drag-drop';

interface DropZoneProps {
  id: string;
  index: number;
  placedWord: string | null;
  feedback: SlotFeedback;
  expectedWordLength?: number; // For word-sized hints
  showSizeHint?: boolean;
  disabled?: boolean;
  onRemove?: () => void;
}

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
        <PlacedWordChip
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
