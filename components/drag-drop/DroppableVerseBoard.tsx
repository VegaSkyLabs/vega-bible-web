'use client';

import { useMemo } from 'react';
import { DropZone } from './DropZone';
import { parseBlankText } from '@/lib/drag-puzzles/utils';
import type { SlotFeedback, DragDropMode } from '@/types/drag-drop';

interface DroppableVerseBoardProps {
  /** Verse text with `___` markers for blanks */
  blankedText: string;
  /** Complete verse text (used for extreme mode) */
  fullText?: string;
  /** Current difficulty mode */
  mode: DragDropMode;
  /** Words placed in each slot */
  placements: (string | null)[];
  /** Feedback state for each slot (correct/wrong/pending) */
  slotFeedback: SlotFeedback[];
  /** Expected correct answers (used for size hints) */
  expectedWords: string[];
  /** Disables all drop zones when true */
  disabled?: boolean;
  /** Callback when a word is removed from a slot */
  onRemoveWord?: (slotIndex: number) => void;
}

/**
 * The game board displaying the verse with drop zones for word placement.
 * Renders inline blanks for normal modes, or a grid of blanks for extreme mode.
 *
 * @example
 * <DroppableVerseBoard
 *   blankedText="For God so ___ the world"
 *   mode="easy"
 *   placements={[null]}
 *   slotFeedback={['pending']}
 *   expectedWords={['loved']}
 * />
 */
export function DroppableVerseBoard({
  blankedText,
  fullText,
  mode,
  placements,
  slotFeedback,
  expectedWords,
  disabled = false,
  onRemoveWord,
}: DroppableVerseBoardProps) {
  // Parse the blanked text into segments
  const segments = useMemo(() => {
    if (mode === 'extreme' && fullText) {
      // For extreme mode, create all-blank segments
      const words = fullText
        .replace(/[.,;:!?"'()]/g, '')
        .split(/\s+/)
        .filter(Boolean);

      return words.map((_, index) => ({
        type: 'blank' as const,
        content: '',
        index,
      }));
    }
    return parseBlankText(blankedText);
  }, [blankedText, fullText, mode]);

  // Determine if we should show size hints
  const showSizeHint = mode === 'easy' || mode === 'medium';

  return (
    <div className="text-lg md:text-xl leading-relaxed text-center p-4 md:p-6 bg-base-100 rounded-xl border border-base-300 shadow-md">
      {/* Quote mark */}
      <span className="text-3xl text-primary/30 font-serif">&ldquo;</span>

      {mode === 'extreme' ? (
        // Extreme mode: grid of all blanks
        <div className="flex flex-wrap gap-1 justify-center items-center mt-2">
          {segments.map((segment, idx) => (
            <DropZone
              key={`slot-${idx}`}
              id={`slot-${idx}`}
              index={idx}
              placedWord={placements[idx]}
              feedback={slotFeedback[idx]}
              expectedWordLength={expectedWords[idx]?.length}
              showSizeHint={false} // Never show size hints in extreme
              disabled={disabled}
              onRemove={() => onRemoveWord?.(idx)}
            />
          ))}
        </div>
      ) : (
        // Normal modes: inline text with blanks
        <span className="inline">
          {segments.map((segment, idx) => {
            if (segment.type === 'text') {
              return <span key={`text-${idx}`}>{segment.content}</span>;
            }

            const slotIndex = segment.index!;
            return (
              <DropZone
                key={`slot-${slotIndex}`}
                id={`slot-${slotIndex}`}
                index={slotIndex}
                placedWord={placements[slotIndex]}
                feedback={slotFeedback[slotIndex]}
                expectedWordLength={expectedWords[slotIndex]?.length}
                showSizeHint={showSizeHint}
                disabled={disabled}
                onRemove={() => onRemoveWord?.(slotIndex)}
              />
            );
          })}
        </span>
      )}

      {/* Closing quote */}
      <span className="text-3xl text-primary/30 font-serif">&rdquo;</span>
    </div>
  );
}
