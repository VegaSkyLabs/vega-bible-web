'use client';

import { useState, useCallback } from 'react';
import { PuzzleLevel } from '@/lib/puzzles/types';
import { GameState } from '@/types';

export function useGame(puzzles: PuzzleLevel[], initialVerseId?: string) {
  const startIndex = initialVerseId 
    ? puzzles.findIndex(v => v.id === initialVerseId) 
    : 0;

  const [gameState, setGameState] = useState<GameState>({
    currentVerseIndex: startIndex >= 0 ? startIndex : 0,
    score: 0,
    attempts: 0,
    currentStage: 0,
    isCorrect: null,
    isPuzzleFailed: false,
    guessedVerses: [],
  });

  const currentPuzzle = puzzles[gameState.currentVerseIndex];

  const checkGuess = useCallback((guess: string) => {
    if (!currentPuzzle) return false;

    const normalizedGuess = guess.toLowerCase().trim();
    const normalizedReference = currentPuzzle.reference.toLowerCase();

    // Flexible matching
    const isMatch =
      normalizedReference.includes(normalizedGuess) ||
      normalizedGuess.includes(normalizedReference.replace(/\s/g, '')) ||
      normalizedGuess === normalizedReference.replace(/\s/g, '');

    setGameState(prev => {
      // If correct, we don't increment stage, just score
      if (isMatch) {
        return {
          ...prev,
          attempts: prev.attempts + 1,
          isCorrect: true,
          isPuzzleFailed: false,
          score: prev.score + 1,
          guessedVerses: [...prev.guessedVerses, currentPuzzle.id],
        };
      }

      // If incorrect, check if this was the last attempt
      const maxStage = currentPuzzle.imageClues.length - 1;
      if (prev.currentStage >= maxStage) {
        // Out of hints - puzzle failed
        return {
          ...prev,
          attempts: prev.attempts + 1,
          isCorrect: false,
          isPuzzleFailed: true,
        };
      }

      // Still have hints left
      return {
        ...prev,
        attempts: prev.attempts + 1,
        currentStage: prev.currentStage + 1,
        isCorrect: false,
      };
    });

    return isMatch;
  }, [currentPuzzle]);

  const nextVerse = useCallback(() => {
    const nextIndex = gameState.currentVerseIndex + 1;

    if (nextIndex >= puzzles.length) {
      return false;
    }

    setGameState(prev => ({
      ...prev,
      currentVerseIndex: nextIndex,
      isCorrect: null,
      isPuzzleFailed: false,
      currentStage: 0, // Reset stage for new puzzle
    }));

    return true;
  }, [gameState.currentVerseIndex, puzzles.length]);

  const resetGame = useCallback(() => {
    setGameState({
      currentVerseIndex: 0,
      score: 0,
      attempts: 0,
      currentStage: 0,
      isCorrect: null,
      isPuzzleFailed: false,
      guessedVerses: [],
    });
  }, []);

  const skipVerse = useCallback(() => {
    // Skipping shows the answer as failed, user can then click "Next"
    setGameState(prev => ({
      ...prev,
      isCorrect: false,
      isPuzzleFailed: true,
    }));
  }, []);

  // Total stages for current puzzle (based on imageClues count)
  const totalStages = currentPuzzle?.imageClues.length ?? 1;

  return {
    gameState,
    currentPuzzle,
    checkGuess,
    nextVerse,
    resetGame,
    skipVerse,
    totalVerses: puzzles.length,
    totalStages,
    isGameOver: gameState.currentVerseIndex >= puzzles.length - 1 && (gameState.isCorrect === true || gameState.isPuzzleFailed),
  };
}