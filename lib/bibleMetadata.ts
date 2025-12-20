/**
 * Bible Book Metadata
 * Used for the guess hint system - comparing guesses to answers
 */

export type Testament = 'Old' | 'New';

export type BookCategory =
  | 'Law'        // Genesis-Deuteronomy
  | 'History'    // Joshua-Esther (OT), Acts (NT)
  | 'Poetry'     // Job-Song of Solomon
  | 'Major Prophets'  // Isaiah-Daniel
  | 'Minor Prophets'  // Hosea-Malachi
  | 'Gospel'     // Matthew-John
  | 'Epistle'    // Romans-Jude
  | 'Apocalyptic'; // Revelation

export interface BookInfo {
  name: string;
  testament: Testament;
  category: BookCategory;
  order: number;  // 1-66, position in Bible
  chapters: number; // Total chapters in the book
}

export const bibleBooks: Record<string, BookInfo> = {
  // Old Testament - Law (1-5)
  'genesis': { name: 'Genesis', testament: 'Old', category: 'Law', order: 1, chapters: 50 },
  'exodus': { name: 'Exodus', testament: 'Old', category: 'Law', order: 2, chapters: 40 },
  'leviticus': { name: 'Leviticus', testament: 'Old', category: 'Law', order: 3, chapters: 27 },
  'numbers': { name: 'Numbers', testament: 'Old', category: 'Law', order: 4, chapters: 36 },
  'deuteronomy': { name: 'Deuteronomy', testament: 'Old', category: 'Law', order: 5, chapters: 34 },

  // Old Testament - History (6-17)
  'joshua': { name: 'Joshua', testament: 'Old', category: 'History', order: 6, chapters: 24 },
  'judges': { name: 'Judges', testament: 'Old', category: 'History', order: 7, chapters: 21 },
  'ruth': { name: 'Ruth', testament: 'Old', category: 'History', order: 8, chapters: 4 },
  '1 samuel': { name: '1 Samuel', testament: 'Old', category: 'History', order: 9, chapters: 31 },
  '2 samuel': { name: '2 Samuel', testament: 'Old', category: 'History', order: 10, chapters: 24 },
  '1 kings': { name: '1 Kings', testament: 'Old', category: 'History', order: 11, chapters: 22 },
  '2 kings': { name: '2 Kings', testament: 'Old', category: 'History', order: 12, chapters: 25 },
  '1 chronicles': { name: '1 Chronicles', testament: 'Old', category: 'History', order: 13, chapters: 29 },
  '2 chronicles': { name: '2 Chronicles', testament: 'Old', category: 'History', order: 14, chapters: 36 },
  'ezra': { name: 'Ezra', testament: 'Old', category: 'History', order: 15, chapters: 10 },
  'nehemiah': { name: 'Nehemiah', testament: 'Old', category: 'History', order: 16, chapters: 13 },
  'esther': { name: 'Esther', testament: 'Old', category: 'History', order: 17, chapters: 10 },

  // Old Testament - Poetry (18-22)
  'job': { name: 'Job', testament: 'Old', category: 'Poetry', order: 18, chapters: 42 },
  'psalms': { name: 'Psalms', testament: 'Old', category: 'Poetry', order: 19, chapters: 150 },
  'proverbs': { name: 'Proverbs', testament: 'Old', category: 'Poetry', order: 20, chapters: 31 },
  'ecclesiastes': { name: 'Ecclesiastes', testament: 'Old', category: 'Poetry', order: 21, chapters: 12 },
  'song of solomon': { name: 'Song of Solomon', testament: 'Old', category: 'Poetry', order: 22, chapters: 8 },

  // Old Testament - Major Prophets (23-27)
  'isaiah': { name: 'Isaiah', testament: 'Old', category: 'Major Prophets', order: 23, chapters: 66 },
  'jeremiah': { name: 'Jeremiah', testament: 'Old', category: 'Major Prophets', order: 24, chapters: 52 },
  'lamentations': { name: 'Lamentations', testament: 'Old', category: 'Major Prophets', order: 25, chapters: 5 },
  'ezekiel': { name: 'Ezekiel', testament: 'Old', category: 'Major Prophets', order: 26, chapters: 48 },
  'daniel': { name: 'Daniel', testament: 'Old', category: 'Major Prophets', order: 27, chapters: 12 },

  // Old Testament - Minor Prophets (28-39)
  'hosea': { name: 'Hosea', testament: 'Old', category: 'Minor Prophets', order: 28, chapters: 14 },
  'joel': { name: 'Joel', testament: 'Old', category: 'Minor Prophets', order: 29, chapters: 3 },
  'amos': { name: 'Amos', testament: 'Old', category: 'Minor Prophets', order: 30, chapters: 9 },
  'obadiah': { name: 'Obadiah', testament: 'Old', category: 'Minor Prophets', order: 31, chapters: 1 },
  'jonah': { name: 'Jonah', testament: 'Old', category: 'Minor Prophets', order: 32, chapters: 4 },
  'micah': { name: 'Micah', testament: 'Old', category: 'Minor Prophets', order: 33, chapters: 7 },
  'nahum': { name: 'Nahum', testament: 'Old', category: 'Minor Prophets', order: 34, chapters: 3 },
  'habakkuk': { name: 'Habakkuk', testament: 'Old', category: 'Minor Prophets', order: 35, chapters: 3 },
  'zephaniah': { name: 'Zephaniah', testament: 'Old', category: 'Minor Prophets', order: 36, chapters: 3 },
  'haggai': { name: 'Haggai', testament: 'Old', category: 'Minor Prophets', order: 37, chapters: 2 },
  'zechariah': { name: 'Zechariah', testament: 'Old', category: 'Minor Prophets', order: 38, chapters: 14 },
  'malachi': { name: 'Malachi', testament: 'Old', category: 'Minor Prophets', order: 39, chapters: 4 },

  // New Testament - Gospels (40-43)
  'matthew': { name: 'Matthew', testament: 'New', category: 'Gospel', order: 40, chapters: 28 },
  'mark': { name: 'Mark', testament: 'New', category: 'Gospel', order: 41, chapters: 16 },
  'luke': { name: 'Luke', testament: 'New', category: 'Gospel', order: 42, chapters: 24 },
  'john': { name: 'John', testament: 'New', category: 'Gospel', order: 43, chapters: 21 },

  // New Testament - History (44)
  'acts': { name: 'Acts', testament: 'New', category: 'History', order: 44, chapters: 28 },

  // New Testament - Epistles (45-65)
  'romans': { name: 'Romans', testament: 'New', category: 'Epistle', order: 45, chapters: 16 },
  '1 corinthians': { name: '1 Corinthians', testament: 'New', category: 'Epistle', order: 46, chapters: 16 },
  '2 corinthians': { name: '2 Corinthians', testament: 'New', category: 'Epistle', order: 47, chapters: 13 },
  'galatians': { name: 'Galatians', testament: 'New', category: 'Epistle', order: 48, chapters: 6 },
  'ephesians': { name: 'Ephesians', testament: 'New', category: 'Epistle', order: 49, chapters: 6 },
  'philippians': { name: 'Philippians', testament: 'New', category: 'Epistle', order: 50, chapters: 4 },
  'colossians': { name: 'Colossians', testament: 'New', category: 'Epistle', order: 51, chapters: 4 },
  '1 thessalonians': { name: '1 Thessalonians', testament: 'New', category: 'Epistle', order: 52, chapters: 5 },
  '2 thessalonians': { name: '2 Thessalonians', testament: 'New', category: 'Epistle', order: 53, chapters: 3 },
  '1 timothy': { name: '1 Timothy', testament: 'New', category: 'Epistle', order: 54, chapters: 6 },
  '2 timothy': { name: '2 Timothy', testament: 'New', category: 'Epistle', order: 55, chapters: 4 },
  'titus': { name: 'Titus', testament: 'New', category: 'Epistle', order: 56, chapters: 3 },
  'philemon': { name: 'Philemon', testament: 'New', category: 'Epistle', order: 57, chapters: 1 },
  'hebrews': { name: 'Hebrews', testament: 'New', category: 'Epistle', order: 58, chapters: 13 },
  'james': { name: 'James', testament: 'New', category: 'Epistle', order: 59, chapters: 5 },
  '1 peter': { name: '1 Peter', testament: 'New', category: 'Epistle', order: 60, chapters: 5 },
  '2 peter': { name: '2 Peter', testament: 'New', category: 'Epistle', order: 61, chapters: 3 },
  '1 john': { name: '1 John', testament: 'New', category: 'Epistle', order: 62, chapters: 5 },
  '2 john': { name: '2 John', testament: 'New', category: 'Epistle', order: 63, chapters: 1 },
  '3 john': { name: '3 John', testament: 'New', category: 'Epistle', order: 64, chapters: 1 },
  'jude': { name: 'Jude', testament: 'New', category: 'Epistle', order: 65, chapters: 1 },

  // New Testament - Apocalyptic (66)
  'revelation': { name: 'Revelation', testament: 'New', category: 'Apocalyptic', order: 66, chapters: 22 },
};

