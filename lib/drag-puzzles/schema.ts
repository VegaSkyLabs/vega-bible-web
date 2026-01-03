import { z } from 'zod';

//#region - Puzzle Schemas
/**
 * Schema for individual drag-drop puzzle (stored in content/drag-puzzles/)
 */
export const DragPuzzleSchema = z.object({
  id: z.string(),
  reference: z.string(),
  fullText: z.string(),
  blankedText: z.string(),
  missingWords: z.array(z.string()).min(1),
  distractorWords: z.array(z.string()).optional().default([]),
  difficulty: z.enum(['Easy', 'Medium', 'Hard', 'Extreme']),
  hint: z.string().optional(),
  parTimes: z.object({
    easy: z.number().optional(),
    medium: z.number().optional(),
    hard: z.number().optional(),
    extreme: z.number().optional(),
  }).optional(),
});

/**
 * Schema for drag-drop pack (stored in content/drag-packs/)
 */
export const DragPackSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  coverImage: z.string(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard', 'Extreme']),
  puzzleIds: z.array(z.string()).min(1),
});

/**
 * Schema for resolved pack with full puzzle data
 */
export const ResolvedDragPackSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  coverImage: z.string(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard', 'Extreme']),
  puzzles: z.array(DragPuzzleSchema),
});
//#endregion - Puzzle Schemas

//#region - Progress Schemas
const PuzzleModeProgressSchema = z.object({
  completed: z.boolean(),
  bestScore: z.number().optional(),
  bestTime: z.number().optional(),
  completedAt: z.string().optional(),
});

const PuzzleProgressSchema = z.object({
  puzzleId: z.string(),
  modes: z.object({
    easy: PuzzleModeProgressSchema,
    medium: PuzzleModeProgressSchema,
    hard: PuzzleModeProgressSchema,
    extreme: PuzzleModeProgressSchema,
  }),
});

export const PlayerDragDropProgressSchema = z.object({
  version: z.number(),
  puzzles: z.record(z.string(), PuzzleProgressSchema),
  stats: z.object({
    totalPuzzlesCompleted: z.number(),
    totalScore: z.number(),
    easyCompleted: z.number(),
    mediumCompleted: z.number(),
    hardCompleted: z.number(),
    extremeCompleted: z.number(),
  }),
  lastUpdated: z.string(),
});
//#endregion - Progress Schemas

//#region - Type Exports
export type DragPuzzle = z.infer<typeof DragPuzzleSchema>;
export type DragPack = z.infer<typeof DragPackSchema>;
export type ResolvedDragPack = z.infer<typeof ResolvedDragPackSchema>;
export type PlayerDragDropProgress = z.infer<typeof PlayerDragDropProgressSchema>;
//#endregion - Type Exports
