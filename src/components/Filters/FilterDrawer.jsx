import { useEffect, useRef } from 'react'
import CategoryFilter from './CategoryFilter'
import BrandFilter from './BrandFilter'
import PriceFilter from './PriceFilter'

/**
 * Mobile full-screen filter drawer. Slides up from the bottom.
 * Uses the exact same filter components as FilterSidebar — no logic duplication.
 *
 * Accessibility:
 * - role="dialog" aria-modal="true" aria-labelledby pointing to the visible h2
 * - Focus moves to the close button on mount (WCAG 2.1.1)
 * - Body scroll is locked while open
 * - Closes on: Close button, backdrop click, ESC key
 */
export default function FilterDrawer({
  categories, selectedCategory, onCategoryChange,
  availableBrands, selectedBrands, onBrandsChange,
  min, max, onPriceChange,
  onClearFilters, onClose,
}) {
  const closeButtonRef = useRef(null)

  // WCAG 2.1.1: keyboard focus must move into a dialog on open
  useEffect(() => {
    closeButtonRef.current?.focus()
  }, [])

  // Lock body scroll while open
  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [])

  // Close on ESC
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const hasActiveFilters =
    selectedCategory !== '' ||
    selectedBrands.length > 0 ||
    min > 0 ||
    isFinite(max)

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="filter-drawer-title"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative bg-white rounded-t-2xl max-h-[85vh] flex flex-col shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <h2 id="filter-drawer-title" className="text-base font-semibold text-gray-900">
            Filters
          </h2>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close filters"
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700
                       transition-colors focus-visible:outline-none focus-visible:ring-2
                       focus-visible:ring-blue-500 focus-visible:ring-offset-1"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-5 space-y-6">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={onCategoryChange}
          />

          {availableBrands.length > 0 && (
            <div className="border-t border-gray-100 pt-6">
              <BrandFilter
                availableBrands={availableBrands}
                selectedBrands={selectedBrands}
                onBrandsChange={onBrandsChange}
              />
            </div>
          )}

          <div className="border-t border-gray-100 pt-6">
            <PriceFilter min={min} max={max} onPriceChange={onPriceChange} />
          </div>
        </div>

        {hasActiveFilters && (
          <div className="px-5 py-4 border-t border-gray-100 flex-shrink-0">
            <button
              onClick={() => { onClearFilters(); onClose() }}
              className="w-full py-2.5 text-sm font-medium text-red-600 border border-red-200
                         rounded-lg hover:bg-red-50 transition-colors
                         focus-visible:outline-none focus-visible:ring-2
                         focus-visible:ring-red-500 focus-visible:ring-offset-1"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
