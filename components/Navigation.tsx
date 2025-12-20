import Link from 'next/link';

export default function Navigation() {
  return (
    <div className="navbar bg-base-300 shadow-lg h-12 min-h-0 py-0">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost btn-sm text-lg">
          📖 Bible Verse Game
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal menu-sm px-1">
          <li>
            <Link href="/">Play</Link>
          </li>
          <li>
            <Link href="/puzzles">All Puzzles</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
