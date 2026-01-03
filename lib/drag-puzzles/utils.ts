/**
 * Utility functions for drag-drop puzzles
 * These can be used on both client and server
 */

/**
 * Parse blankedText into segments (text and blank markers)
 */
export function parseBlankText(
  blankedText: string
): Array<{ type: 'text' | 'blank'; content: string; index?: number }> {
  const segments: Array<{ type: 'text' | 'blank'; content: string; index?: number }> = [];
  const parts = blankedText.split(/(\{\{blank\}\})/);
  let blankIndex = 0;

  for (const part of parts) {
    if (part === '{{blank}}') {
      segments.push({ type: 'blank', content: '', index: blankIndex });
      blankIndex++;
    } else if (part.length > 0) {
      segments.push({ type: 'text', content: part });
    }
  }

  return segments;
}

/**
 * Extract all words from fullText for Extreme mode
 */
export function extractAllWords(fullText: string): string[] {
  return fullText
    .replace(/[.,;:!?"'()]/g, '') // Remove punctuation
    .split(/\s+/) // Split by whitespace
    .filter(Boolean); // Remove empty strings
}

/**
 * Shuffle an array (Fisher-Yates algorithm)
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
