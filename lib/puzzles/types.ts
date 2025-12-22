// Re-export types from schema
import { Puzzle, Pack, ResolvedPack, PuzzleLevel, PuzzlePackage } from './schema';

export type { Puzzle, Pack, ResolvedPack, PuzzleLevel, PuzzlePackage };

export interface PuzzleWithContext {
  puzzle: Puzzle;
  packId: string;
  packTitle: string;
}
