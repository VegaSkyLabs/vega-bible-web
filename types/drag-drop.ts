/**
 * Drag-and-Drop Puzzle Types
 *
 * Types for the verse completion puzzle mode where players
 * drag words into blank slots to complete Bible verses.
 */

//#region - Game Mode Types
export type DragDropDifficulty = 'Easy' | 'Medium' | 'Hard' | 'Extreme';
export type DragDropMode = 'easy' | 'medium' | 'hard' | 'extreme';
//#endregion - Game Mode Types

//#region - Puzzle Data Types
export interface DragPuzzle {
  id: string;
  reference: string;           // e.g., "John 3:16"
  fullText: string;            // Complete verse text
  blankedText: string;         // Text with {{blank}} markers
  missingWords: string[];      // Words to fill in (order matches blanks)
  distractorWords?: string[];  // Extra wrong words for difficulty
  difficulty: DragDropDifficulty;
  hint?: string;               // Optional hint text
  parTimes?: {                 // Target times for scoring (seconds)
    easy?: number;
    medium?: number;
    hard?: number;
    extreme?: number;
  };
}

export interface DragPack {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  difficulty: DragDropDifficulty;
  puzzleIds: string[];
}

export interface ResolvedDragPack {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  difficulty: DragDropDifficulty;
  puzzles: DragPuzzle[];
}
//#endregion - Puzzle Data Types

//#region - Game State Types
export type SlotFeedback = 'correct' | 'wrong' | 'pending' | 'hidden';

export interface DragDropGameState {
  puzzle: DragPuzzle;
  gameMode: DragDropMode;

  // Slot index → placed word (null if empty)
  placements: (string | null)[];

  // Words remaining in the bank (not yet placed)
  availableWords: string[];

  // Feedback per slot (only shown in easy/medium before submit)
  slotFeedback: SlotFeedback[];

  // Game status
  hasSubmitted: boolean;
  isComplete: boolean;
  isCorrect: boolean;

  // Stats
  startTime: number;
  elapsedTime: number;
  totalDrops: number;      // Total drop attempts (for accuracy calc)
  correctDrops: number;    // Correct drops (for accuracy calc)
  hintsUsed: number;
  hintsRemaining: number;
}
//#endregion - Game State Types

//#region - Game Result Types
export interface DragDropGameResult {
  puzzleId: string;
  mode: DragDropMode;
  isCorrect: boolean;
  timeSeconds: number;
  accuracy: number;           // 0-1 ratio
  hintsUsed: number;
  finalScore: number;
  isNewBest: boolean;
  unlockedNextMode: boolean;
}
//#endregion - Game Result Types

//#region - Player Progress Types
export interface PuzzleModeProgress {
  completed: boolean;
  bestScore?: number;
  bestTime?: number;         // In seconds
  completedAt?: string;      // ISO date string
}

export interface PuzzleProgress {
  puzzleId: string;
  modes: {
    easy: PuzzleModeProgress;
    medium: PuzzleModeProgress;
    hard: PuzzleModeProgress;
    extreme: PuzzleModeProgress;
  };
}

export interface PlayerDragDropProgress {
  version: number;           // For future migrations
  puzzles: Record<string, PuzzleProgress>;
  stats: {
    totalPuzzlesCompleted: number;
    totalScore: number;
    easyCompleted: number;
    mediumCompleted: number;
    hardCompleted: number;
    extremeCompleted: number;
  };
  lastUpdated: string;       // ISO date string
}
//#endregion - Player Progress Types

//#region - Storage Interface
export interface ProgressStorage {
  getProgress(): Promise<PlayerDragDropProgress>;
  saveProgress(progress: PlayerDragDropProgress): Promise<void>;
  getPuzzleProgress(puzzleId: string): Promise<PuzzleProgress | null>;
  savePuzzleResult(result: DragDropGameResult): Promise<PuzzleProgress>;
  clearProgress(): Promise<void>;
}
//#endregion - Storage Interface
