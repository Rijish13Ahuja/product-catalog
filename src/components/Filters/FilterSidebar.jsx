import CategoryFilter from './CategoryFilter'
import BrandFilter from './BrandFilter'
import PriceFilter from './PriceFilter'

/**
 * Desktop sticky sidebar. Composes the three filter components.
 *
 * Section order: Category → Price → Brand.
 * Price comes before Brand so it is always visible in the sticky viewport
 * without scrolling. Brand's internal scroll area sits at the bottom where
 * a long scrollable list naturally belongs — the standard ecommerce pattern.
 *
 * "Clear all" is intentionally absent from this sidebar. The FilterChips
 * strip above the product grid already provides individual chip removal and
 * a "Clear all" action visible at all times on desktop.
 */
export default function FilterSidebar({
  categories, selectedCategory, onCategoryChange,
  availableBrands, selectedBrands, onBrandsChange,
  min, max, onPriceChange,
  loading,
}) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-16 mb-5" />
        <div className="space-y-2 mb-6">
          <div className="h-3 bg-gray-200 rounded w-20 mb-3" />
          {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-4 bg-gray-200 rounded w-full" />)}
        </div>
        <div className="space-y-2 mb-6">
          <div className="h-3 bg-gray-200 rounded w-14 mb-3" />
          {[1, 2, 3].map(i => <div key={i} className="h-4 bg-gray-200 rounded w-3/4" />)}
        </div>
        <div className="h-3 bg-gray-200 rounded w-20 mb-3" />
        <div className="flex gap-2">
          <div className="h-9 bg-gray-200 rounded flex-1" />
          <div className="h-9 bg-gray-200 rounded flex-1" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <h2 className="font-semibold text-gray-900 mb-5">Filters</h2>

      <div className="space-y-6">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
        />

        <div className="border-t border-gray-100 pt-6">
          <PriceFilter
            min={min}
            max={max}
            onPriceChange={onPriceChange}
          />
        </div>

        <div className="border-t border-gray-100 pt-6">
          <BrandFilter
            availableBrands={availableBrands}
            selectedBrands={selectedBrands}
            onBrandsChange={onBrandsChange}
          />
        </div>
      </div>
    </div>
  )
}