// Helper to get book info (case-insensitive, handles common variations)
export function getBookInfo(bookName: string): BookInfo | null {
  const normalized = bookName.toLowerCase().trim();

  // Direct match
  if (bibleBooks[normalized]) {
    return bibleBooks[normalized];
  }

  // Handle common abbreviations and variations
  const aliases: Record<string, string> = {
    'gen': 'genesis',
    'ex': 'exodus',
    'lev': 'leviticus',
    'num': 'numbers',
    'deut': 'deuteronomy',
    'josh': 'joshua',
    'judg': 'judges',
    '1sam': '1 samuel',
    '2sam': '2 samuel',
    '1kgs': '1 kings',
    '2kgs': '2 kings',
    '1chr': '1 chronicles',
    '2chr': '2 chronicles',
    'neh': 'nehemiah',
    'est': 'esther',
    'ps': 'psalms',
    'psalm': 'psalms',
    'prov': 'proverbs',
    'eccl': 'ecclesiastes',
    'song': 'song of solomon',
    'sos': 'song of solomon',
    'isa': 'isaiah',
    'jer': 'jeremiah',
    'lam': 'lamentations',
    'ezek': 'ezekiel',
    'dan': 'daniel',
    'hos': 'hosea',
    'obad': 'obadiah',
    'mic': 'micah',
    'nah': 'nahum',
    'hab': 'habakkuk',
    'zeph': 'zephaniah',
    'hag': 'haggai',
    'zech': 'zechariah',
    'mal': 'malachi',
    'matt': 'matthew',
    'mt': 'matthew',
    'mk': 'mark',
    'lk': 'luke',
    'jn': 'john',
    'rom': 'romans',
    '1cor': '1 corinthians',
    '2cor': '2 corinthians',
    'gal': 'galatians',
    'eph': 'ephesians',
    'phil': 'philippians',
    'col': 'colossians',
    '1thess': '1 thessalonians',
    '2thess': '2 thessalonians',
    '1tim': '1 timothy',
    '2tim': '2 timothy',
    'phm': 'philemon',
    'heb': 'hebrews',
    'jas': 'james',
    '1pet': '1 peter',
    '2pet': '2 peter',
    '1jn': '1 john',
    '2jn': '2 john',
    '3jn': '3 john',
    'rev': 'revelation',
  };

  if (aliases[normalized]) {
    return bibleBooks[aliases[normalized]];
  }

  return null;
}

