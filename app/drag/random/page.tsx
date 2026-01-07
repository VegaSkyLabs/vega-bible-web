import { getRandomDragPuzzle } from '@/lib/drag-puzzles/loader';
import { VerseCompletionGame } from '@/components/drag-drop';
import Link from 'next/link';

/** Force dynamic rendering to get a new random puzzle on each request */
export const dynamic = 'force-dynamic';

/**
 * Random drag-and-drop puzzle page.
 * Serves a randomly selected verse completion challenge on each visit.
 * Falls back to an empty state if no puzzles are available.
 *
 * @example
 * // Accessible at /drag/random
 */
export default async function RandomDragPuzzlePage() {
  const puzzle = await getRandomDragPuzzle();

  if (!puzzle) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">No Puzzles Available</h1>
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
        <h1 className="text-2xl font-bold">Random Verse Completion</h1>
      </div>

      <VerseCompletionGame puzzle={puzzle} initialMode="easy" />

      <div className="text-center mt-6">
        <Link href="/drag/random" className="btn btn-outline">
          🎲 Try Another Random Puzzle
        </Link>
      </div>
    </div>
  );
}
