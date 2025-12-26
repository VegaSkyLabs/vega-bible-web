'use client';

import { useState, useCallback, useRef } from 'react';
import VerseImage from './VerseImage';
import GuessInput from './GuessInput';
import GuessHistoryTable from './GuessHistoryTable';
import LastGuessSummary from './LastGuessSummary';
import Link from 'next/link';
import { Puzzle } from '@/lib/puzzles/types';
import { compareGuess, isGuessCorrect, ComparisonResult } from '@/lib/guessComparison';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';

interface SinglePuzzleGameProps {
  puzzle: Puzzle;
  backUrl?: string;
}

export default function SinglePuzzleGame({ puzzle, backUrl = '/' }: SinglePuzzleGameProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isFailed, setIsFailed] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [guessHistory, setGuessHistory] = useState<ComparisonResult[]>([]);
  const historyRef = useRef<HTMLDivElement>(null);

  const totalStages = puzzle.imageClues.length;
  const maxAttempts = Math.max(totalStages + 3, 7); // At least 7 attempts

  const handleGuess = useCallback((guess: string) => {
    setAttempts(prev => prev + 1);

    // Compare the guess to the answer
    const comparison = compareGuess(guess, puzzle.reference);
    setGuessHistory(prev => [...prev, comparison]);

    // Check if fully correct
    if (isGuessCorrect(comparison)) {
      setIsCorrect(true);
      return;
    }

    // Wrong guess - reveal more of the image if available
    if (currentStage < totalStages - 1) {
      setCurrentStage(prev => prev + 1);
    }

    // Check if out of attempts
    if (attempts + 1 >= maxAttempts) {
      setIsFailed(true);
    }
  }, [puzzle.reference, totalStages, currentStage, attempts, maxAttempts]);

  const handleReset = () => {
    setCurrentStage(0);
    setIsCorrect(null);
    setIsFailed(false);
    setAttempts(0);
    setGuessHistory([]);
  };

  const currentImageIndex = Math.min(currentStage, totalStages - 1);
  const currentImagePath = puzzle.imageClues[currentImageIndex] || puzzle.imageClues[0];

  const scrollToHistory = useCallback(() => {
    historyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const lastGuess = guessHistory.length > 0 ? guessHistory[guessHistory.length - 1] : null;

  // Success state
  if (isCorrect === true) {
    return (
      <div className="min-h-screen bg-base-200 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-success mb-4">Correct!</h1>
            <p className="text-2xl font-semibold">{puzzle.reference}</p>
          </div>

          <div className="card bg-base-100 shadow-xl mb-8">
            <div className="card-body">
              <p className="text-lg italic">&ldquo;{puzzle.fullText}&rdquo;</p>
            </div>
          </div>

          <div className="stats shadow mb-8 w-full">
            <div className="stat place-items-center">
              <div className="stat-title">Attempts</div>
              <div className="stat-value">{attempts}</div>
            </div>
            <div className="stat place-items-center">
              <div className="stat-title">Hints Used</div>
              <div className="stat-value">{currentStage}</div>
              <div className="stat-desc">of {totalStages - 1} available</div>
            </div>
          </div>

          {/* Show guess history */}
          {guessHistory.length > 0 && (
            <div className="card bg-base-100 shadow-xl mb-8">
              <div className="card-body">
                <h3 className="text-lg font-bold mb-4">Your Guesses</h3>
                <GuessHistoryTable guesses={guessHistory} />
              </div>
            </div>
          )}

          <div className="flex gap-4 justify-center items-center">
            <button className="btn btn-success" onClick={handleReset}>
              Play Again
            </button>
            <Link href={backUrl} className="text-base-content/70 hover:text-base-content">
              Back
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Failed state - ran out of attempts
  if (isFailed) {
    return (
      <div className="min-h-screen bg-base-200 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-error mb-4">Out of Attempts!</h1>
            <p className="text-xl opacity-70 mb-2">The answer was:</p>
            <p className="text-2xl font-semibold">{puzzle.reference}</p>
          </div>

          <div className="card bg-base-100 shadow-xl mb-8">
            <div className="card-body">
              <p className="text-lg italic">&ldquo;{puzzle.fullText}&rdquo;</p>
            </div>
          </div>

          <div className="stats shadow mb-8 w-full">
            <div className="stat place-items-center">
              <div className="stat-title">Attempts</div>
              <div className="stat-value">{attempts}</div>
            </div>
          </div>

          {/* Show guess history */}
          {guessHistory.length > 0 && (
            <div className="card bg-base-100 shadow-xl mb-8">
              <div className="card-body">
                <h3 className="text-lg font-bold mb-4">Your Guesses</h3>
                <GuessHistoryTable guesses={guessHistory} />
              </div>
            </div>
          )}

          <div className="flex gap-4 justify-center items-center">
            <button className="btn btn-success" onClick={handleReset}>
              Try Again
            </button>
            <Link href={backUrl} className="text-base-content/70 hover:text-base-content">
              Back
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div id="header-nav" className="header-nav flex items-center gap-2 mb-[10px]">
          <Link href={backUrl} className="btn btn-circle btn-ghost btn-sm">
            <ChevronLeftIcon className="h-4 w-4" />
          </Link>
          <h1 className="text-lg font-semibold">Puzzle #{puzzle.id}</h1>
        </div>

        {/* Stage/Hint Indicators */}
        {totalStages > 1 && (
          <>
            <div className="mb-2 flex justify-between items-end">
              <span className="text-xs font-bold uppercase opacity-50">Image Hints</span>
              <span className="text-xs opacity-50">
                {totalStages - currentStage - 1} reveals remaining
              </span>
            </div>
            <div className="flex gap-1 mb-6 h-2">
              {Array.from({ length: totalStages }).map((_, idx) => {
                let colorClass = 'bg-base-300';
                if (idx < currentStage) colorClass = 'bg-error';
                else if (idx === currentStage) colorClass = 'bg-info';

                return (
                  <div
                    key={idx}
                    className={`flex-1 rounded-full transition-colors duration-300 ${colorClass}`}
                  />
                );
              })}
            </div>
          </>
        )}

        {/* Game Content */}
        <div id="game-content" className="game-content space-y-[18px] p-1">
          <div>
            <VerseImage
              imagePath={currentImagePath}
              reference={puzzle.reference}
              revealed={false}
            />
            <div className="text-center text-sm font-medium mt-2">
              {maxAttempts - attempts} guesses left
            </div>
          </div>

          <div className="flex justify-center">
            <GuessInput
              onGuess={handleGuess}
              onSkip={() => setIsFailed(true)}
              skipLabel="Give Up"
              showHint={currentStage >= Math.floor(totalStages / 2)}
              hint={puzzle.hint}
            />
          </div>

          {/* Sticky Last Guess Summary */}
          {lastGuess && (
            <LastGuessSummary id="last-guess-summary" className="last-guess-summary" guess={lastGuess} onViewAll={scrollToHistory} />
          )}

          {/* Full Guess History Table */}
          {guessHistory.length > 0 && (
            <div id="previous-guesses" ref={historyRef} className="previous-guesses card bg-base-100 shadow-xl scroll-mt-4 overflow-visible">
              <div className="card-body p-4">
                <h3 className="text-xs font-bold uppercase opacity-60 mb-4">Previous Guesses</h3>
                <GuessHistoryTable guesses={guessHistory} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
