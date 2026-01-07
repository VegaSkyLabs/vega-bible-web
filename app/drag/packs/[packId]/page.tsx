import { getResolvedDragPack, getAllDragPacks } from '@/lib/drag-puzzles/loader';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PageProps {
  /** Route params containing the pack ID */
  params: Promise<{ packId: string }>;
}

/**
 * Generates static paths for all puzzle packs at build time.
 */
export async function generateStaticParams() {
  const packs = await getAllDragPacks();
  return packs.map((pack) => ({
    packId: pack.id,
  }));
}

/**
 * Dynamic page displaying a puzzle pack with its list of verse puzzles.
 * Shows pack metadata (title, description, difficulty) and links to individual puzzles.
 *
 * @example
 * // Accessible at /drag/packs/[packId]
 */
export default async function DragPackPage({ params }: PageProps) {
  const { packId } = await params;
  const pack = await getResolvedDragPack(packId);

  if (!pack) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/drag" className="btn btn-ghost btn-sm gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Verse Completion
        </Link>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">{pack.title}</h1>
        <p className="text-base-content/70 mb-3">{pack.description}</p>
        <div className="flex justify-center gap-2">
          <span className="badge badge-outline">{pack.puzzles.length} puzzles</span>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pack.puzzles.map((puzzle, index) => (
          <Link
            key={puzzle.id}
            href={`/drag/puzzle/${puzzle.id}`}
            className="card bg-base-100 border border-base-300 shadow hover:shadow-lg transition-shadow"
          >
            <div className="card-body">
              <div className="flex items-center gap-2">
                <span className="badge badge-primary badge-sm">{index + 1}</span>
                <h3 className="card-title text-lg">{puzzle.reference}</h3>
              </div>
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
    </div>
  );
}
