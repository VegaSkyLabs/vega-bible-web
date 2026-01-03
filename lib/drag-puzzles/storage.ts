'use client';

import type {
  PlayerDragDropProgress,
  PuzzleProgress,
  ProgressStorage,
  DragDropGameResult,
  DragDropMode,
} from '@/types/drag-drop';
import { PlayerDragDropProgressSchema } from './schema';

//#region - Constants
const STORAGE_KEY = 'vega-drag-drop-progress';
const CURRENT_VERSION = 1;
//#endregion - Constants

//#region - Default Progress Factory
function createDefaultProgress(): PlayerDragDropProgress {
  return {
    version: CURRENT_VERSION,
    puzzles: {},
    stats: {
      totalPuzzlesCompleted: 0,
      totalScore: 0,
      easyCompleted: 0,
      mediumCompleted: 0,
      hardCompleted: 0,
      extremeCompleted: 0,
    },
    lastUpdated: new Date().toISOString(),
  };
}

function createDefaultPuzzleProgress(puzzleId: string): PuzzleProgress {
  return {
    puzzleId,
    modes: {
      easy: { completed: false },
      medium: { completed: false },
      hard: { completed: false },
      extreme: { completed: false },
    },
  };
}
//#endregion - Default Progress Factory

//#region - LocalStorage Implementation
class LocalStorageProgressStorage implements ProgressStorage {
  async getProgress(): Promise<PlayerDragDropProgress> {
    if (typeof window === 'undefined') {
      return createDefaultProgress();
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return createDefaultProgress();
      }

      const parsed = JSON.parse(stored);
      const validated = PlayerDragDropProgressSchema.safeParse(parsed);

      if (!validated.success) {
        console.warn('Invalid progress data, resetting:', validated.error);
        return createDefaultProgress();
      }

      // Handle future migrations here based on version
      return validated.data;
    } catch (error) {
      console.error('Error reading progress:', error);
      return createDefaultProgress();
    }
  }

  async saveProgress(progress: PlayerDragDropProgress): Promise<void> {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      progress.lastUpdated = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  }

  async getPuzzleProgress(puzzleId: string): Promise<PuzzleProgress | null> {
    const progress = await this.getProgress();
    return progress.puzzles[puzzleId] || null;
  }

  async savePuzzleResult(result: DragDropGameResult): Promise<PuzzleProgress> {
    const progress = await this.getProgress();

    // Get or create puzzle progress
    let puzzleProgress = progress.puzzles[result.puzzleId];
    if (!puzzleProgress) {
      puzzleProgress = createDefaultPuzzleProgress(result.puzzleId);
    }

    const mode = result.mode as DragDropMode;
    const modeProgress = puzzleProgress.modes[mode];
    const wasCompleted = modeProgress.completed;

    // Update mode progress if correct
    if (result.isCorrect) {
      modeProgress.completed = true;
      modeProgress.completedAt = new Date().toISOString();

      // Update best score
      if (!modeProgress.bestScore || result.finalScore > modeProgress.bestScore) {
        modeProgress.bestScore = result.finalScore;
      }

      // Update best time
      if (!modeProgress.bestTime || result.timeSeconds < modeProgress.bestTime) {
        modeProgress.bestTime = result.timeSeconds;
      }

      // Update stats if first completion
      if (!wasCompleted) {
        progress.stats.totalPuzzlesCompleted++;
        progress.stats[`${mode}Completed`]++;
      }

      progress.stats.totalScore += result.finalScore;
    }

    // Save back
    progress.puzzles[result.puzzleId] = puzzleProgress;
    await this.saveProgress(progress);

    return puzzleProgress;
  }

  async clearProgress(): Promise<void> {
    if (typeof window === 'undefined') {
      return;
    }

    localStorage.removeItem(STORAGE_KEY);
  }
}
//#endregion - LocalStorage Implementation

//#region - Singleton Export
// Use localStorage by default, can be swapped for backend implementation later
export const progressStorage: ProgressStorage = new LocalStorageProgressStorage();
//#endregion - Singleton Export

//#region - Utility Functions
/**
 * Check if a mode is unlocked for a puzzle
 */
export function isModeUnlocked(
  puzzleProgress: PuzzleProgress | null,
  mode: DragDropMode
): boolean {
  // Easy is always unlocked
  if (mode === 'easy') return true;

  if (!puzzleProgress) return false;

  const unlockRequirements: Record<DragDropMode, DragDropMode | null> = {
    easy: null,
    medium: 'easy',
    hard: 'medium',
    extreme: 'hard',
  };

  const requiredMode = unlockRequirements[mode];
  if (!requiredMode) return true;

  return puzzleProgress.modes[requiredMode].completed;
}

/**
 * Get the next mode to unlock after completing current mode
 */
export function getNextMode(mode: DragDropMode): DragDropMode | null {
  const progression: Record<DragDropMode, DragDropMode | null> = {
    easy: 'medium',
    medium: 'hard',
    hard: 'extreme',
    extreme: null,
  };

  return progression[mode];
}

/**
 * Calculate score based on performance
 */
export function calculateScore(
  mode: DragDropMode,
  timeSeconds: number,
  accuracy: number,
  hintsUsed: number,
  parTime?: number
): number {
  const basePoints: Record<DragDropMode, number> = {
    easy: 500,
    medium: 750,
    hard: 1000,
    extreme: 1500,
  };

  const defaultParTimes: Record<DragDropMode, number> = {
    easy: 30,
    medium: 45,
    hard: 60,
    extreme: 120,
  };

  const par = parTime || defaultParTimes[mode];

  // Time bonus: faster = more points (max 200 bonus)
  const timeBonus = Math.max(0, Math.min(200, (par - timeSeconds) * 5));

  // Accuracy multiplier: 1.0 for perfect, minimum 0.5
  const accuracyMultiplier = 0.5 + accuracy * 0.5;

  // Hint penalty: 50 points per hint
  const hintPenalty = hintsUsed * 50;

  const finalScore = Math.round(
    (basePoints[mode] + timeBonus) * accuracyMultiplier - hintPenalty
  );

  return Math.max(0, finalScore);
}

/**
 * Get hint allowance based on mode
 */
export function getHintAllowance(mode: DragDropMode): number {
  const allowances: Record<DragDropMode, number> = {
    easy: 2,
    medium: 1,
    hard: 0,
    extreme: 0,
  };

  return allowances[mode];
}
//#endregion - Utility Functions
