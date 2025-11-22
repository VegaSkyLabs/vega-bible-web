// This file now re-exports types inferred from the Zod schema
// This maintains backward compatibility for existing imports of PuzzleLevel and PuzzlePackage.
export type { PuzzleLevel, PuzzlePackage } from './schema';