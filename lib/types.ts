export interface Verse {
  id: string;
  reference: string; // e.g., "John 3:16"
  book: string;
  chapter: number;
  verse: number;
  text: string;
  imagePath: string;
  hint?: string;
  category?: string;
}

export interface GameState {
  currentVerseIndex: number;
  score: number;
  attempts: number;
  isCorrect: boolean | null;
  guessedVerses: string[];
}
