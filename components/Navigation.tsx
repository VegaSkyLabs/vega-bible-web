'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

const navLinks = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/daily', label: 'Daily Puzzle', icon: '📅' },
  { href: '/random', label: 'Random', icon: '🎲' },
  { href: '/packs', label: 'Packs', icon: '📦' },
  { href: '/puzzles', label: 'All Puzzles', icon: '📖' },
  { href: '/about', label: 'About', icon: 'ℹ️' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isLandingPage = pathname === '/';

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Landing page: full navigation
  if (isLandingPage) {
    return (
      <div className="navbar bg-base-300 shadow-lg h-12 min-h-0 py-0">
        <div className="flex-1">
          <Link href="/" className="btn btn-ghost btn-sm text-lg">
            📖 Vega - Bible Training
          </Link>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal menu-sm px-1">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/daily">Daily</Link>
            </li>
            <li>
              <Link href="/packs">Packs</Link>
            </li>
            <li>
              <Link href="/puzzles">Puzzles</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  // Get page title and info based on current route
  const getPageInfo = () => {
    if (pathname === '/daily') {
      return {
        icon: '📅',
        title: 'Daily Puzzle',
        subtitle: new Date().toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        }),
        action: null
      };
    }
    if (pathname === '/random') {
      return {
        icon: '🎲',
        title: 'Random Puzzle',
        subtitle: null,
        action: (
          <Link href="/random" className="btn btn-xs btn-ghost">
            🔄 New
          </Link>
        )
      };
    }
    if (pathname === '/packs') {
      return { icon: '📦', title: 'Puzzle Packs', subtitle: null, action: null };
    }
    if (pathname === '/puzzles') {
      return { icon: '📖', title: 'All Puzzles', subtitle: null, action: null };
    }
    if (pathname === '/about') {
      return { icon: 'ℹ️', title: 'About', subtitle: null, action: null };
    }
    if (pathname.startsWith('/puzzle/')) {
      return { icon: '📖', title: 'Puzzle', subtitle: null, action: null };
    }
    if (pathname.startsWith('/game/')) {
      return { icon: '🎮', title: 'Pack Game', subtitle: null, action: null };
    }
    return { icon: '📖', title: 'Vega', subtitle: null, action: null };
  };

  const pageInfo = getPageInfo();

  // Game pages: hamburger menu with page context
  return (
    <div className="navbar bg-base-100 border-b border-base-300 h-12 min-h-0 py-0">
      <div className="max-w-4xl mx-auto w-full flex items-center">
        <div className="flex-none" ref={menuRef}>
          <button
            className="btn btn-ghost p-0 min-h-0 h-5 w-5"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>

          {/* Dropdown menu */}
          {isMenuOpen && (
            <div className="absolute top-12 z-50 bg-base-100 shadow-lg border border-base-300 rounded-lg min-w-48">
              <ul className="menu menu-sm p-2">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={pathname === link.href ? 'active' : ''}
                    >
                      <span>{link.icon}</span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex-1 ml-2 flex items-center gap-2">
          <span>{pageInfo.icon}</span>
          <div className="flex flex-col leading-tight">
            <span className="font-semibold text-sm">{pageInfo.title}</span>
            {pageInfo.subtitle && (
              <span className="text-xs text-base-content/60">{pageInfo.subtitle}</span>
            )}
          </div>
        </div>

        {pageInfo.action && (
          <div className="flex-none">
            {pageInfo.action}
          </div>
        )}
      </div>
    </div>
  );
}
