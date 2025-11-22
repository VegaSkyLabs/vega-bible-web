import { z } from 'zod';

export const PuzzleLevelSchema = z.object({
  id: z.string(),
  reference: z.string(), // The Answer (e.g. "John 3:16")
  fullText: z.string(),  // Text to show on win
  hint: z.string(),      // Text hint (optional, can be shown at later stages)
  imageClues: z.array(z.string()).length(7), // Array of 7 image paths
});

export const PuzzlePackageSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  coverImage: z.string(),   // Image to show on the menu card
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  puzzles: z.array(PuzzleLevelSchema),
});

// Infer TypeScript types from the Zod schemas
export type PuzzleLevel = z.infer<typeof PuzzleLevelSchema>;
export type PuzzlePackage = z.infer<typeof PuzzlePackageSchema>;
