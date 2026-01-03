'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import type {
  DragDropGameState,
  DragDropMode,
  DragDropGameResult,
  SlotFeedback,
  PuzzleProgress,
} from '@/types/drag-drop';
import type { DragPuzzle } from '@/lib/drag-puzzles/schema';
import {
  progressStorage,
  calculateScore,
  getHintAllowance,
  getNextMode,
  isModeUnlocked,
} from '@/lib/drag-puzzles/storage';
import { shuffleArray, extractAllWords, parseBlankText } from '@/lib/drag-puzzles/utils';

//#region - Types
interface UseDragDropGameOptions {
  puzzle: DragPuzzle;
  mode: DragDropMode;
  onComplete?: (result: DragDropGameResult) => void;
}

interface UseDragDropGameReturn {
  // State
  state: DragDropGameState;
  puzzleProgress: PuzzleProgress | null;

  // Derived
  isAllFilled: boolean;
  canSubmit: boolean;
  isModeUnlocked: boolean;
  expectedWords: string[];
  blankCount: number;

  // Actions
  placeWord: (slotIndex: number, word: string) => void;
  removeWord: (slotIndex: number) => void;
  submitAnswer: () => void;
  resetPuzzle: () => void;
  useHint: () => void;
}
//#endregion - Types

//#region - Hook
export function useDragDropGame({
  puzzle,
  mode,
  onComplete,
}: UseDragDropGameOptions): UseDragDropGameReturn {
  //#region - Compute expected words and blanks based on mode
  const { expectedWords, allWords, blankCount } = useMemo(() => {
    if (mode === 'extreme') {
      // Extreme mode: all words from full text
      const words = extractAllWords(puzzle.fullText);
      return { expectedWords: words, allWords: words, blankCount: words.length };
    } else {
      // Normal modes: use blankedText and missingWords
      const segments = parseBlankText(puzzle.blankedText);
      const count = segments.filter((s) => s.type === 'blank').length;
      const distractors = puzzle.distractorWords || [];
      const combined = [...puzzle.missingWords, ...distractors];
      return {
        expectedWords: puzzle.missingWords,
        allWords: combined,
        blankCount: count,
      };
    }
  }, [puzzle, mode]);
  //#endregion - Compute expected words and blanks based on mode

  //#region - Initial state
  const createInitialState = useCallback((): DragDropGameState => {
    const shuffledWords = shuffleArray(allWords);

    return {
      puzzle,
      gameMode: mode,
      placements: Array(blankCount).fill(null),
      availableWords: shuffledWords,
      slotFeedback: Array(blankCount).fill('pending'),
      hasSubmitted: false,
      isComplete: false,
      isCorrect: false,
      startTime: Date.now(),
      elapsedTime: 0,
      totalDrops: 0,
      correctDrops: 0,
      hintsUsed: 0,
      hintsRemaining: getHintAllowance(mode),
    };
  }, [puzzle, mode, allWords, blankCount]);

  const [state, setState] = useState<DragDropGameState>(createInitialState);
  const [puzzleProgress, setPuzzleProgress] = useState<PuzzleProgress | null>(null);
  //#endregion - Initial state

  //#region - Load puzzle progress on mount
  useEffect(() => {
    progressStorage.getPuzzleProgress(puzzle.id).then(setPuzzleProgress);
  }, [puzzle.id]);
  //#endregion - Load puzzle progress on mount

  //#region - Timer effect
  useEffect(() => {
    if (state.isComplete) return;

    const interval = setInterval(() => {
      setState((prev) => ({
        ...prev,
        elapsedTime: Math.floor((Date.now() - prev.startTime) / 1000),
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [state.isComplete, state.startTime]);
  //#endregion - Timer effect

  //#region - Derived state
  const isAllFilled = state.placements.every((p) => p !== null);
  const canSubmit =
    (mode === 'hard' || mode === 'extreme') && isAllFilled && !state.hasSubmitted;
  const modeUnlocked = isModeUnlocked(puzzleProgress, mode);
  //#endregion - Derived state

  //#region - Check if a placement is correct
  const checkPlacement = useCallback(
    (slotIndex: number, word: string): boolean => {
      return expectedWords[slotIndex] === word;
    },
    [expectedWords]
  );
  //#endregion - Check if a placement is correct

  //#region - Place a word in a slot
  const placeWord = useCallback(
    (slotIndex: number, word: string) => {
      if (state.isComplete || state.hasSubmitted) return;
      if (slotIndex < 0 || slotIndex >= blankCount) return;

      setState((prev) => {
        // If slot already has a word, return it to bank
        const existingWord = prev.placements[slotIndex];
        let newAvailable = prev.availableWords.filter((w) => w !== word);
        if (existingWord) {
          newAvailable = [...newAvailable, existingWord];
        }

        // Update placements
        const newPlacements = [...prev.placements];
        newPlacements[slotIndex] = word;

        // Update feedback based on mode
        const newFeedback = [...prev.slotFeedback];
        const isCorrect = checkPlacement(slotIndex, word);

        if (mode === 'easy' || mode === 'medium') {
          // Instant feedback
          newFeedback[slotIndex] = isCorrect ? 'correct' : 'wrong';

          // If wrong in easy/medium, word bounces back
          if (!isCorrect) {
            newPlacements[slotIndex] = null;
            newAvailable = [...newAvailable, word];
            newFeedback[slotIndex] = 'pending';
          }
        } else {
          // Hard/Extreme: no feedback until submit
          newFeedback[slotIndex] = 'hidden';
        }

        // Check if all correct (for easy/medium auto-complete)
        let isComplete = false;
        let allCorrect = false;
        if (mode === 'easy' || mode === 'medium') {
          allCorrect = newPlacements.every(
            (p, i) => p !== null && checkPlacement(i, p)
          );
          isComplete = allCorrect;
        }

        return {
          ...prev,
          placements: newPlacements,
          availableWords: newAvailable,
          slotFeedback: newFeedback,
          totalDrops: prev.totalDrops + 1,
          correctDrops: isCorrect ? prev.correctDrops + 1 : prev.correctDrops,
          isComplete,
          isCorrect: allCorrect,
        };
      });
    },
    [state.isComplete, state.hasSubmitted, blankCount, mode, checkPlacement]
  );
  //#endregion - Place a word in a slot

  //#region - Remove a word from a slot
  const removeWord = useCallback(
    (slotIndex: number) => {
      if (state.isComplete || state.hasSubmitted) return;
      if (slotIndex < 0 || slotIndex >= blankCount) return;

      setState((prev) => {
        const word = prev.placements[slotIndex];
        if (!word) return prev;

        const newPlacements = [...prev.placements];
        newPlacements[slotIndex] = null;

        const newFeedback = [...prev.slotFeedback];
        newFeedback[slotIndex] = 'pending';

        return {
          ...prev,
          placements: newPlacements,
          availableWords: [...prev.availableWords, word],
          slotFeedback: newFeedback,
        };
      });
    },
    [state.isComplete, state.hasSubmitted, blankCount]
  );
  //#endregion - Remove a word from a slot

  //#region - Submit answer (hard/extreme mode)
  const submitAnswer = useCallback(async () => {
    if (!canSubmit) return;

    setState((prev) => {
      // Check all placements
      const newFeedback: SlotFeedback[] = prev.placements.map((word, index) => {
        if (!word) return 'wrong';
        return checkPlacement(index, word) ? 'correct' : 'wrong';
      });

      const allCorrect = newFeedback.every((f) => f === 'correct');
      const correctCount = newFeedback.filter((f) => f === 'correct').length;

      return {
        ...prev,
        slotFeedback: newFeedback,
        hasSubmitted: true,
        isComplete: true,
        isCorrect: allCorrect,
        correctDrops: correctCount,
      };
    });
  }, [canSubmit, checkPlacement]);
  //#endregion - Submit answer (hard/extreme mode)

  //#region - Handle game completion (save progress)
  useEffect(() => {
    if (!state.isComplete) return;

    const accuracy =
      state.totalDrops > 0 ? state.correctDrops / state.totalDrops : 0;
    const parTime = puzzle.parTimes?.[mode];
    const finalScore = calculateScore(
      mode,
      state.elapsedTime,
      accuracy,
      state.hintsUsed,
      parTime
    );

    const result: DragDropGameResult = {
      puzzleId: puzzle.id,
      mode,
      isCorrect: state.isCorrect,
      timeSeconds: state.elapsedTime,
      accuracy,
      hintsUsed: state.hintsUsed,
      finalScore: state.isCorrect ? finalScore : 0,
      isNewBest: false, // Will be determined by storage
      unlockedNextMode: false,
    };

    // Save result and update progress
    if (state.isCorrect) {
      progressStorage.savePuzzleResult(result).then((updatedProgress) => {
        // Check if this unlocked the next mode
        const nextMode = getNextMode(mode);
        if (nextMode && isModeUnlocked(updatedProgress, nextMode)) {
          result.unlockedNextMode = true;
        }

        // Check if new best score
        const modeProgress = updatedProgress.modes[mode];
        if (modeProgress.bestScore === finalScore) {
          result.isNewBest = true;
        }

        setPuzzleProgress(updatedProgress);
        onComplete?.(result);
      });
    } else {
      onComplete?.(result);
    }
  }, [state.isComplete, state.isCorrect, state.elapsedTime, state.totalDrops, state.correctDrops, state.hintsUsed, puzzle.id, puzzle.parTimes, mode, onComplete]);
  //#endregion - Handle game completion (save progress)

  //#region - Reset puzzle
  const resetPuzzle = useCallback(() => {
    setState(createInitialState());
  }, [createInitialState]);
  //#endregion - Reset puzzle

  //#region - Use a hint (reveals one word)
  const useHint = useCallback(() => {
    if (state.hintsRemaining <= 0) return;
    if (state.isComplete || state.hasSubmitted) return;

    setState((prev) => {
      // Find first empty or wrong slot
      const emptyIndex = prev.placements.findIndex(
        (p, i) => p === null || prev.slotFeedback[i] === 'wrong'
      );

      if (emptyIndex === -1) return prev;

      const correctWord = expectedWords[emptyIndex];
      if (!correctWord) return prev;

      // Remove from available words if present
      const newAvailable = prev.availableWords.filter((w) => w !== correctWord);

      // Place the word
      const newPlacements = [...prev.placements];
      newPlacements[emptyIndex] = correctWord;

      const newFeedback = [...prev.slotFeedback];
      newFeedback[emptyIndex] = 'correct';

      // Check if all correct now
      const allCorrect = newPlacements.every(
        (p, i) => p !== null && checkPlacement(i, p)
      );

      return {
        ...prev,
        placements: newPlacements,
        availableWords: newAvailable,
        slotFeedback: newFeedback,
        hintsUsed: prev.hintsUsed + 1,
        hintsRemaining: prev.hintsRemaining - 1,
        correctDrops: prev.correctDrops + 1,
        isComplete: allCorrect,
        isCorrect: allCorrect,
      };
    });
  }, [state.hintsRemaining, state.isComplete, state.hasSubmitted, expectedWords, checkPlacement]);
  //#endregion - Use a hint (reveals one word)

  //#region - Return
  return {
    state,
    puzzleProgress,
    isAllFilled,
    canSubmit,
    isModeUnlocked: modeUnlocked,
    expectedWords,
    blankCount,
    placeWord,
    removeWord,
    submitAnswer,
    resetPuzzle,
    useHint,
  };
  //#endregion - Return
}
//#endregion - Hook
