/**
 * Global/Shared Types
 * 
 * These types are used across multiple boundaries of the application
 * (e.g. between Hooks, UI Components, and Data Layers).
 */

export interface GameState {
  currentVerseIndex: number;
  score: number;
  attempts: number;       // Total wrong guesses across the session
  currentStage: number;   // 0-6, representing which image clue is shown
  isCorrect: boolean | null;
  guessedVerses: string[]; // IDs of solved puzzles
}

// You can add other global types here, like UserUser, Theme, etc.
