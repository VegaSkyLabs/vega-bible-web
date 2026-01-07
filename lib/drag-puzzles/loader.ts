import 'server-only';
import fs from 'fs/promises';
import path from 'path';
import {
  DragPuzzleSchema,
  DragPackSchema,
  DragPuzzle,
  DragPack,
  ResolvedDragPack,
} from './schema';

const puzzlesDirectory = path.join(process.cwd(), 'content', 'drag-puzzles');
const packsDirectory = path.join(process.cwd(), 'content', 'drag-packs');

//#region - Puzzle Loading
/**
 * Load a single drag-drop puzzle by ID
 */
export async function getDragPuzzle(id: string): Promise<DragPuzzle | undefined> {
  try {
    const fileNames = await fs.readdir(puzzlesDirectory);
    // Match files like "dd-001.json" or "dd-001_john_3_16.json"
    const matchingFile = fileNames.find(
      (name) => name.startsWith(`${id}.json`) || name.startsWith(`${id}_`)
    );

    if (!matchingFile) {
      return undefined;
    }

    const filePath = path.join(puzzlesDirectory, matchingFile);
    const fileContents = await fs.readFile(filePath, 'utf-8');
    const json = JSON.parse(fileContents);
    return DragPuzzleSchema.parse(json);
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return undefined;
    }
    console.error(`Error loading drag puzzle ${id}:`, error);
    return undefined;
  }
}

/**
 * Load all drag-drop puzzles
 */
export async function getAllDragPuzzles(): Promise<DragPuzzle[]> {
  try {
    const fileNames = await fs.readdir(puzzlesDirectory);
    const jsonFileNames = fileNames.filter((name) => name.endsWith('.json'));

    const puzzles: DragPuzzle[] = [];

    for (const fileName of jsonFileNames) {
      const filePath = path.join(puzzlesDirectory, fileName);
      const fileContents = await fs.readFile(filePath, 'utf-8');
      const json = JSON.parse(fileContents);

      try {
        const puzzle = DragPuzzleSchema.parse(json);
        puzzles.push(puzzle);
      } catch (error) {
        console.error(`Error parsing drag puzzle ${fileName}:`, error);
      }
    }

    // Sort by ID (handles dd-001, dd-002, etc.)
    return puzzles.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}
//#endregion - Puzzle Loading

//#region - Pack Loading
/**
 * Load a drag-drop pack definition (without resolving puzzles)
 */
export async function getDragPack(id: string): Promise<DragPack | undefined> {
  const filePath = path.join(packsDirectory, `${id}.json`);

  try {
    const fileContents = await fs.readFile(filePath, 'utf-8');
    const json = JSON.parse(fileContents);
    return DragPackSchema.parse(json);
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return undefined;
    }
    console.error(`Error loading drag pack ${id}:`, error);
    return undefined;
  }
}

/**
 * Load all drag-drop pack definitions
 */
export async function getAllDragPacks(): Promise<DragPack[]> {
  try {
    const fileNames = await fs.readdir(packsDirectory);
    const jsonFileNames = fileNames.filter((name) => name.endsWith('.json'));

    const packs: DragPack[] = [];

    for (const fileName of jsonFileNames) {
      const filePath = path.join(packsDirectory, fileName);
      const fileContents = await fs.readFile(filePath, 'utf-8');
      const json = JSON.parse(fileContents);

      try {
        const pack = DragPackSchema.parse(json);
        packs.push(pack);
      } catch (error) {
        console.error(`Error parsing drag pack ${fileName}:`, error);
      }
    }

    return packs;
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

/**
 * Resolve a drag-drop pack with its full puzzle data
 */
export async function getResolvedDragPack(
  id: string
): Promise<ResolvedDragPack | undefined> {
  const pack = await getDragPack(id);
  if (!pack) return undefined;

  const puzzles: DragPuzzle[] = [];

  for (const puzzleId of pack.puzzleIds) {
    const puzzle = await getDragPuzzle(puzzleId);
    if (puzzle) {
      puzzles.push(puzzle);
    } else {
      console.warn(`Drag puzzle ${puzzleId} not found for pack ${id}`);
    }
  }

  if (puzzles.length === 0) {
    console.error(`Drag pack ${id} has no valid puzzles`);
    return undefined;
  }

  return {
    id: pack.id,
    title: pack.title,
    description: pack.description,
    coverImage: pack.coverImage,
    difficulty: pack.difficulty,
    puzzles,
  };
}

/**
 * Get all resolved drag-drop packs
 */
export async function getAllResolvedDragPacks(): Promise<ResolvedDragPack[]> {
  const packs = await getAllDragPacks();
  const resolvedPacks: ResolvedDragPack[] = [];

  for (const pack of packs) {
    const resolved = await getResolvedDragPack(pack.id);
    if (resolved) {
      resolvedPacks.push(resolved);
    }
  }

  return resolvedPacks;
}
//#endregion - Pack Loading

//#region - Daily & Random Puzzles
/**
 * Get the daily drag-drop puzzle based on the current date
 */
export async function getDailyDragPuzzle(): Promise<DragPuzzle | undefined> {
  const puzzles = await getAllDragPuzzles();
  if (puzzles.length === 0) return undefined;

  // Use date to pick a consistent puzzle for the day
  const today = new Date();
  const daysSinceEpoch = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
  const index = daysSinceEpoch % puzzles.length;

  return puzzles[index];
}

/**
 * Get a random drag-drop puzzle
 */
export async function getRandomDragPuzzle(
  excludeId?: string
): Promise<DragPuzzle | undefined> {
  const puzzles = await getAllDragPuzzles();
  if (puzzles.length === 0) return undefined;

  const available = excludeId
    ? puzzles.filter((p) => p.id !== excludeId)
    : puzzles;

  if (available.length === 0) return puzzles[0];

  const randomIndex = Math.floor(Math.random() * available.length);
  return available[randomIndex];
}
//#endregion - Daily & Random Puzzles

//#region - Re-exports
export { parseBlankText, extractAllWords, shuffleArray } from './utils';
//#endregion - Re-exports
