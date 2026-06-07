import { useState, useEffect } from 'react'

/**
 * Category filter with a "Show more / Show less" toggle.
 *
 * Rationale for collapsing at 6:
 * The API returns 30 categories. Showing all 30 by default pushes Brand
 * and Price filters far below the fold, reducing their discoverability.
 * Showing 6 + a toggle follows the pattern used by ASOS, Amazon, and Zalando.
 *
 * Auto-expand: if the URL param selects a category beyond the visible fold
 * (e.g. a shared link to /?category=smartphones), the list auto-expands
 * so the selected category is always visible.
 */
const SHOW_COUNT = 6

export default function CategoryFilter({ categories, selectedCategory, onCategoryChange }) {
  const [expanded, setExpanded] = useState(false)

  // Auto-expand when the selected category would otherwise be hidden
  useEffect(() => {
    if (!selectedCategory) return
    const idx = categories.findIndex(c => c.slug === selectedCategory)
    if (idx >= SHOW_COUNT) setExpanded(true)
  }, [selectedCategory, categories])

  const visibleCategories = expanded ? categories : categories.slice(0, SHOW_COUNT)
  const hiddenCount = Math.max(0, categories.length - SHOW_COUNT)

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-800 mb-3">Category</h3>

      <ul className="space-y-1" role="radiogroup" aria-label="Filter by category">
        {/* "All Categories" is always visible */}
        <li>
          <label className="flex items-center gap-2.5 cursor-pointer group py-1.5 rounded-lg
                            focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-1">
            <span
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0
                transition-colors duration-150
                ${selectedCategory === ''
                  ? 'border-blue-600'
                  : 'border-gray-300 group-hover:border-blue-300'}`}
            >
              {selectedCategory === '' && <span className="w-2 h-2 rounded-full bg-blue-600" />}
            </span>
            <input
              type="radio"
              name="category"
              value=""
              checked={selectedCategory === ''}
              onChange={() => onCategoryChange('')}
              className="sr-only"
            />
            <span className={`text-sm ${selectedCategory === '' ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
              All Categories
            </span>
          </label>
        </li>

        {visibleCategories.map(cat => (
          <li key={cat.slug}>
            <label className="flex items-center gap-2.5 cursor-pointer group py-1.5 rounded-lg
                              focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-1">
              <span
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0
                  transition-colors duration-150
                  ${selectedCategory === cat.slug
                    ? 'border-blue-600'
                    : 'border-gray-300 group-hover:border-blue-300'}`}
              >
                {selectedCategory === cat.slug && <span className="w-2 h-2 rounded-full bg-blue-600" />}
              </span>
              <input
                type="radio"
                name="category"
                value={cat.slug}
                checked={selectedCategory === cat.slug}
                onChange={() => onCategoryChange(cat.slug)}
                className="sr-only"
              />
              <span className={`text-sm ${selectedCategory === cat.slug ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                {cat.name}
              </span>
            </label>
          </li>
        ))}
      </ul>

      {/* Show more / Show less toggle */}
      {hiddenCount > 0 && (
        <button
          onClick={() => setExpanded(e => !e)}
          className="mt-2 text-xs font-medium text-blue-600 hover:text-blue-700
                     transition-colors focus-visible:outline-none focus-visible:underline"
          aria-expanded={expanded}
        >
          {expanded
            ? 'Show less ▴'
            : `+ Show ${hiddenCount} more ▾`}
        </button>
      )}
    </div>
  )
}
