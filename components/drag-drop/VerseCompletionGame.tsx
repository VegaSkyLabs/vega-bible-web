'use client';

import { useState, useCallback } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useDragDropGame } from '@/hooks/useDragDropGame';
import { DroppableVerseBoard } from './DroppableVerseBoard';
import { WordBank } from './WordBank';
import { DraggableWordPiece } from './WordPiece';
import { DragDropFeedback } from './DragDropFeedback';
import type { DragPuzzle } from '@/lib/drag-puzzles/schema';
import type { DragDropMode, DragDropGameResult } from '@/types/drag-drop';
import { getNextMode } from '@/lib/drag-puzzles/storage';

interface VerseCompletionGameProps {
  /** The puzzle data containing verse, blanks, and reference */
  puzzle: DragPuzzle;
  /** Starting difficulty mode */
  initialMode?: DragDropMode;
  /** Callback when puzzle is completed */
  onComplete?: (result: DragDropGameResult) => void;
  /** Callback for navigating to the next puzzle */
  onNextPuzzle?: () => void;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function getModeLabel(mode: DragDropMode): string {
  return mode.charAt(0).toUpperCase() + mode.slice(1);
}

function getModeBadgeClass(mode: DragDropMode): string {
  switch (mode) {
    case 'easy':
      return 'badge-success';
    case 'medium':
      return 'badge-warning';
    case 'hard':
      return 'badge-error';
    case 'extreme':
      return 'badge-secondary';
    default:
      return 'badge-primary';
  }
}

/**
 * Main game component for verse completion puzzles.
 * Orchestrates drag-and-drop interaction, difficulty modes, timer, and hints.
 *
 * @example
 * <VerseCompletionGame
 *   puzzle={puzzleData}
 *   initialMode="easy"
 *   onComplete={(result) => console.log(result)}
 * />
 */
export function VerseCompletionGame({
  puzzle,
  initialMode = 'easy',
  onComplete,
  onNextPuzzle,
}: VerseCompletionGameProps) {
  const [mode, setMode] = useState<DragDropMode>(initialMode);
  const [activeWord, setActiveWord] = useState<string | null>(null);
  const [gameResult, setGameResult] = useState<DragDropGameResult | null>(null);

  const handleComplete = useCallback((result: DragDropGameResult) => {
    setGameResult(result);
    onComplete?.(result);
  }, [onComplete]);

  const {
    state,
    puzzleProgress,
    canSubmit,
    isModeUnlocked,
    expectedWords,
    placeWord,
    removeWord,
    submitAnswer,
    resetPuzzle,
    useHint,
  } = useDragDropGame({
    puzzle,
    mode,
    onComplete: handleComplete,
  });

  // Configure sensors for both mouse and touch
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    })
  );

  // Handle drag start
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const word = event.active.data.current?.word;
    if (word) {
      setActiveWord(word);
    }
  }, []);

  // Handle drag end
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveWord(null);

      const { active, over } = event;
      if (!over) return;

      const word = active.data.current?.word;
      const slotIndex = over.data.current?.index;

      if (word && typeof slotIndex === 'number') {
        placeWord(slotIndex, word);
      }
    },
    [placeWord]
  );

  // Handle mode change
  const handleModeChange = useCallback((newMode: DragDropMode) => {
    setMode(newMode);
    setGameResult(null);
  }, []);

  // Handle play again
  const handlePlayAgain = useCallback(() => {
    setGameResult(null);
    resetPuzzle();
  }, [resetPuzzle]);

  // Handle next mode
  const handleNextMode = useCallback(() => {
    const next = getNextMode(mode);
    if (next) {
      handleModeChange(next);
      resetPuzzle();
    }
  }, [mode, handleModeChange, resetPuzzle]);

  // Show feedback if game is complete
  if (state.isComplete && gameResult) {
    return (
      <DragDropFeedback
        result={gameResult}
        puzzleProgress={puzzleProgress}
        fullVerseText={puzzle.fullText}
        reference={puzzle.reference}
        onPlayAgain={handlePlayAgain}
        onNextMode={handleNextMode}
        onNextPuzzle={onNextPuzzle}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold">{puzzle.reference}</h2>
          <span className={`badge ${getModeBadgeClass(mode)}`}>
            {getModeLabel(mode)}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Timer */}
          <div className="font-mono text-lg">
            ⏱️ {formatTime(state.elapsedTime)}
          </div>

          {/* Hints (Easy/Medium only) */}
          {(mode === 'easy' || mode === 'medium') && (
            <button
              className="btn btn-sm btn-outline"
              onClick={useHint}
              disabled={state.hintsRemaining <= 0}
            >
              💡 Hint ({state.hintsRemaining})
            </button>
          )}
        </div>
      </div>

      {/* Mode Selector */}
      <div className="flex flex-wrap gap-2 justify-center">
        {(['easy', 'medium', 'hard', 'extreme'] as DragDropMode[]).map((m) => {
          const unlocked = m === 'easy' || (puzzleProgress && puzzleProgress.modes[
            m === 'medium' ? 'easy' : m === 'hard' ? 'medium' : m === 'extreme' ? 'hard' : 'easy'
          ].completed);

          return (
            <button
              key={m}
              className={`btn btn-sm ${mode === m ? 'btn-primary' : 'btn-ghost'} ${
                !unlocked ? 'btn-disabled opacity-50' : ''
              }`}
              onClick={() => unlocked && handleModeChange(m)}
              disabled={!unlocked}
            >
              {!unlocked && '🔒 '}
              {getModeLabel(m)}
              {puzzleProgress?.modes[m].completed && ' ⭐'}
            </button>
          );
        })}
      </div>

      {/* Warning for Hard/Extreme */}
      {(mode === 'hard' || mode === 'extreme') && !state.hasSubmitted && (
        <div className="alert alert-warning">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>One attempt only! Place all words carefully before submitting.</span>
        </div>
      )}

      {/* Main Game Area */}
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* Verse Display with Drop Zones */}
        <DroppableVerseBoard
          blankedText={puzzle.blankedText}
          fullText={puzzle.fullText}
          mode={mode}
          placements={state.placements}
          slotFeedback={state.slotFeedback}
          expectedWords={expectedWords}
          disabled={state.hasSubmitted}
          onRemoveWord={removeWord}
        />

        {/* Word Bank */}
        <div className="mt-6">
          <h3 className="text-sm font-medium text-base-content/70 mb-2 text-center">
            Word Bank ({state.availableWords.length} remaining)
          </h3>
          <WordBank words={state.availableWords} disabled={state.hasSubmitted} />
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeWord ? (
            <DraggableWordPiece id="overlay" word={activeWord} isDragging />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Controls */}
      <div className="flex justify-center gap-3">
        <button className="btn btn-outline" onClick={resetPuzzle}>
          Reset
        </button>

        {(mode === 'hard' || mode === 'extreme') && (
          <button
            className="btn btn-primary"
            onClick={submitAnswer}
            disabled={!canSubmit}
          >
            Submit Answer
          </button>
        )}
      </div>

      {/* Hint text (if available) */}
      {puzzle.hint && state.elapsedTime > 30 && (
        <div className="text-center text-base-content/60 text-sm italic">
          Hint: {puzzle.hint}
        </div>
      )}
    </div>
  );
}
