import React from 'react';
import { Gem, Circle } from 'lucide-react';

const CATEGORIES = [
  { label: 'All', icon: '✦' },
  { label: 'Rings', icon: '💍' },
  { label: 'Necklaces', icon: '📿' },
  { label: 'Earrings', icon: '✨' },
  { label: 'Bracelets', icon: '⌚' },
];

export default function CategoryFilter({ selectedCategory, onSelectCategory }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5">
      {CATEGORIES.map(({ label, icon }) => (
        <button
          key={label}
          onClick={() => onSelectCategory(label)}
          className={`category-pill ${selectedCategory === label ? 'active' : ''}`}
        >
          <span className="text-sm leading-none" aria-hidden="true">{icon}</span>
          <span>{label}</span>
          {selectedCategory === label && (
            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
          )}
        </button>
      ))}
    </div>
  );
}
