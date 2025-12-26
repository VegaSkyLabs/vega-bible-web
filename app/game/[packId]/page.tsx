import { getPuzzlePackage } from '@/lib/puzzles/loader'; // Use the new loader
import { getAllPuzzlePackages } from '@/lib/puzzles/loader'; // For generateStaticParams
import GameContainer from '@/components/GameContainer';
import { notFound } from 'next/navigation';

interface GamePageProps {
  params: Promise<{
    packId: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Allow static generation of routes
export async function generateStaticParams() {
  const packages = await getAllPuzzlePackages(); // Fetch all package IDs
  return packages.map((pack) => ({
    packId: pack.id,
  }));
}

export default async function GamePage({ params, searchParams }: GamePageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const puzzlePackage = await getPuzzlePackage(resolvedParams.packId);
  const puzzleId = typeof resolvedSearchParams.puzzleId === 'string' ? resolvedSearchParams.puzzleId : undefined;

  if (!puzzlePackage) {
    notFound();
  }

  return <GameContainer puzzlePackage={puzzlePackage} initialPuzzleId={puzzleId} />;
}