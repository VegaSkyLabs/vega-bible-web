/**
 * Guess Comparison Logic
 * Compares a guess to the answer and returns hint data
 */

import { parseReference, ParsedReference, BookInfo } from './bibleMetadata';

export type HintStatus = 'correct' | 'close' | 'wrong';
export type Direction = 'up' | 'down' | 'none';

export interface ComparisonResult {
  // The original guess
  guess: string;
  parsedGuess: ParsedReference | null;

  // Book comparison
  book: {
    value: string;
    status: HintStatus;
  };

  // Testament comparison (with direction)
  testament: {
    value: string;
    status: HintStatus;
    direction: Direction; // 'up' = answer is earlier (New→Old), 'down' = answer is later (Old→New)
  };

  // Category comparison
  category: {
    value: string;
    status: HintStatus;
  };

  // Chapter comparison (with direction)
  chapter: {
    value: number;
    status: HintStatus;
    direction: Direction; // 'up' = answer is higher, 'down' = answer is lower
  };

  // Verse comparison (with direction)
  verse: {
    value: number;
    status: HintStatus;
    direction: Direction;
  };
}

// How close chapter/verse needs to be for "close" status
const CLOSE_THRESHOLD = 5;

export function compareGuess(guess: string, answer: string): ComparisonResult {
  const parsedGuess = parseReference(guess);
  const parsedAnswer = parseReference(answer);

  if (!parsedGuess || !parsedAnswer) {
    // Can't parse references - return minimal result
    return {
      guess,
      parsedGuess,
      book: { value: parsedGuess?.book || guess, status: 'wrong' },
      testament: { value: '?', status: 'wrong', direction: 'none' },
      category: { value: '?', status: 'wrong' },
      chapter: { value: parsedGuess?.chapter || 0, status: 'wrong', direction: 'none' },
      verse: { value: parsedGuess?.verse || 0, status: 'wrong', direction: 'none' },
    };
  }

  const guessBook = parsedGuess.bookInfo;
  const answerBook = parsedAnswer.bookInfo;

  // If guess book is not recognized, show "?" for testament/category
  if (!guessBook) {
    return {
      guess,
      parsedGuess,
      book: { value: parsedGuess.book, status: 'wrong' },
      testament: { value: '?', status: 'wrong', direction: 'none' },
      category: { value: '?', status: 'wrong' },
      chapter: { value: parsedGuess.chapter, status: 'wrong', direction: 'none' },
      verse: { value: parsedGuess.verse, status: 'wrong', direction: 'none' },
    };
  }

  // If answer book is not recognized but guess is valid, still show guess info
  // (This handles edge cases where puzzle data might have unusual book names)
  if (!answerBook) {
    return {
      guess,
      parsedGuess,
      book: { value: guessBook.name, status: 'wrong' },
      testament: { value: guessBook.testament, status: 'wrong', direction: 'none' },
      category: { value: guessBook.category, status: 'wrong' },
      chapter: { value: parsedGuess.chapter, status: 'wrong', direction: 'none' },
      verse: { value: parsedGuess.verse, status: 'wrong', direction: 'none' },
    };
  }

  // Book comparison
  const bookMatch = guessBook.name.toLowerCase() === answerBook.name.toLowerCase();
  const bookClose = !bookMatch && guessBook.category === answerBook.category;

  // Testament comparison (Old=0, New=1 for ordering)
  const testamentMatch = guessBook.testament === answerBook.testament;
  const guessTestamentOrder = guessBook.testament === 'Old' ? 0 : 1;
  const answerTestamentOrder = answerBook.testament === 'Old' ? 0 : 1;
  const testamentDirection: Direction = testamentMatch
    ? 'none'
    : answerTestamentOrder > guessTestamentOrder
      ? 'down'  // Answer is later (Old→New)
      : 'up';   // Answer is earlier (New→Old)

  // Category comparison
  const categoryMatch = guessBook.category === answerBook.category;

  // Chapter comparison
  const chapterDiff = parsedAnswer.chapter - parsedGuess.chapter;
  const chapterMatch = parsedGuess.chapter === parsedAnswer.chapter;
  const chapterClose = !chapterMatch && Math.abs(chapterDiff) <= CLOSE_THRESHOLD;
  const chapterDirection: Direction = chapterDiff > 0 ? 'up' : chapterDiff < 0 ? 'down' : 'none';

  // Verse comparison
  const verseDiff = parsedAnswer.verse - parsedGuess.verse;
  const verseMatch = parsedGuess.verse === parsedAnswer.verse;
  const verseClose = !verseMatch && Math.abs(verseDiff) <= CLOSE_THRESHOLD;
  const verseDirection: Direction = verseDiff > 0 ? 'up' : verseDiff < 0 ? 'down' : 'none';

  return {
    guess,
    parsedGuess,
    book: {
      value: guessBook.name,
      status: bookMatch ? 'correct' : bookClose ? 'close' : 'wrong',
    },
    testament: {
      value: guessBook.testament,
      status: testamentMatch ? 'correct' : 'wrong',
      direction: testamentDirection,
    },
    category: {
      value: guessBook.category,
      status: categoryMatch ? 'correct' : 'wrong',
    },
    chapter: {
      value: parsedGuess.chapter,
      status: chapterMatch ? 'correct' : chapterClose ? 'close' : 'wrong',
      direction: chapterMatch ? 'none' : chapterDirection,
    },
    verse: {
      value: parsedGuess.verse,
      status: verseMatch ? 'correct' : verseClose ? 'close' : 'wrong',
      direction: verseMatch ? 'none' : verseDirection,
    },
  };
}

// Check if a guess is fully correct
export function isGuessCorrect(comparison: ComparisonResult): boolean {
  return (
    comparison.book.status === 'correct' &&
    comparison.chapter.status === 'correct' &&
    comparison.verse.status === 'correct'
  );
}

// For progressive mode: check individual parts
export function isBookCorrect(guess: string, answer: string): boolean {
  const parsedGuess = parseReference(guess);
  const parsedAnswer = parseReference(answer);

  if (!parsedGuess?.bookInfo || !parsedAnswer?.bookInfo) return false;

  return parsedGuess.bookInfo.name.toLowerCase() === parsedAnswer.bookInfo.name.toLowerCase();
}

export function isChapterCorrect(guess: string, answer: string): boolean {
  const parsedGuess = parseReference(guess);
  const parsedAnswer = parseReference(answer);

  if (!parsedGuess || !parsedAnswer) return false;

  return (
    isBookCorrect(guess, answer) &&
    parsedGuess.chapter === parsedAnswer.chapter
  );
}
