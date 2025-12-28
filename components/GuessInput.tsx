'use client';

import { useState, FormEvent, useMemo, useId } from 'react';
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
} from '@headlessui/react';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/20/solid';
import { getAllBookNames, getBookInfo, getVerseCount } from '@/lib/bibleMetadata';

interface GuessInputProps {
  onGuess: (guess: string) => void;
  onSkip: () => void;
  disabled?: boolean;
  showHint?: boolean;
  hint?: string;
  skipLabel?: string;
}

export default function GuessInput({
  onGuess,
  onSkip,
  disabled,
  showHint,
  hint,
  skipLabel = 'Skip',
}: GuessInputProps) {
  const comboboxId = useId();
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [bookQuery, setBookQuery] = useState('');
  const [chapter, setChapter] = useState('');
  const [startVerse, setStartVerse] = useState('');
  const [endVerse, setEndVerse] = useState('');
  const [showHintText, setShowHintText] = useState(false);

  const allBooks = useMemo(() => getAllBookNames(), []);
  const selectedBookInfo = useMemo(
    () => (selectedBook ? getBookInfo(selectedBook) : null),
    [selectedBook]
  );

  const filteredBooks = useMemo(() => {
    if (bookQuery === '') return allBooks;
    return allBooks.filter((book) =>
      book.toLowerCase().includes(bookQuery.toLowerCase())
    );
  }, [allBooks, bookQuery]);

  const maxVerses = useMemo(() => {
    if (!selectedBook || !chapter) return null;
    return getVerseCount(selectedBook, parseInt(chapter));
  }, [selectedBook, chapter]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!selectedBook || !chapter || !startVerse) return;

    // Build the reference string
    let reference = `${selectedBook} ${chapter}:${startVerse}`;
    if (endVerse && parseInt(endVerse) > parseInt(startVerse)) {
      reference += `-${endVerse}`;
    }

    onGuess(reference);

    // Reset form
    setSelectedBook(null);
    setBookQuery('');
    setChapter('');
    setStartVerse('');
    setEndVerse('');
  };

  const handleBookChange = (book: string | null) => {
    setSelectedBook(book);
    setBookQuery('');
    setChapter('');
    setStartVerse('');
    setEndVerse('');
  };

  const isValid = selectedBook && chapter && startVerse;

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="card bg-base-100 shadow-xl p-4 space-y-3">
        {/* Book Combobox */}
        <div className="form-control">
          <label className="label py-1">
            <span className="label-text text-sm">Book</span>
          </label>
          <Combobox
            value={selectedBook}
            onChange={handleBookChange}
            disabled={disabled}
            name={`book-combobox-${comboboxId}`}
          >
            <div className="relative">
              <ComboboxInput
                id={`book-input-${comboboxId}`}
                className="input input-sm w-full border border-gray-300 rounded-lg px-3 pr-10 h-9 text-sm"
                placeholder="Type to search books..."
                displayValue={(book: string | null) => book || ''}
                onChange={(e) => setBookQuery(e.target.value)}
              />
              <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </ComboboxButton>
              <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-base-100 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                {filteredBooks.length === 0 && bookQuery !== '' ? (
                  <div className="relative cursor-default select-none px-4 py-2 text-gray-500">
                    No books found.
                  </div>
                ) : (
                  filteredBooks.map((book) => (
                    <ComboboxOption
                      key={book}
                      value={book}
                      className="relative cursor-pointer select-none py-2 pl-10 pr-4 ui-active:bg-primary ui-active:text-white ui-not-active:text-gray-900"
                    >
                      {({ selected }) => (
                        <>
                          <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                            {book}
                          </span>
                          {selected && (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 ui-active:text-white text-primary">
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          )}
                        </>
                      )}
                    </ComboboxOption>
                  ))
                )}
              </ComboboxOptions>
            </div>
          </Combobox>
        </div>

        {/* Chapter and Verse Row */}
        <div className="flex gap-2 items-end">
          {/* Chapter Input */}
          <div className="form-control flex-1">
            <label className="label py-1">
              <span className="label-text text-sm">Chapter</span>
              {selectedBookInfo && (
                <span className="label-text-alt text-xs">1-{selectedBookInfo.chapters}</span>
              )}
            </label>
            <input
              type="number"
              className="input input-sm w-full border border-gray-300 rounded-lg px-3 h-9 text-sm"
              placeholder="Ch"
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              disabled={disabled || !selectedBook}
              min={1}
              max={selectedBookInfo?.chapters}
            />
          </div>

          <span className="text-sm self-end mb-2">:</span>

          {/* Start Verse Input */}
          <div className="form-control flex-1">
            <label className="label py-1">
              <span className="label-text text-sm">Verse</span>
              {maxVerses && (
                <span className="label-text-alt text-xs">1-{maxVerses}</span>
              )}
            </label>
            <input
              type="number"
              className="input input-sm w-full border border-gray-300 rounded-lg px-3 h-9 text-sm"
              placeholder="V"
              value={startVerse}
              onChange={(e) => setStartVerse(e.target.value)}
              disabled={disabled || !chapter}
              min={1}
              max={maxVerses || undefined}
            />
          </div>

          <span className="text-sm self-end mb-2">-</span>

          {/* End Verse Input (Optional) */}
          <div className="form-control flex-1">
            <label className="label py-1">
              <span className="label-text-alt text-xs">(optional)</span>
            </label>
            <input
              type="number"
              className="input input-sm w-full border border-gray-300 rounded-lg px-3 h-9 text-sm"
              placeholder="End"
              value={endVerse}
              onChange={(e) => setEndVerse(e.target.value)}
              disabled={disabled || !startVerse}
              min={parseInt(startVerse) + 1 || 2}
              max={maxVerses || undefined}
            />
          </div>
        </div>

        {/* Preview */}
        {isValid && (
          <div className="text-center py-1">
            <span className="text-sm font-semibold">
              {selectedBook} {chapter}:{startVerse}
              {endVerse && parseInt(endVerse) > parseInt(startVerse) ? `-${endVerse}` : ''}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-1">
          <button
            type="submit"
            className="flex-1 h-10 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={disabled || !isValid}
          >
            Submit Guess
          </button>
          <button
            type="button"
            className="px-4 h-10 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onSkip}
            disabled={disabled}
          >
            {skipLabel}
          </button>
        </div>
      </form>

      {/* Hint Section */}
      {showHint && hint && (
        <div className="hint-container mt-2 text-center">
          {!showHintText ? (
            <button
              className="text-xs text-gray-500 hover:text-gray-700 underline"
              onClick={() => setShowHintText(true)}
            >
              Need a hint?
            </button>
          ) : (
            <div className="alert alert-info py-2 text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-current shrink-0 w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>{hint}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
