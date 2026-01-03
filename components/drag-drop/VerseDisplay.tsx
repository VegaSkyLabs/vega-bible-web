'use client';

import { useMemo } from 'react';
import { DropZone } from './DropZone';
import { parseBlankText } from '@/lib/drag-puzzles/utils';
import type { SlotFeedback, DragDropMode } from '@/types/drag-drop';

interface VerseDisplayProps {
  blankedText: string;
  fullText?: string; // For extreme mode
  mode: DragDropMode;
  placements: (string | null)[];
  slotFeedback: SlotFeedback[];
  expectedWords: string[];
  disabled?: boolean;
  onRemoveWord?: (slotIndex: number) => void;
}

export function VerseDisplay({
  blankedText,
  fullText,
  mode,
  placements,
  slotFeedback,
  expectedWords,
  disabled = false,
  onRemoveWord,
}: VerseDisplayProps) {
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
    <div className="text-lg md:text-xl leading-relaxed text-center p-4 md:p-6 bg-base-100 rounded-xl shadow-sm">
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
