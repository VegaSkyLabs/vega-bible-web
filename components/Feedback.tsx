'use client';

import { Verse } from '@/lib/types';

interface FeedbackProps {
  isCorrect: boolean | null;
  verse: Verse;
  onNext: () => void;
  isLastVerse: boolean;
}

export default function Feedback({ isCorrect, verse, onNext, isLastVerse }: FeedbackProps) {
  if (isCorrect === null) return null;

  return (
    <div className={`alert ${isCorrect ? 'alert-success' : 'alert-error'} shadow-lg`}>
      <div className="w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isCorrect ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-bold">Correct! 🎉</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-bold">Not quite...</span>
              </>
            )}
          </div>
        </div>

        <div className="mt-4">
          <p className="font-semibold">{verse.reference}</p>
          <p className="text-sm mt-2 italic">{verse.text}</p>
        </div>

        <div className="mt-4 flex justify-end">
          <button className="btn btn-sm" onClick={onNext}>
            {isLastVerse ? 'View Results' : 'Next Verse →'}
          </button>
        </div>
      </div>
    </div>
  );
}
