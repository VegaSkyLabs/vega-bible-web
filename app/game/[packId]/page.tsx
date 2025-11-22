import { getPuzzlePackage } from '@/lib/puzzles/loader'; // Use the new loader
import { getAllPuzzlePackages } from '@/lib/puzzles/loader'; // For generateStaticParams
import GameContainer from '@/components/GameContainer';
import { notFound } from 'next/navigation';

interface GamePageProps {
  params: {
    packId: string;
  };
}

// Allow static generation of routes
export async function generateStaticParams() {
  const packages = await getAllPuzzlePackages(); // Fetch all package IDs
  return packages.map((pack) => ({
    packId: pack.id,
  }));
}

export default async function GamePage({ params }: GamePageProps) {
  const puzzlePackage = await getPuzzlePackage(params.packId);

  if (!puzzlePackage) {
    notFound();
  }

  return <GameContainer puzzlePackage={puzzlePackage} />;
}