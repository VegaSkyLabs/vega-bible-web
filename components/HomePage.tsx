import Link from 'next/link';

interface GameModeCardProps {
  href: string;
  icon: string;
  title: string;
  description: string;
  status?: string;
  statusColor?: 'success' | 'warning' | 'info' | 'error';
  accentColor: string;
}

function GameModeCard({
  href,
  icon,
  title,
  description,
  status,
  statusColor = 'info',
  accentColor
}: GameModeCardProps) {
  return (
    <Link
      href={href}
      className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-200 hover:-translate-y-1 border-l-4"
      style={{ borderLeftColor: accentColor }}
    >
      <div className="card-body">
        <div className="flex items-center gap-4">
          <div className="text-4xl">{icon}</div>
          <div className="flex-1">
            <h2 className="card-title text-xl">{title}</h2>
            <p className="text-base-content/70 text-sm">{description}</p>
          </div>
          {status && (
            <div className={`badge badge-${statusColor} badge-lg`}>
              {status}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-base-200 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2">
            Guess The Verse
            <span className="badge badge-primary ml-2 text-sm align-middle">BETA</span>
          </h1>
          <p className="text-base-content/70">How well do you know your Bible?</p>
        </div>

        <div className="flex flex-col gap-4">
          <GameModeCard
            href="/daily"
            icon="📅"
            title="Daily Puzzle"
            description="A new verse to guess every day"
            status="New"
            statusColor="success"
            accentColor="#22c55e"
          />

          <GameModeCard
            href="/packs"
            icon="📚"
            title="Puzzle Packs"
            description="Themed collections of verses to master"
            accentColor="#3b82f6"
          />

          <GameModeCard
            href="/random"
            icon="🎲"
            title="Random Puzzle"
            description="Practice with unlimited random verses"
            accentColor="#a855f7"
          />

          <GameModeCard
            href="/puzzles"
            icon="📖"
            title="All Puzzles"
            description="Browse and play from our full puzzle library"
            accentColor="#f59e0b"
          />
        </div>

        <div className="mt-8 flex items-center justify-between">
          <Link href="/about" className="btn btn-info h-10 rounded-lg">
            About this game
          </Link>
          <a href="https://www.buymeacoffee.com/kevinlabs" target="_blank" rel="noopener noreferrer">
            <img
              src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
              alt="Buy Me A Coffee"
              className="h-10 w-auto"
            />
          </a>
        </div>
      </div>
    </div>
  );
}
