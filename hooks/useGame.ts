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
          score: prev.score + 1,
          guessedVerses: [...prev.guessedVerses, currentPuzzle.id],
        };
      } 
      
      // If incorrect, increment stage (reveal next clue) up to 6
      const nextStage = Math.min(prev.currentStage + 1, 6);
      return {
        ...prev,
        attempts: prev.attempts + 1,
        currentStage: nextStage,
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
      guessedVerses: [],
    });
  }, []);

  const skipVerse = useCallback(() => {
    // Skipping counts as a loss/fail for this puzzle? 
    // For now just move next.
    nextVerse();
  }, [nextVerse]);

  return {
    gameState,
    currentPuzzle,
    checkGuess,
    nextVerse,
    resetGame,
    skipVerse,
    totalVerses: puzzles.length,
    isGameOver: gameState.currentVerseIndex >= puzzles.length - 1 && gameState.isCorrect !== null,
  };
}