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
  versesPerChapter: number[]; // Verse count for each chapter (index 0 = chapter 1)
}

export const bibleBooks: Record<string, BookInfo> = {
  // Old Testament - Law (1-5)
  'genesis': { name: 'Genesis', testament: 'Old', category: 'Law', order: 1, chapters: 50, versesPerChapter: [31,25,24,26,32,22,24,22,29,32,32,20,18,24,21,16,27,33,38,18,34,24,20,67,34,35,46,22,35,43,55,32,20,31,29,43,36,30,23,23,57,38,34,34,28,34,31,22,33,26] },
  'exodus': { name: 'Exodus', testament: 'Old', category: 'Law', order: 2, chapters: 40, versesPerChapter: [22,25,22,31,23,30,25,32,35,29,10,51,22,31,27,36,16,27,25,26,36,31,33,18,40,37,21,43,46,38,18,35,23,35,35,38,29,31,43,38] },
  'leviticus': { name: 'Leviticus', testament: 'Old', category: 'Law', order: 3, chapters: 27, versesPerChapter: [17,16,17,35,19,30,38,36,24,20,47,8,59,57,33,34,16,30,37,27,24,33,44,23,55,46,34] },
  'numbers': { name: 'Numbers', testament: 'Old', category: 'Law', order: 4, chapters: 36, versesPerChapter: [54,34,51,49,31,27,89,26,23,36,35,16,33,45,41,50,13,32,22,29,35,41,30,25,18,65,23,31,40,16,54,42,56,29,34,13] },
  'deuteronomy': { name: 'Deuteronomy', testament: 'Old', category: 'Law', order: 5, chapters: 34, versesPerChapter: [46,37,29,49,33,25,26,20,29,22,32,32,18,29,23,22,20,22,21,20,23,30,25,22,19,19,26,68,29,20,30,52,29,12] },

  // Old Testament - History (6-17)
  'joshua': { name: 'Joshua', testament: 'Old', category: 'History', order: 6, chapters: 24, versesPerChapter: [18,24,17,24,15,27,26,35,27,43,23,24,33,15,63,10,18,28,51,9,45,34,16,33] },
  'judges': { name: 'Judges', testament: 'Old', category: 'History', order: 7, chapters: 21, versesPerChapter: [36,23,31,24,31,40,25,35,57,18,40,15,25,20,20,31,13,31,30,48,25] },
  'ruth': { name: 'Ruth', testament: 'Old', category: 'History', order: 8, chapters: 4, versesPerChapter: [22,23,17,22] },
  '1 samuel': { name: '1 Samuel', testament: 'Old', category: 'History', order: 9, chapters: 31, versesPerChapter: [28,36,21,22,12,21,17,22,27,27,15,25,23,52,35,23,58,30,24,42,15,23,29,22,44,25,12,25,11,31,13] },
  '2 samuel': { name: '2 Samuel', testament: 'Old', category: 'History', order: 10, chapters: 24, versesPerChapter: [27,32,39,12,25,23,29,18,13,19,27,31,39,33,37,23,29,33,43,26,22,51,39,25] },
  '1 kings': { name: '1 Kings', testament: 'Old', category: 'History', order: 11, chapters: 22, versesPerChapter: [53,46,28,34,18,38,51,66,28,29,43,33,34,31,34,34,24,46,21,43,29,53] },
  '2 kings': { name: '2 Kings', testament: 'Old', category: 'History', order: 12, chapters: 25, versesPerChapter: [18,25,27,44,27,33,20,29,37,36,21,21,25,29,38,20,41,37,37,21,26,20,37,20,30] },
  '1 chronicles': { name: '1 Chronicles', testament: 'Old', category: 'History', order: 13, chapters: 29, versesPerChapter: [54,55,24,43,26,81,40,40,44,14,47,40,14,17,29,43,27,17,19,8,30,19,32,31,31,32,34,21,30] },
  '2 chronicles': { name: '2 Chronicles', testament: 'Old', category: 'History', order: 14, chapters: 36, versesPerChapter: [17,18,17,22,14,42,22,18,31,19,23,16,22,15,19,14,19,34,11,37,20,12,21,27,28,23,9,27,36,27,21,33,25,33,27,23] },
  'ezra': { name: 'Ezra', testament: 'Old', category: 'History', order: 15, chapters: 10, versesPerChapter: [11,70,13,24,17,22,28,36,15,44] },
  'nehemiah': { name: 'Nehemiah', testament: 'Old', category: 'History', order: 16, chapters: 13, versesPerChapter: [11,20,32,23,19,19,73,18,38,39,36,47,31] },
  'esther': { name: 'Esther', testament: 'Old', category: 'History', order: 17, chapters: 10, versesPerChapter: [22,23,15,17,14,14,10,17,32,3] },

  // Old Testament - Poetry (18-22)
  'job': { name: 'Job', testament: 'Old', category: 'Poetry', order: 18, chapters: 42, versesPerChapter: [22,13,26,21,27,30,21,22,35,22,20,25,28,22,35,22,16,21,29,29,34,30,17,25,6,14,23,28,25,31,40,22,33,37,16,33,24,41,30,24,34,17] },
  'psalms': { name: 'Psalms', testament: 'Old', category: 'Poetry', order: 19, chapters: 150, versesPerChapter: [6,12,8,8,12,10,17,9,20,18,7,8,6,7,5,11,15,50,14,9,13,31,6,10,22,12,14,9,11,12,24,11,22,22,28,12,40,22,13,17,13,11,5,26,17,11,9,14,20,23,19,9,6,7,23,13,11,11,17,12,8,12,11,10,13,20,7,35,36,5,24,20,28,23,10,12,20,72,13,19,16,8,18,12,13,17,7,18,52,17,16,15,5,23,11,13,12,9,9,5,8,28,22,35,45,48,43,13,31,7,10,10,9,8,18,19,2,29,176,7,8,9,4,8,5,6,5,6,8,8,3,18,3,3,21,26,9,8,24,13,10,7,12,15,21,10,20,14,9,6] },
  'proverbs': { name: 'Proverbs', testament: 'Old', category: 'Poetry', order: 20, chapters: 31, versesPerChapter: [33,22,35,27,23,35,27,36,18,32,31,28,25,35,33,33,28,24,29,30,31,29,35,34,28,28,27,28,27,33,31] },
  'ecclesiastes': { name: 'Ecclesiastes', testament: 'Old', category: 'Poetry', order: 21, chapters: 12, versesPerChapter: [18,26,22,16,20,12,29,17,18,20,10,14] },
  'song of solomon': { name: 'Song of Solomon', testament: 'Old', category: 'Poetry', order: 22, chapters: 8, versesPerChapter: [17,17,11,16,16,13,13,14] },

  // Old Testament - Major Prophets (23-27)
  'isaiah': { name: 'Isaiah', testament: 'Old', category: 'Major Prophets', order: 23, chapters: 66, versesPerChapter: [31,22,26,6,30,13,25,22,21,34,16,6,22,32,9,14,14,7,25,6,17,25,18,23,12,21,13,29,24,33,9,20,24,17,10,22,38,22,8,31,29,25,28,28,25,13,15,22,26,11,23,15,12,17,13,12,21,14,21,22,11,12,19,12,25,24] },
  'jeremiah': { name: 'Jeremiah', testament: 'Old', category: 'Major Prophets', order: 24, chapters: 52, versesPerChapter: [19,37,25,31,31,30,34,22,26,25,23,17,27,22,21,21,27,23,15,18,14,30,40,10,38,24,22,17,32,24,40,44,26,22,19,32,21,28,18,16,18,22,13,30,5,28,7,47,39,46,64,34] },
  'lamentations': { name: 'Lamentations', testament: 'Old', category: 'Major Prophets', order: 25, chapters: 5, versesPerChapter: [22,22,66,22,22] },
  'ezekiel': { name: 'Ezekiel', testament: 'Old', category: 'Major Prophets', order: 26, chapters: 48, versesPerChapter: [28,10,27,17,17,14,27,18,11,22,25,28,23,23,8,63,24,32,14,49,32,31,49,27,17,21,36,26,21,26,18,32,33,31,15,38,28,23,29,49,26,20,27,31,25,24,23,35] },
  'daniel': { name: 'Daniel', testament: 'Old', category: 'Major Prophets', order: 27, chapters: 12, versesPerChapter: [21,49,30,37,31,28,28,27,27,21,45,13] },

  // Old Testament - Minor Prophets (28-39)
  'hosea': { name: 'Hosea', testament: 'Old', category: 'Minor Prophets', order: 28, chapters: 14, versesPerChapter: [11,23,5,19,15,11,16,14,17,15,12,14,16,9] },
  'joel': { name: 'Joel', testament: 'Old', category: 'Minor Prophets', order: 29, chapters: 3, versesPerChapter: [20,32,21] },
  'amos': { name: 'Amos', testament: 'Old', category: 'Minor Prophets', order: 30, chapters: 9, versesPerChapter: [15,16,15,13,27,14,17,14,15] },
  'obadiah': { name: 'Obadiah', testament: 'Old', category: 'Minor Prophets', order: 31, chapters: 1, versesPerChapter: [21] },
  'jonah': { name: 'Jonah', testament: 'Old', category: 'Minor Prophets', order: 32, chapters: 4, versesPerChapter: [17,10,10,11] },
  'micah': { name: 'Micah', testament: 'Old', category: 'Minor Prophets', order: 33, chapters: 7, versesPerChapter: [16,13,12,13,15,16,20] },
  'nahum': { name: 'Nahum', testament: 'Old', category: 'Minor Prophets', order: 34, chapters: 3, versesPerChapter: [15,13,19] },
  'habakkuk': { name: 'Habakkuk', testament: 'Old', category: 'Minor Prophets', order: 35, chapters: 3, versesPerChapter: [17,20,19] },
  'zephaniah': { name: 'Zephaniah', testament: 'Old', category: 'Minor Prophets', order: 36, chapters: 3, versesPerChapter: [18,15,20] },
  'haggai': { name: 'Haggai', testament: 'Old', category: 'Minor Prophets', order: 37, chapters: 2, versesPerChapter: [15,23] },
  'zechariah': { name: 'Zechariah', testament: 'Old', category: 'Minor Prophets', order: 38, chapters: 14, versesPerChapter: [21,13,10,14,11,15,14,23,17,12,17,14,9,21] },
  'malachi': { name: 'Malachi', testament: 'Old', category: 'Minor Prophets', order: 39, chapters: 4, versesPerChapter: [14,17,18,6] },

  // New Testament - Gospels (40-43)
  'matthew': { name: 'Matthew', testament: 'New', category: 'Gospel', order: 40, chapters: 28, versesPerChapter: [25,23,17,25,48,34,29,34,38,42,30,50,58,36,39,28,27,35,30,34,46,46,39,51,46,75,66,20] },
  'mark': { name: 'Mark', testament: 'New', category: 'Gospel', order: 41, chapters: 16, versesPerChapter: [45,28,35,41,43,56,37,38,50,52,33,44,37,72,47,20] },
  'luke': { name: 'Luke', testament: 'New', category: 'Gospel', order: 42, chapters: 24, versesPerChapter: [80,52,38,44,39,49,50,56,62,42,54,59,35,35,32,31,37,43,48,47,38,71,56,53] },
  'john': { name: 'John', testament: 'New', category: 'Gospel', order: 43, chapters: 21, versesPerChapter: [51,25,36,54,47,71,53,59,41,42,57,50,38,31,27,33,26,40,42,31,25] },

  // New Testament - History (44)
  'acts': { name: 'Acts', testament: 'New', category: 'History', order: 44, chapters: 28, versesPerChapter: [26,47,26,37,42,15,60,40,43,48,30,25,52,28,41,40,34,28,41,38,40,30,35,27,27,32,44,31] },

  // New Testament - Epistles (45-65)
  'romans': { name: 'Romans', testament: 'New', category: 'Epistle', order: 45, chapters: 16, versesPerChapter: [32,29,31,25,21,23,25,39,33,21,36,21,14,23,33,27] },
  '1 corinthians': { name: '1 Corinthians', testament: 'New', category: 'Epistle', order: 46, chapters: 16, versesPerChapter: [31,16,23,21,13,20,40,13,27,33,34,31,13,40,58,24] },
  '2 corinthians': { name: '2 Corinthians', testament: 'New', category: 'Epistle', order: 47, chapters: 13, versesPerChapter: [24,17,18,18,21,18,16,24,15,18,33,21,14] },
  'galatians': { name: 'Galatians', testament: 'New', category: 'Epistle', order: 48, chapters: 6, versesPerChapter: [24,21,29,31,26,18] },
  'ephesians': { name: 'Ephesians', testament: 'New', category: 'Epistle', order: 49, chapters: 6, versesPerChapter: [23,22,21,32,33,24] },
  'philippians': { name: 'Philippians', testament: 'New', category: 'Epistle', order: 50, chapters: 4, versesPerChapter: [30,30,21,23] },
  'colossians': { name: 'Colossians', testament: 'New', category: 'Epistle', order: 51, chapters: 4, versesPerChapter: [29,23,25,18] },
  '1 thessalonians': { name: '1 Thessalonians', testament: 'New', category: 'Epistle', order: 52, chapters: 5, versesPerChapter: [10,20,13,18,28] },
  '2 thessalonians': { name: '2 Thessalonians', testament: 'New', category: 'Epistle', order: 53, chapters: 3, versesPerChapter: [12,17,18] },
  '1 timothy': { name: '1 Timothy', testament: 'New', category: 'Epistle', order: 54, chapters: 6, versesPerChapter: [20,15,16,16,25,21] },
  '2 timothy': { name: '2 Timothy', testament: 'New', category: 'Epistle', order: 55, chapters: 4, versesPerChapter: [18,26,17,22] },
  'titus': { name: 'Titus', testament: 'New', category: 'Epistle', order: 56, chapters: 3, versesPerChapter: [16,15,15] },
  'philemon': { name: 'Philemon', testament: 'New', category: 'Epistle', order: 57, chapters: 1, versesPerChapter: [25] },
  'hebrews': { name: 'Hebrews', testament: 'New', category: 'Epistle', order: 58, chapters: 13, versesPerChapter: [14,18,19,16,14,20,28,13,28,39,40,29,25] },
  'james': { name: 'James', testament: 'New', category: 'Epistle', order: 59, chapters: 5, versesPerChapter: [27,26,18,17,20] },
  '1 peter': { name: '1 Peter', testament: 'New', category: 'Epistle', order: 60, chapters: 5, versesPerChapter: [25,25,22,19,14] },
  '2 peter': { name: '2 Peter', testament: 'New', category: 'Epistle', order: 61, chapters: 3, versesPerChapter: [21,22,18] },
  '1 john': { name: '1 John', testament: 'New', category: 'Epistle', order: 62, chapters: 5, versesPerChapter: [10,29,24,21,21] },
  '2 john': { name: '2 John', testament: 'New', category: 'Epistle', order: 63, chapters: 1, versesPerChapter: [13] },
  '3 john': { name: '3 John', testament: 'New', category: 'Epistle', order: 64, chapters: 1, versesPerChapter: [14] },
  'jude': { name: 'Jude', testament: 'New', category: 'Epistle', order: 65, chapters: 1, versesPerChapter: [25] },

  // New Testament - Apocalyptic (66)
  'revelation': { name: 'Revelation', testament: 'New', category: 'Apocalyptic', order: 66, chapters: 22, versesPerChapter: [20,29,22,11,14,17,17,13,21,11,19,17,18,20,8,21,18,24,21,15,27,21] },
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

// All categories in Bible order with their books
export const CATEGORY_BOOKS: Record<BookCategory, string[]> = {
  Law: ['Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy'],
  History: [
    'Joshua',
    'Judges',
    'Ruth',
    '1 Samuel',
    '2 Samuel',
    '1 Kings',
    '2 Kings',
    '1 Chronicles',
    '2 Chronicles',
    'Ezra',
    'Nehemiah',
    'Esther',
    'Acts',
  ],
  Poetry: ['Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Solomon'],
  'Major Prophets': ['Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel'],
  'Minor Prophets': [
    'Hosea',
    'Joel',
    'Amos',
    'Obadiah',
    'Jonah',
    'Micah',
    'Nahum',
    'Habakkuk',
    'Zephaniah',
    'Haggai',
    'Zechariah',
    'Malachi',
  ],
  Gospel: ['Matthew', 'Mark', 'Luke', 'John'],
  Epistle: [
    'Romans',
    '1 Corinthians',
    '2 Corinthians',
    'Galatians',
    'Ephesians',
    'Philippians',
    'Colossians',
    '1 Thessalonians',
    '2 Thessalonians',
    '1 Timothy',
    '2 Timothy',
    'Titus',
    'Philemon',
    'Hebrews',
    'James',
    '1 Peter',
    '2 Peter',
    '1 John',
    '2 John',
    '3 John',
    'Jude',
  ],
  Apocalyptic: ['Revelation'],
};

export const ALL_CATEGORIES = Object.keys(CATEGORY_BOOKS) as BookCategory[];

// Get verse count for a specific chapter (1-indexed)
export function getVerseCount(bookName: string, chapter: number): number | null {
  const bookInfo = getBookInfo(bookName);
  if (!bookInfo || chapter < 1 || chapter > bookInfo.chapters) {
    return null;
  }
  return bookInfo.versesPerChapter[chapter - 1];
}
