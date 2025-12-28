'use client';

import { BookCategory, CATEGORY_BOOKS } from '@/lib/bibleMetadata';

export type CategoryStatus = 'default' | 'confirmed' | 'eliminated';

interface CategoryBadgeProps {
  category: BookCategory;
  status?: CategoryStatus;
  showTooltip?: boolean;
}

export default function CategoryBadge({
  category,
  status = 'default',
  showTooltip = true,
}: CategoryBadgeProps) {
  const statusClasses = {
    default: 'bg-base-100 text-base-content',
    confirmed: 'bg-success text-success-content',
    eliminated: 'bg-base-300 text-base-content/40 line-through',
  };

  const badge = (
    <span
      tabIndex={showTooltip ? 0 : undefined}
      role={showTooltip ? 'button' : undefined}
      className={`text-xs px-2 py-1 rounded ${showTooltip ? 'cursor-help' : ''} ${statusClasses[status]}`}
    >
      {category}
    </span>
  );

  if (!showTooltip) {
    return badge;
  }

  return (
    <div className="dropdown dropdown-hover dropdown-bottom">
      {badge}
      <div
        tabIndex={0}
        className="dropdown-content z-50 p-2 shadow-lg bg-base-100 rounded-lg w-64 mt-1 border border-base-300"
      >
        <div className="text-xs font-bold mb-1">{category}</div>
        <div className="text-xs opacity-70">
          {CATEGORY_BOOKS[category].join(', ')}
        </div>
      </div>
    </div>
  );
}
