import { getDailyPuzzle } from '@/lib/puzzles/loader';
import SinglePuzzleGame from '@/components/SinglePuzzleGame';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function DailyPuzzlePage() {
  const puzzle = await getDailyPuzzle();

  if (!puzzle) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-base-200">
      <SinglePuzzleGame puzzle={puzzle} />
    </div>
  );
}
