'use client';

import { useState, FormEvent } from 'react';

interface GuessInputProps {
  onGuess: (guess: string) => void;
  onSkip: () => void;
  disabled?: boolean;
  showHint?: boolean;
  hint?: string;
}

export default function GuessInput({ onGuess, onSkip, disabled, showHint, hint }: GuessInputProps) {
  const [guess, setGuess] = useState('');
  const [showHintText, setShowHintText] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (guess.trim()) {
      onGuess(guess);
      setGuess('');
    }
  };

  return (
    <div className="w-full max-w-md space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text text-lg">Enter the Bible verse reference:</span>
          </label>
          <input
            type="text"
            placeholder="e.g., John 3:16"
            className="input input-bordered input-lg w-full"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            disabled={disabled}
          />
          <label className="label">
            <span className="label-text-alt">Format: Book Chapter:Verse</span>
          </label>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="btn btn-primary flex-1"
            disabled={disabled || !guess.trim()}
          >
            Submit Guess
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={onSkip}
            disabled={disabled}
          >
            Skip
          </button>
        </div>
      </form>

      {showHint && hint && (
        <div className="text-center">
          {!showHintText ? (
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => setShowHintText(true)}
            >
              Need a hint?
            </button>
          ) : (
            <div className="alert alert-info">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>{hint}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
