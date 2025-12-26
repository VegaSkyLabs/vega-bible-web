import { getRandomPuzzle } from '@/lib/puzzles/loader';
import SinglePuzzleGame from '@/components/SinglePuzzleGame';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function RandomPuzzlePage() {
  const puzzle = await getRandomPuzzle();

  if (!puzzle) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-base-200">
      <SinglePuzzleGame puzzle={puzzle} />
    </div>
  );
}
