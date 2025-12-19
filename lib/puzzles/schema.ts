import { z } from 'zod';

// Individual puzzle schema (stored in content/puzzles/)
export const PuzzleSchema = z.object({
  id: z.string(),
  reference: z.string(), // The Answer (e.g. "John 3:16")
  fullText: z.string(),  // Text to show on win
  hint: z.string(),      // Text hint (optional, can be shown at later stages)
  imageClues: z.array(z.string()).min(1), // Flexible: at least 1 image, no max
});

// Pack schema - references puzzles by ID (stored in content/packs/)
export const PackSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  coverImage: z.string(),   // Image to show on the menu card
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  puzzleIds: z.array(z.string()).min(1), // References to puzzle IDs
});

// Resolved pack with full puzzle data (returned by loader)
export const ResolvedPackSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  coverImage: z.string(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  puzzles: z.array(PuzzleSchema),
});

// Infer TypeScript types from the Zod schemas
export type Puzzle = z.infer<typeof PuzzleSchema>;
export type Pack = z.infer<typeof PackSchema>;
export type ResolvedPack = z.infer<typeof ResolvedPackSchema>;

// Legacy aliases for backward compatibility
export type PuzzleLevel = Puzzle;
export type PuzzlePackage = ResolvedPack;
