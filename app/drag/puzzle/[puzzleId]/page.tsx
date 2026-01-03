import { getDragPuzzle, getAllDragPuzzles } from '@/lib/drag-puzzles/loader';
import { DragDropGame } from '@/components/drag-drop';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ puzzleId: string }>;
}

export async function generateStaticParams() {
  const puzzles = await getAllDragPuzzles();
  return puzzles.map((puzzle) => ({
    puzzleId: puzzle.id,
  }));
}

export default async function DragPuzzlePage({ params }: PageProps) {
  const { puzzleId } = await params;
  const puzzle = await getDragPuzzle(puzzleId);

  if (!puzzle) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <Link href="/drag" className="btn btn-ghost btn-sm gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Puzzles
        </Link>
      </div>

      <DragDropGame puzzle={puzzle} initialMode="easy" />
    </div>
  );
}
