'use client';

import { useGame } from '@/hooks/useGame';
import VerseImage from './VerseImage';
import GuessInput from './GuessInput';
import Feedback from './Feedback';

export default function Game() {
  const {
    gameState,
    currentVerse,
    checkGuess,
    nextVerse,
    resetGame,
    skipVerse,
    totalVerses,
    isGameOver,
  } = useGame();

  const handleGuess = (guess: string) => {
    checkGuess(guess);
  };

  const handleNext = () => {
    if (!nextVerse()) {
      // Game is over
    }
  };

  if (!currentVerse) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-4">No verses available</h2>
        <button className="btn btn-primary" onClick={resetGame}>
          Restart Game
        </button>
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
                  {Math.round((gameState.score / totalVerses) * 100)}%
                </div>
                <div className="stat-desc">{gameState.attempts} total attempts</div>
              </div>
            </div>
            <button className="btn btn-primary btn-lg" onClick={resetGame}>
              Play Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Bible Verse Guessing Game</h1>
          <div className="stats shadow">
            <div className="stat place-items-center">
              <div className="stat-title">Score</div>
              <div className="stat-value text-primary">{gameState.score}</div>
            </div>
            <div className="stat place-items-center">
              <div className="stat-title">Verse</div>
              <div className="stat-value text-secondary">
                {gameState.currentVerseIndex + 1}/{totalVerses}
              </div>
            </div>
          </div>
        </div>

        {/* Progress */}
        <progress
          className="progress progress-primary w-full mb-8"
          value={gameState.currentVerseIndex + 1}
          max={totalVerses}
        ></progress>

        {/* Game Content */}
        <div className="space-y-8">
          <VerseImage
            imagePath={currentVerse.imagePath}
            reference={currentVerse.reference}
            revealed={gameState.isCorrect !== null}
          />

          {gameState.isCorrect === null ? (
            <div className="flex justify-center">
              <GuessInput
                onGuess={handleGuess}
                onSkip={skipVerse}
                showHint={true}
                hint={currentVerse.hint}
              />
            </div>
          ) : (
            <Feedback
              isCorrect={gameState.isCorrect}
              verse={currentVerse}
              onNext={handleNext}
              isLastVerse={gameState.currentVerseIndex === totalVerses - 1}
            />
          )}
        </div>
      </div>
    </div>
  );
}
