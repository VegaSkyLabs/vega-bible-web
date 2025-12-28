import { getPuzzle, getAllIndividualPuzzles } from '@/lib/puzzles/loader';
import SinglePuzzleGame from '@/components/SinglePuzzleGame';
import { notFound } from 'next/navigation';

interface PuzzlePageProps {
  params: Promise<{
    puzzleId: string;
  }>;
  searchParams: Promise<{
    from?: string;
    packId?: string;
  }>;
}

// Allow static generation of routes
export async function generateStaticParams() {
  const puzzles = await getAllIndividualPuzzles();
  return puzzles.map((puzzle) => ({
    puzzleId: puzzle.id,
  }));
}

export default async function PuzzlePage({ params, searchParams }: PuzzlePageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const puzzle = await getPuzzle(resolvedParams.puzzleId);

  if (!puzzle) {
    notFound();
  }

  // Determine back URL based on where the user came from
  let backUrl = '/';
  if (resolvedSearchParams.packId) {
    backUrl = `/packs/${resolvedSearchParams.packId}`;
  } else if (resolvedSearchParams.from === 'puzzles') {
    backUrl = '/puzzles';
  }

  return <SinglePuzzleGame puzzle={puzzle} backUrl={backUrl} />;
}
