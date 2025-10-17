import Link from 'next/link';

export default function Navigation() {
  return (
    <div className="navbar bg-base-300 shadow-lg">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost text-xl">
          📖 Bible Verse Game
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href="/">Play</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
