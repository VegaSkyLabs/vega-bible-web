import 'server-only';
import fs from 'fs/promises';
import path from 'path';
import { PuzzlePackageSchema, PuzzlePackage } from './schema';

const puzzlesDirectory = path.join(process.cwd(), 'content', 'puzzles');

export async function getAllPuzzlePackages(): Promise<PuzzlePackage[]> {
  const fileNames = await fs.readdir(puzzlesDirectory);
  const jsonFileNames = fileNames.filter(name => name.endsWith('.json'));

  const packages: PuzzlePackage[] = [];

  for (const fileName of jsonFileNames) {
    const filePath = path.join(puzzlesDirectory, fileName);
    const fileContents = await fs.readFile(filePath, 'utf-8');
    const json = JSON.parse(fileContents);

    try {
      const parsedPackage = PuzzlePackageSchema.parse(json);
      packages.push(parsedPackage);
    } catch (error) {
      console.error(`Error parsing puzzle package ${fileName}:`, error);
      // Depending on requirements, you might want to throw or skip this package
    }
  }

  return packages;
}

export async function getPuzzlePackage(id: string): Promise<PuzzlePackage | undefined> {
  const filePath = path.join(puzzlesDirectory, `${id}.json`);
  
  try {
    const fileContents = await fs.readFile(filePath, 'utf-8');
    const json = JSON.parse(fileContents);
    const parsedPackage = PuzzlePackageSchema.parse(json);
    return parsedPackage;
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return undefined; // File not found
    }
    console.error(`Error loading puzzle package ${id}:`, error);
    return undefined;
  }
}