// Parse a reference like "John 3:16" into parts
export interface ParsedReference {
  book: string;
  chapter: number;
  verse: number;
  bookInfo: BookInfo | null;
}

export function parseReference(reference: string): ParsedReference | null {
  // Match patterns like "John 3:16", "1 John 3:16", "Song of Solomon 2:1"
  const match = reference.match(/^(.+?)\s+(\d+):(\d+)$/i);

  if (!match) {
    // Try matching just book and chapter (e.g., "John 3")
    const chapterMatch = reference.match(/^(.+?)\s+(\d+)$/i);
    if (chapterMatch) {
      const book = chapterMatch[1].trim();
      return {
        book,
        chapter: parseInt(chapterMatch[2], 10),
        verse: 0,
        bookInfo: getBookInfo(book),
      };
    }

    // Try matching just book name
    const bookInfo = getBookInfo(reference.trim());
    if (bookInfo) {
      return {
        book: reference.trim(),
        chapter: 0,
        verse: 0,
        bookInfo,
      };
    }

    return null;
  }

  const book = match[1].trim();
  const chapter = parseInt(match[2], 10);
  const verse = parseInt(match[3], 10);

  return {
    book,
    chapter,
    verse,
    bookInfo: getBookInfo(book),
  };
}

// Get list of all book names for autocomplete
export function getAllBookNames(): string[] {
  return Object.values(bibleBooks).map(b => b.name);
}
