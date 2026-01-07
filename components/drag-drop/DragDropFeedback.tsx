'use client';

import type { DragDropGameResult, DragDropMode, PuzzleProgress } from '@/types/drag-drop';
import { isModeUnlocked, getNextMode } from '@/lib/drag-puzzles/storage';

interface DragDropFeedbackProps {
  /** The game result containing score, accuracy, and completion status */
  result: DragDropGameResult;
  /** User's progress on this puzzle across all modes */
  puzzleProgress: PuzzleProgress | null;
  /** The complete verse text to display */
  fullVerseText: string;
  /** Bible reference (e.g., "John 3:16") */
  reference: string;
  /** Callback to replay the current puzzle */
  onPlayAgain: () => void;
  /** Callback to try the next difficulty mode */
  onNextMode?: () => void;
  /** Callback to move to the next puzzle */
  onNextPuzzle?: () => void;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
}

function getModeLabel(mode: DragDropMode): string {
  return mode.charAt(0).toUpperCase() + mode.slice(1);
}

/**
 * End-of-game feedback panel for drag-and-drop verse puzzles.
 * Displays results, score breakdown, progress badges, and navigation actions.
 *
 * @example
 * <DragDropFeedback
 *   result={gameResult}
 *   puzzleProgress={progress}
 *   fullVerseText="For God so loved the world..."
 *   reference="John 3:16"
 *   onPlayAgain={() => resetGame()}
 * />
 */
export function DragDropFeedback({
  result,
  puzzleProgress,
  fullVerseText,
  reference,
  onPlayAgain,
  onNextMode,
  onNextPuzzle,
}: DragDropFeedbackProps) {
  const nextMode = getNextMode(result.mode);
  const canPlayNextMode = nextMode && result.unlockedNextMode;

  return (
    <div className="card bg-base-100 border border-base-300 shadow-xl">
      <div className="card-body items-center text-center">
        {/* Result Header */}
        {result.isCorrect ? (
          <div className="mb-4">
            <div className="text-5xl mb-2">🎉</div>
            <h2 className="card-title text-2xl text-success">Verse Complete!</h2>
          </div>
        ) : (
          <div className="mb-4">
            <div className="text-5xl mb-2">😔</div>
            <h2 className="card-title text-2xl text-error">Not Quite Right</h2>
          </div>
        )}

        {/* Full Verse Display */}
        <div className="bg-base-200 rounded-xl p-4 mb-4 max-w-lg">
          <p className="text-lg italic">&ldquo;{fullVerseText}&rdquo;</p>
          <p className="text-sm text-base-content/70 mt-2 font-medium">— {reference}</p>
        </div>

        {/* Score Breakdown (only if correct) */}
        {result.isCorrect && (
          <div className="stats stats-vertical md:stats-horizontal shadow mb-4">
            <div className="stat">
              <div className="stat-title">Final Score</div>
              <div className="stat-value text-primary">{result.finalScore}</div>
              {result.isNewBest && (
                <div className="stat-desc text-success">New Best!</div>
              )}
            </div>

            <div className="stat">
              <div className="stat-title">Time</div>
              <div className="stat-value text-secondary">{formatTime(result.timeSeconds)}</div>
            </div>

            <div className="stat">
              <div className="stat-title">Accuracy</div>
              <div className="stat-value">{Math.round(result.accuracy * 100)}%</div>
            </div>

            {result.hintsUsed > 0 && (
              <div className="stat">
                <div className="stat-title">Hints Used</div>
                <div className="stat-value text-warning">{result.hintsUsed}</div>
              </div>
            )}
          </div>
        )}

        {/* Unlocked Next Mode */}
        {canPlayNextMode && nextMode && (
          <div className="alert alert-success mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              <strong>{getModeLabel(nextMode)} Mode</strong> unlocked!
            </span>
          </div>
        )}

        {/* Progress Display */}
        {puzzleProgress && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-base-content/70 mb-2">Your Progress</h3>
            <div className="flex gap-2 justify-center">
              {(['easy', 'medium', 'hard', 'extreme'] as DragDropMode[]).map((mode) => {
                const modeProgress = puzzleProgress.modes[mode];
                const unlocked = isModeUnlocked(puzzleProgress, mode);
                const completed = modeProgress.completed;

                return (
                  <div
                    key={mode}
                    className={`badge badge-lg ${
                      completed
                        ? 'badge-success'
                        : unlocked
                        ? 'badge-outline'
                        : 'badge-ghost opacity-50'
                    }`}
                  >
                    {completed ? '⭐' : unlocked ? '○' : '🔒'} {getModeLabel(mode)}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="card-actions justify-center flex-wrap gap-2">
          <button className="btn btn-primary" onClick={onPlayAgain}>
            Play Again
          </button>

          {canPlayNextMode && onNextMode && (
            <button className="btn btn-success" onClick={onNextMode}>
              Try {getModeLabel(nextMode!)} Mode
            </button>
          )}

          {onNextPuzzle && (
            <button className="btn btn-outline" onClick={onNextPuzzle}>
              Next Puzzle
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
