import PuzzleList from '@/components/PuzzleList';
import { getAllPuzzlePackages } from '@/lib/puzzles/loader'; // Import the new loader

export default async function Home() {
  const packages = await getAllPuzzlePackages(); // Fetch data on the server

  return <PuzzleList packages={packages} />;
}