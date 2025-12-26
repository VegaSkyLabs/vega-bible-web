'use client';

import { useGame } from '@/hooks/useGame';
import VerseImage from './VerseImage';
import GuessInput from './GuessInput';
import Feedback from './Feedback';
import Link from 'next/link';
import { PuzzlePackage } from '@/lib/puzzles/types';

interface GameContainerProps {
  puzzlePackage: PuzzlePackage;
  initialPuzzleId?: string;
}

export default function GameContainer({ puzzlePackage, initialPuzzleId }: GameContainerProps) {
  const {
    gameState,
    currentPuzzle,
    checkGuess,
    nextVerse,
    resetGame,
    skipVerse,
    totalVerses,
    totalStages,
    isGameOver,
  } = useGame(puzzlePackage.puzzles, initialPuzzleId);

  const handleGuess = (guess: string) => {
    checkGuess(guess);
  };

  const handleNext = () => {
    if (!nextVerse()) {
      // Game is over
    }
  };

  if (!currentPuzzle) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-4">No puzzles available</h2>
        <Link href="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  if (isGameOver) {
    return (
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold mb-8">Game Over! 🎊</h1>
            <div className="stats stats-vertical lg:stats-horizontal shadow mb-8">
              <div className="stat">
                <div className="stat-title">Score</div>
                <div className="stat-value">{gameState.score}</div>
                <div className="stat-desc">out of {totalVerses}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Accuracy</div>
                <div className="stat-value">
                  {Math.round((gameState.score / gameState.attempts) * 100 || 0)}%
                </div>
                <div className="stat-desc">{gameState.attempts} total attempts</div>
              </div>
            </div>
            <div className="flex gap-4 justify-center">
              <button className="btn btn-primary" onClick={resetGame}>
                Play Again
              </button>
              <Link href="/" className="btn btn-outline">
                Back to List
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Determine which image to show based on stage
  // Ensure we don't go out of bounds if something goes wrong
  const currentImageIndex = Math.min(gameState.currentStage, totalStages - 1);
  const currentImagePath = currentPuzzle.imageClues[currentImageIndex] || currentPuzzle.imageClues[0];

  return (
    <div className="min-h-screen bg-base-200 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="btn btn-circle btn-ghost btn-sm">
              ←
            </Link>
            <div>
              <h1 className="text-2xl font-bold">{puzzlePackage.title}</h1>
              <p className="text-xs opacity-60">Puzzle {gameState.currentVerseIndex + 1} of {totalVerses}</p>
            </div>
          </div>
          <div className="stats shadow scale-90">
            <div className="stat place-items-center p-2">
              <div className="stat-title text-xs">Score</div>
              <div className="stat-value text-primary text-2xl">{gameState.score}</div>
            </div>
          </div>
        </div>

        {/* Progress Bar for Puzzles */}
        <progress
          className="progress progress-primary w-full mb-4"
          value={gameState.currentVerseIndex}
          max={totalVerses}
        ></progress>

        {/* Stage/Hint Indicators */}
        <div className="mb-2 flex justify-between items-end">
          <span className="text-xs font-bold uppercase opacity-50">Hint Level</span>
          <span className="text-xs opacity-50">
            {totalStages - gameState.currentStage} attempts remaining for this puzzle
          </span>
        </div>
        <div className="flex gap-1 mb-6 h-2">
          {Array.from({ length: totalStages }).map((_, idx) => {
            // 0..currentStage are "used" (red/orange), rest are "available" (gray)
            let colorClass = 'bg-base-300';
            if (idx < gameState.currentStage) colorClass = 'bg-error'; // Used hint
            else if (idx === gameState.currentStage) colorClass = 'bg-info'; // Current level

            return (
              <div
                key={idx}
                className={`flex-1 rounded-full transition-colors duration-300 ${colorClass}`}
              />
            );
          })}
        </div>

        {/* Game Content */}
        <div className="space-y-8">
          <VerseImage
            imagePath={currentImagePath}
            reference={currentPuzzle.reference}
            revealed={gameState.isCorrect === true || gameState.isPuzzleFailed}
          />

          {gameState.isCorrect === true ? (
            <Feedback
              isCorrect={true}
              puzzle={currentPuzzle}
              onNext={handleNext}
              isLastVerse={gameState.currentVerseIndex === totalVerses - 1}
            />
          ) : gameState.isPuzzleFailed ? (
            <Feedback
              isCorrect={false}
              puzzle={currentPuzzle}
              onNext={handleNext}
              isLastVerse={gameState.currentVerseIndex === totalVerses - 1}
            />
          ) : (
            <div className="flex justify-center">
              <GuessInput
                onGuess={handleGuess}
                onSkip={skipVerse}
                showHint={gameState.currentStage >= Math.floor(totalStages / 2)} // Show hint after half the stages
                hint={currentPuzzle.hint}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}