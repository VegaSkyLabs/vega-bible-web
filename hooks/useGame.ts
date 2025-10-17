'use client';

import { useState, useCallback } from 'react';
import { Verse, GameState } from '@/lib/types';
import { verses } from '@/lib/verses';

export function useGame() {
  const [gameState, setGameState] = useState<GameState>({
    currentVerseIndex: 0,
    score: 0,
    attempts: 0,
    isCorrect: null,
    guessedVerses: [],
  });

  const currentVerse = verses[gameState.currentVerseIndex];

  const checkGuess = useCallback((guess: string) => {
    const normalizedGuess = guess.toLowerCase().trim();
    const normalizedReference = currentVerse.reference.toLowerCase();

    // Check if guess matches the reference (flexible matching)
    // Accept formats like: "John 3:16", "john 3 16", "jn 3:16", etc.
    const isMatch =
      normalizedReference.includes(normalizedGuess) ||
      normalizedGuess.includes(normalizedReference.replace(/\s/g, '')) ||
      normalizedGuess === normalizedReference.replace(/\s/g, '');

    setGameState(prev => ({
      ...prev,
      attempts: prev.attempts + 1,
      isCorrect: isMatch,
      score: isMatch ? prev.score + 1 : prev.score,
      guessedVerses: isMatch
        ? [...prev.guessedVerses, currentVerse.id]
        : prev.guessedVerses,
    }));

    return isMatch;
  }, [currentVerse]);

  const nextVerse = useCallback(() => {
    const nextIndex = gameState.currentVerseIndex + 1;

    if (nextIndex >= verses.length) {
      // Game over - could reset or show final score
      return false;
    }

    setGameState(prev => ({
      ...prev,
      currentVerseIndex: nextIndex,
      isCorrect: null,
    }));

    return true;
  }, [gameState.currentVerseIndex]);

  const resetGame = useCallback(() => {
    setGameState({
      currentVerseIndex: 0,
      score: 0,
      attempts: 0,
      isCorrect: null,
      guessedVerses: [],
    });
  }, []);

  const skipVerse = useCallback(() => {
    nextVerse();
  }, [nextVerse]);

  return {
    gameState,
    currentVerse,
    checkGuess,
    nextVerse,
    resetGame,
    skipVerse,
    totalVerses: verses.length,
    isGameOver: gameState.currentVerseIndex >= verses.length - 1 && gameState.isCorrect !== null,
  };
}
