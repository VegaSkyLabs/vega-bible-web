# Bible Verse Guessing Game 📖

An interactive web game where players guess Bible verses based on images. Built with Next.js, TypeScript, Tailwind CSS, and DaisyUI.

## Features

- **Interactive Gameplay**: View images and guess the corresponding Bible verse
- **Progress Tracking**: Track your score and accuracy throughout the game
- **Hints System**: Get helpful hints when you're stuck
- **Responsive Design**: Beautiful UI powered by DaisyUI components
- **MDX Support**: Content pages written in MDX for easy editing
- **KJV Text**: Uses public domain King James Version verses

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + DaisyUI
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
cd vega-bible-guess-the-verse
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
│   ├── layout.tsx          # Root layout with navigation
│   ├── page.tsx            # Home page (game)
│   ├── about/
│   │   └── page.mdx        # About page in MDX
│   └── globals.css         # Global styles
├── components/
│   ├── Game.tsx            # Main game component
│   ├── GuessInput.tsx      # Input for verse guesses
│   ├── VerseImage.tsx      # Image display component
│   ├── Feedback.tsx        # Feedback after guessing
│   └── Navigation.tsx      # Navigation bar
├── hooks/
│   └── useGame.ts          # Game state management hook
├── lib/
│   ├── types.ts            # TypeScript type definitions
│   └── verses.ts           # Verse data (KJV)
├── public/
│   └── images/             # Verse images go here
└── mdx-components.tsx      # MDX component customization
```

## Adding Images

To add images for the verses:

1. Place images in `public/images/` directory
2. Name them according to the verse reference (e.g., `john-3-16.jpg`)
3. Supported formats: JPG, PNG, WebP
4. Recommended size: 800x600px or larger

See `public/images/README.md` for the full list of required images.

### Image Sources

You can get free images from:
- [Unsplash](https://unsplash.com/)
- [Pexels](https://www.pexels.com/)
- AI image generators (DALL-E, Midjourney, etc.)

## Adding More Verses

To add more verses to the game:

1. Open `lib/verses.ts`
2. Add a new verse object to the array:

```typescript
{
  id: '7',
  reference: 'Matthew 5:16',
  book: 'Matthew',
  chapter: 5,
  verse: 16,
  text: 'Let your light so shine...',
  imagePath: '/images/matthew-5-16.jpg',
  hint: 'About letting your light shine',
  category: 'discipleship',
}
```

3. Add the corresponding image to `public/images/`

## Customization

### Themes

DaisyUI supports multiple themes. To change themes, edit `tailwind.config.ts`:

```typescript
daisyui: {
  themes: ['light', 'dark', 'cupcake', 'forest', 'luxury'],
}
```

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

### Environment Variables

For media hosting with Vercel Blob or Cloudinary, add environment variables:

```env
# For Vercel Blob
BLOB_READ_WRITE_TOKEN=your_token_here

# For Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

## Future Enhancements

- [ ] Add Vercel Blob integration for image hosting
- [ ] Implement search functionality with MiniSearch
- [ ] Add multiple Bible translations (with proper licensing)
- [ ] Create difficulty levels (easy, medium, hard)
- [ ] Add leaderboard functionality
- [ ] Include audio clips of verses
- [ ] Add sharing features for scores

## License

This project uses the King James Version (KJV) of the Bible, which is in the public domain.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- Bible text from the King James Version (Public Domain)
- UI components from DaisyUI
- Icons from Heroicons
