import Link from 'next/link';
import { PuzzlePackage } from '@/lib/puzzles/schema'; // Use schema for types

interface PuzzleListProps {
  packages: PuzzlePackage[];
}

export default function PuzzleList({ packages }: PuzzleListProps) {
  return (
    <div className="min-h-screen bg-base-200 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Bible Verse Puzzles</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pack) => (
            <Link 
              href={`/packs/${pack.id}`} 
              key={pack.id}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-200 hover:-translate-y-1"
            >
              <figure className="h-48 bg-base-300 flex items-center justify-center relative overflow-hidden">
                {/* Use the coverImage from the pack if available, otherwise a placeholder */}
                {pack.coverImage ? (
                  // You'd typically use <Image /> here, but for simplicity/placeholder it's fine
                  <img src={pack.coverImage} alt={pack.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-6xl">📚</div>
                )}
                <div className={`absolute top-2 right-2 badge ${
                  pack.difficulty === 'Easy' ? 'badge-success' : 
                  pack.difficulty === 'Medium' ? 'badge-warning' : 'badge-error'
                }`}>
                  {pack.difficulty}
                </div>
              </figure>
              <div className="card-body">
                <h2 className="card-title">
                  {pack.title}
                  <div className="badge badge-secondary badge-sm">{pack.puzzles.length} Puzzles</div>
                </h2>
                <p className="text-base-content/70">
                  {pack.description}
                </p>
                <div className="card-actions justify-end mt-4">
                  <span className="btn btn-primary btn-sm">View Puzzles</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
