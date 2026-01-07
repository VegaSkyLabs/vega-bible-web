import { getDailyDragPuzzle } from '@/lib/drag-puzzles/loader';
import { VerseCompletionGame } from '@/components/drag-drop';
import Link from 'next/link';

/**
 * Daily drag-and-drop puzzle page.
 * Displays a rotating daily verse completion challenge based on the current date.
 * Falls back to an empty state if no puzzles are available.
 *
 * @example
 * // Accessible at /drag/daily
 */
export default async function DailyDragPuzzlePage() {
  const puzzle = await getDailyDragPuzzle();

  if (!puzzle) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">No Daily Puzzle</h1>
        <p className="text-base-content/70 mb-4">
          There are no puzzles available yet. Check back soon!
        </p>
        <Link href="/drag" className="btn btn-primary">
          Back to Verse Completion
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <Link href="/drag" className="btn btn-ghost btn-sm gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>
      </div>

      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-1">Daily Verse Completion</h1>
        <p className="text-base-content/70">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      <VerseCompletionGame puzzle={puzzle} initialMode="easy" />
    </div>
  );
}
