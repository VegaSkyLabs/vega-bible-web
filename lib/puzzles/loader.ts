import 'server-only';
import fs from 'fs/promises';
import path from 'path';
import { PuzzleSchema, PackSchema, Puzzle, Pack, ResolvedPack } from './schema';
import { PuzzleWithContext } from './types';

const puzzlesDirectory = path.join(process.cwd(), 'content', 'puzzles');
const packsDirectory = path.join(process.cwd(), 'content', 'packs');

// Load a single puzzle by ID
export async function getPuzzle(id: string): Promise<Puzzle | undefined> {
  try {
    // Find file that starts with the ID (e.g., "1_genesis_1_1.json" for id "1")
    const fileNames = await fs.readdir(puzzlesDirectory);
    const matchingFile = fileNames.find(name => name.startsWith(`${id}_`) && name.endsWith('.json'));

    if (!matchingFile) {
      return undefined;
    }

    const filePath = path.join(puzzlesDirectory, matchingFile);
    const fileContents = await fs.readFile(filePath, 'utf-8');
    const json = JSON.parse(fileContents);
    return PuzzleSchema.parse(json);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return undefined;
    }
    console.error(`Error loading puzzle ${id}:`, error);
    return undefined;
  }
}

// Load all individual puzzles
export async function getAllIndividualPuzzles(): Promise<Puzzle[]> {
  try {
    const fileNames = await fs.readdir(puzzlesDirectory);
    const jsonFileNames = fileNames.filter(name => name.endsWith('.json'));

    const puzzles: Puzzle[] = [];

    for (const fileName of jsonFileNames) {
      const filePath = path.join(puzzlesDirectory, fileName);
      const fileContents = await fs.readFile(filePath, 'utf-8');
      const json = JSON.parse(fileContents);

      try {
        const puzzle = PuzzleSchema.parse(json);
        puzzles.push(puzzle);
      } catch (error) {
        console.error(`Error parsing puzzle ${fileName}:`, error);
      }
    }

    // Sort by numeric ID
    return puzzles.sort((a, b) => parseInt(a.id) - parseInt(b.id));
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

// Load a pack definition (without resolving puzzles)
export async function getPack(id: string): Promise<Pack | undefined> {
  const filePath = path.join(packsDirectory, `${id}.json`);

  try {
    const fileContents = await fs.readFile(filePath, 'utf-8');
    const json = JSON.parse(fileContents);
    return PackSchema.parse(json);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return undefined;
    }
    console.error(`Error loading pack ${id}:`, error);
    return undefined;
  }
}

// Load all pack definitions
export async function getAllPacks(): Promise<Pack[]> {
  try {
    const fileNames = await fs.readdir(packsDirectory);
    const jsonFileNames = fileNames.filter(name => name.endsWith('.json'));

    const packs: Pack[] = [];

    for (const fileName of jsonFileNames) {
      const filePath = path.join(packsDirectory, fileName);
      const fileContents = await fs.readFile(filePath, 'utf-8');
      const json = JSON.parse(fileContents);

      try {
        const pack = PackSchema.parse(json);
        packs.push(pack);
      } catch (error) {
        console.error(`Error parsing pack ${fileName}:`, error);
      }
    }

    return packs;
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

// Resolve a pack with its full puzzle data
export async function getResolvedPack(id: string): Promise<ResolvedPack | undefined> {
  const pack = await getPack(id);
  if (!pack) return undefined;

  const puzzles: Puzzle[] = [];

  for (const puzzleId of pack.puzzleIds) {
    const puzzle = await getPuzzle(puzzleId);
    if (puzzle) {
      puzzles.push(puzzle);
    } else {
      console.warn(`Puzzle ${puzzleId} not found for pack ${id}`);
    }
  }

  if (puzzles.length === 0) {
    console.error(`Pack ${id} has no valid puzzles`);
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

// Get all packs with puzzle counts (for listing)
export async function getAllPuzzlePackages(): Promise<ResolvedPack[]> {
  const packs = await getAllPacks();
  const resolvedPacks: ResolvedPack[] = [];

  for (const pack of packs) {
    const resolved = await getResolvedPack(pack.id);
    if (resolved) {
      resolvedPacks.push(resolved);
    }
  }

  return resolvedPacks;
}

// Alias for backward compatibility
export const getPuzzlePackage = getResolvedPack;

// Get all puzzles with their pack context
export async function getAllPuzzles(): Promise<PuzzleWithContext[]> {
  const packs = await getAllPuzzlePackages();
  return packs.flatMap(pack =>
    pack.puzzles.map(puzzle => ({
      puzzle,
      packId: pack.id,
      packTitle: pack.title,
    }))
  );
}

// Get the daily puzzle based on the current date
export async function getDailyPuzzle(): Promise<Puzzle | undefined> {
  const puzzles = await getAllIndividualPuzzles();
  if (puzzles.length === 0) return undefined;

  // Use date to pick a consistent puzzle for the day
  const today = new Date();
  const daysSinceEpoch = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
  const index = daysSinceEpoch % puzzles.length;

  // Puzzles are already sorted numerically by getAllIndividualPuzzles
  return puzzles[index];
}

// Get a random puzzle
export async function getRandomPuzzle(excludeId?: string): Promise<Puzzle | undefined> {
  const puzzles = await getAllIndividualPuzzles();
  if (puzzles.length === 0) return undefined;

  const available = excludeId
    ? puzzles.filter(p => p.id !== excludeId)
    : puzzles;

  if (available.length === 0) return puzzles[0];

  const randomIndex = Math.floor(Math.random() * available.length);
  return available[randomIndex];
}
