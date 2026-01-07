import { describe, it, expect } from 'vitest';
import { parseBlankText, extractAllWords, shuffleArray } from './utils';

describe('parseBlankText', () => {
  it('should return empty array for empty string', () => {
    expect(parseBlankText('')).toEqual([]);
  });

  it('should parse text with no blanks', () => {
    expect(parseBlankText('Hello world')).toEqual([
      { type: 'text', content: 'Hello world' },
    ]);
  });

  it('should parse single blank', () => {
    expect(parseBlankText('{{blank}}')).toEqual([
      { type: 'blank', content: '', index: 0 },
    ]);
  });

  it('should parse text with one blank', () => {
    expect(parseBlankText('Hello {{blank}} world')).toEqual([
      { type: 'text', content: 'Hello ' },
      { type: 'blank', content: '', index: 0 },
      { type: 'text', content: ' world' },
    ]);
  });

  it('should parse text with multiple blanks and assign correct indices', () => {
    expect(parseBlankText('The {{blank}} is {{blank}} today')).toEqual([
      { type: 'text', content: 'The ' },
      { type: 'blank', content: '', index: 0 },
      { type: 'text', content: ' is ' },
      { type: 'blank', content: '', index: 1 },
      { type: 'text', content: ' today' },
    ]);
  });

  it('should handle consecutive blanks', () => {
    expect(parseBlankText('{{blank}}{{blank}}')).toEqual([
      { type: 'blank', content: '', index: 0 },
      { type: 'blank', content: '', index: 1 },
    ]);
  });

  it('should handle blank at the start', () => {
    expect(parseBlankText('{{blank}} is great')).toEqual([
      { type: 'blank', content: '', index: 0 },
      { type: 'text', content: ' is great' },
    ]);
  });

  it('should handle blank at the end', () => {
    expect(parseBlankText('This is {{blank}}')).toEqual([
      { type: 'text', content: 'This is ' },
      { type: 'blank', content: '', index: 0 },
    ]);
  });
});

describe('extractAllWords', () => {
  it('should return empty array for empty string', () => {
    expect(extractAllWords('')).toEqual([]);
  });

  it('should extract words from simple text', () => {
    expect(extractAllWords('Hello world')).toEqual(['Hello', 'world']);
  });

  it('should remove punctuation', () => {
    expect(extractAllWords('Hello, world!')).toEqual(['Hello', 'world']);
  });

  it('should handle multiple spaces', () => {
    expect(extractAllWords('Hello   world')).toEqual(['Hello', 'world']);
  });

  it('should remove various punctuation marks', () => {
    expect(extractAllWords('"For God so loved the world."')).toEqual([
      'For',
      'God',
      'so',
      'loved',
      'the',
      'world',
    ]);
  });

  it('should handle text with colons and semicolons', () => {
    expect(extractAllWords('First: one; Second: two')).toEqual([
      'First',
      'one',
      'Second',
      'two',
    ]);
  });

  it('should handle parentheses', () => {
    expect(extractAllWords('Word (parenthetical) here')).toEqual([
      'Word',
      'parenthetical',
      'here',
    ]);
  });
});

describe('shuffleArray', () => {
  it('should return empty array for empty input', () => {
    expect(shuffleArray([])).toEqual([]);
  });

  it('should return single element array unchanged', () => {
    expect(shuffleArray([1])).toEqual([1]);
  });

  it('should return array with same length', () => {
    const input = [1, 2, 3, 4, 5];
    expect(shuffleArray(input)).toHaveLength(5);
  });

  it('should contain all original elements', () => {
    const input = [1, 2, 3, 4, 5];
    const result = shuffleArray(input);
    expect(result.sort()).toEqual([1, 2, 3, 4, 5]);
  });

  it('should not mutate the original array', () => {
    const input = [1, 2, 3, 4, 5];
    const original = [...input];
    shuffleArray(input);
    expect(input).toEqual(original);
  });

  it('should work with strings', () => {
    const input = ['a', 'b', 'c'];
    const result = shuffleArray(input);
    expect(result.sort()).toEqual(['a', 'b', 'c']);
  });

  it('should work with objects', () => {
    const obj1 = { id: 1 };
    const obj2 = { id: 2 };
    const input = [obj1, obj2];
    const result = shuffleArray(input);
    expect(result).toContain(obj1);
    expect(result).toContain(obj2);
  });
});
