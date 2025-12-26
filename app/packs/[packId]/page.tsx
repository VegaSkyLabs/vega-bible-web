import { getPuzzlePackage, getAllPuzzlePackages } from '@/lib/puzzles/loader';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PackDetailPageProps {
  params: Promise<{
    packId: string;
  }>;
}

export async function generateStaticParams() {
  const packages = await getAllPuzzlePackages();
  return packages.map((pack) => ({
    packId: pack.id,
  }));
}

export default async function PackDetailPage({ params }: PackDetailPageProps) {
  const resolvedParams = await params;
  const puzzlePackage = await getPuzzlePackage(resolvedParams.packId);

  if (!puzzlePackage) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-base-200 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/packs" className="btn btn-circle btn-ghost btn-sm">
            ←
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{puzzlePackage.title}</h1>
            <p className="text-base-content/70">{puzzlePackage.description}</p>
          </div>
        </div>

        {/* Pack Info */}
        <div className="flex items-center gap-3 mb-8">
          <div className={`badge ${
            puzzlePackage.difficulty === 'Easy' ? 'badge-success' :
            puzzlePackage.difficulty === 'Medium' ? 'badge-warning' : 'badge-error'
          }`}>
            {puzzlePackage.difficulty}
          </div>
          <span className="text-sm text-base-content/60">
            {puzzlePackage.puzzles.length} puzzles
          </span>
        </div>

        {/* Puzzle List */}
        <div className="space-y-3">
          {puzzlePackage.puzzles.map((puzzle, index) => (
            <Link
              key={puzzle.id}
              href={`/puzzle/${puzzle.id}?packId=${puzzlePackage.id}`}
              className="group card card-side bg-base-100 shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
            >
              <figure className="w-24 h-24 flex-shrink-0 overflow-hidden">
                <img
                  src={puzzle.imageClues[0]}
                  alt={`Puzzle ${index + 1}`}
                  className="w-full h-full object-cover blur-md saturate-50 scale-110 transition-all duration-300 group-hover:blur-sm group-hover:saturate-100"
                />
              </figure>
              <div className="card-body p-4 flex-row items-center justify-between">
                <div>
                  <h2 className="card-title text-base">Puzzle {index + 1}</h2>
                  <p className="text-sm text-base-content/60">{puzzle.hint}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="btn btn-primary btn-sm">Play</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Play All Option */}
        <div className="mt-8 text-center">
          <Link href={`/game/${puzzlePackage.id}`} className="btn btn-outline">
            Play All Puzzles in Sequence
          </Link>
        </div>
      </div>
    </div>
  );
}
