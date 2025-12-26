import PuzzleList from '@/components/PuzzleList';
import { getAllPuzzlePackages } from '@/lib/puzzles/loader';

export default async function PacksPage() {
  const packages = await getAllPuzzlePackages();

  return <PuzzleList packages={packages} />;
}
