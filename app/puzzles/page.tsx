import Link from 'next/link';
import { getAllIndividualPuzzles } from '@/lib/puzzles/loader';

export default async function PuzzlesPage() {
  const puzzles = await getAllIndividualPuzzles();

  return (
    <div className="puzzles-list-page-container min-h-screen bg-base-200 p-4">
      <div className="max-w-xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">All Puzzles</h1>
          <Link href="/" className="btn btn-outline btn-sm">Back to Packs</Link>
        </div>

        <div className="overflow-x-auto bg-base-100 rounded-box shadow">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th className="w-1/6 text-center">#</th>
                <th className="w-1/2 pl-12">Puzzle</th>
                <th className="w-1/3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {puzzles.map((puzzle, index) => (
                <tr key={puzzle.id}>
                  <td className="font-semibold text-center">{index + 1}</td>
                  <td className="pl-12">
                    <div className="font-bold">Puzzle #{index + 1}</div>
                    <div className="text-xs opacity-50">{puzzle.imageClues.length} clues</div>
                  </td>
                  <td className="text-center">
                    <Link
                      href={`/puzzle/${puzzle.id}?from=puzzles`}
                      className="btn btn-accent btn-sm"
                    >
                      Play
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
