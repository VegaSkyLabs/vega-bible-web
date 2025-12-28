# Bible Verse Guessing Game

An interactive web game where players guess Bible verses based on image clues. Built with Next.js, TypeScript, Tailwind CSS, and DaisyUI.

## Features

- **Multiple Game Modes**: Daily puzzle, random practice, and themed puzzle packs
- **Progressive Hint System**: Multiple image clues revealed with each wrong guess
- **Intelligent Feedback**: Directional hints for testament, chapter, and verse numbers
- **Guess History**: Track all your attempts with visual comparison indicators
- **Puzzle Packs**: Themed collections with difficulty levels (Easy, Medium, Hard)
- **Responsive Design**: Beautiful UI powered by DaisyUI components
- **MDX Support**: Content pages written in MDX for easy editing
- **KJV Text**: Uses public domain King James Version verses

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + DaisyUI
- **Validation**: Zod for schema validation
- **UI Components**: Headless UI + Heroicons
- **Content**: MDX for content pages
- **Deployment Ready**: Optimized for Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd vega-bible-web
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/
│   ├── layout.tsx              # Root layout with navigation
│   ├── page.tsx                # Home page with game mode selection
│   ├── daily/                  # Daily puzzle mode
│   ├── random/                 # Random puzzle practice
│   ├── packs/                  # Browse puzzle packs
│   │   └── [packId]/           # Individual pack detail
│   ├── puzzles/                # Browse all puzzles
│   ├── puzzle/[puzzleId]/      # Individual puzzle page
│   ├── game/[packId]/          # Pack gameplay
│   ├── about/page.mdx          # About page in MDX
│   └── globals.css             # Global styles
├── components/
│   ├── SinglePuzzleGame.tsx    # Main game component with hint system
│   ├── GameContainer.tsx       # Game flow management
│   ├── GuessInput.tsx          # Verse reference input
│   ├── GuessHistoryTable.tsx   # Table of all guesses with hints
│   ├── LastGuessSummary.tsx    # Summary of last guess comparison
│   ├── Feedback.tsx            # Feedback after guessing
│   ├── VerseImage.tsx          # Image display component
│   ├── HomePage.tsx            # Landing page with game modes
│   ├── PuzzleList.tsx          # Puzzle grid/list display
│   ├── CategoryBadge.tsx       # Category badge component
│   └── Navigation.tsx          # Navigation bar
├── hooks/
│   └── useGame.ts              # Game state management hook
├── lib/
│   ├── bibleMetadata.ts        # Bible book info and parsing
│   ├── guessComparison.ts      # Core guess comparison logic
│   └── puzzles/
│       ├── loader.ts           # Load puzzles from content
│       ├── schema.ts           # Zod schemas for validation
│       └── types.ts            # Puzzle type definitions
├── types/
│   └── index.ts                # TypeScript type definitions
├── content/
│   ├── puzzles/                # Individual puzzle JSON files
│   └── packs/                  # Pack definition JSON files
├── public/
│   └── images/                 # Puzzle images
└── mdx-components.tsx          # MDX component customization
```

## Game Modes

### Daily Puzzle
One puzzle per day - come back daily for a new challenge.

### Random Puzzle
Unlimited practice with randomly selected verses.

### Puzzle Packs
Themed collections of puzzles with varying difficulty levels:
- **Easy**: More hints, familiar verses
- **Medium**: Balanced challenge
- **Hard**: Fewer hints, deeper Bible knowledge required

## How the Game Works

1. View the initial image clue
2. Enter your guess as a Bible reference (e.g., "John 3:16")
3. Receive feedback with directional hints:
   - Testament direction (Old/New)
   - Chapter comparison (higher/lower arrows)
   - Verse comparison (higher/lower arrows)
4. Wrong guesses reveal additional image clues
5. Keep guessing until you find the correct verse or run out of attempts

## Adding Puzzles

Puzzles are stored as JSON files in the `content/puzzles/` directory.

### Puzzle Structure

Create a new JSON file in `content/puzzles/`:

```json
{
  "id": "unique-puzzle-id",
  "answer": {
    "book": "John",
    "chapter": 3,
    "verse": 16
  },
  "verseText": "For God so loved the world...",
  "category": "gospel",
  "imageClues": [
    "/images/puzzle-name/clue-1.jpg",
    "/images/puzzle-name/clue-2.jpg",
    "/images/puzzle-name/clue-3.jpg"
  ]
}
```

### Adding Packs

Create pack definitions in `content/packs/`:

```json
{
  "id": "pack-id",
  "name": "Pack Name",
  "description": "Pack description",
  "difficulty": "medium",
  "puzzleIds": ["puzzle-1", "puzzle-2", "puzzle-3"]
}
```

## Adding Images

1. Create a folder in `public/images/` for your puzzle
2. Add multiple image clues (progressive hints)
3. Reference them in the puzzle JSON file
4. Supported formats: JPG, PNG, WebP
5. Recommended size: 800x600px or larger

### Image Sources

You can get free images from:
- AI image generators (Gemini, DALL-E, Midjourney, etc.)

## Customization

### Themes

DaisyUI supports multiple themes. Configure themes in your Tailwind CSS setup.

### Styling

All styling is done with Tailwind CSS. Modify component classes directly in the TSX files.

## Building for Production

```bash
npm run build
npm start
```

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Deploy with default settings

## License
This project uses the King James Version (KJV) of the Bible, which is in the public domain.

## Acknowledgments
- Bible text from the King James Version (Public Domain)
- UI components from DaisyUI
- Icons from Heroicons

