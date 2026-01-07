import Link from 'next/link';
import { getAllDragPuzzles, getAllDragPacks } from '@/lib/drag-puzzles/loader';

/**
 * Main landing page for the Verse Completion (drag-and-drop) game mode.
 * Displays quick play options (daily/random), puzzle packs, and all available puzzles.
 *
 * @example
 * // Accessible at /drag
 */
export default async function DragModePage() {
  const puzzles = await getAllDragPuzzles();
  const packs = await getAllDragPacks();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Verse Completion</h1>
        <p className="text-base-content/70">
          Drag words into the blanks to complete Bible verses
        </p>
      </div>

      {/* Quick Play Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Link href="/drag/daily" className="card bg-primary text-primary-content shadow-xl hover:scale-105 transition-transform">
          <div className="card-body">
            <h2 className="card-title">
              📅 Daily Puzzle
            </h2>
            <p>A new verse to complete every day</p>
          </div>
        </Link>

        <Link href="/drag/random" className="card bg-secondary text-secondary-content shadow-xl hover:scale-105 transition-transform">
          <div className="card-body">
            <h2 className="card-title">
              🎲 Random Puzzle
            </h2>
            <p>Test your knowledge with a random verse</p>
          </div>
        </Link>
      </div>

      {/* Puzzle Packs */}
      {packs.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Puzzle Packs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {packs.map((pack) => (
              <Link
                key={pack.id}
                href={`/drag/packs/${pack.id}`}
                className="card bg-base-100 border border-base-300 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="card-body">
                  <h3 className="card-title">{pack.title}</h3>
                  <p className="text-base-content/70">{pack.description}</p>
                  <div className="card-actions justify-between items-center mt-2">
                    <span className="badge badge-outline">{pack.puzzleIds.length} puzzles</span>
                    <span className={`badge ${
                      pack.difficulty === 'Easy' ? 'badge-success' :
                      pack.difficulty === 'Medium' ? 'badge-warning' :
                      pack.difficulty === 'Hard' ? 'badge-error' :
                      'badge-secondary'
                    }`}>
                      {pack.difficulty}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* All Puzzles */}
      <section>
        <h2 className="text-2xl font-bold mb-4">All Puzzles</h2>
        {puzzles.length === 0 ? (
          <div className="text-center py-8 text-base-content/60">
            No puzzles available yet. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {puzzles.map((puzzle) => (
              <Link
                key={puzzle.id}
                href={`/drag/puzzle/${puzzle.id}`}
                className="card bg-base-100 border border-base-300 shadow hover:shadow-lg transition-shadow"
              >
                <div className="card-body">
                  <h3 className="card-title text-lg">{puzzle.reference}</h3>
                  <p className="text-sm text-base-content/60 line-clamp-2">
                    {puzzle.hint || puzzle.fullText.substring(0, 60) + '...'}
                  </p>
                  <div className="card-actions justify-end mt-2">
                    <span className={`badge badge-sm ${
                      puzzle.difficulty === 'Easy' ? 'badge-success' :
                      puzzle.difficulty === 'Medium' ? 'badge-warning' :
                      puzzle.difficulty === 'Hard' ? 'badge-error' :
                      'badge-secondary'
                    }`}>
                      {puzzle.difficulty}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
