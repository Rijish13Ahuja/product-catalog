/**
 * Displays product count range and sort dropdown.
 * On mobile also renders the Filters button that opens FilterDrawer.
 *
 * Sort control: keeps the native <select> element for accessibility and
 * simplicity, but uses appearance-none + a custom SVG chevron overlay
 * to remove the OS-rendered default arrow (which looks dated on Windows).
 */

const SORT_OPTIONS = [
  { value: 'relevance',  label: 'Relevance' },
  { value: 'priceAsc',   label: 'Price: Low to High' },
  { value: 'priceDesc',  label: 'Price: High to Low' },
  { value: 'rating',     label: 'Rating' },
]

export default function Toolbar({
  totalCount, currentPage, pageSize, sort, onSortChange,
  activeFilterCount, onOpenDrawer, loading,
}) {
  const start = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const end   = Math.min(currentPage * pageSize, totalCount)

  const countLabel = loading
    ? 'Loading products…'
    : totalCount === 0
      ? 'No products found'
      : `Showing ${start}–${end} of ${totalCount} products`

  return (
    <div className="mb-6 pb-4 border-b border-gray-200">
      {/* Mobile row: Filters button + Sort */}
      <div className="flex items-center justify-between lg:hidden mb-3">
        <button
          onClick={onOpenDrawer}
          aria-label={`Open filters${activeFilterCount > 0 ? `, ${activeFilterCount} active` : ''}`}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium
                     border border-gray-200 rounded-lg bg-white hover:bg-gray-50
                     transition-colors shadow-sm
                     focus-visible:outline-none focus-visible:ring-2
                     focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M7 10h10M10 16h4" />
          </svg>
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold
                             bg-blue-600 text-white rounded-full">
              {activeFilterCount}
            </span>
          )}
        </button>

        <SortSelect id="sort-mobile" value={sort} onChange={onSortChange} />
      </div>

      {/* Desktop row: Count (bolder) + Sort */}
      <div className="hidden lg:flex items-center justify-between">
        <p className="text-sm font-medium text-gray-900">{countLabel}</p>
        <SortSelect id="sort-desktop" value={sort} onChange={onSortChange} />
      </div>

      {/* Mobile: product count */}
      <p className="text-sm font-medium text-gray-900 lg:hidden">{countLabel}</p>
    </div>
  )
}

/**
 * Styled sort dropdown. appearance-none removes the OS arrow;
 * the custom SVG chevron replaces it with a consistent design.
 */
function SortSelect({ id, value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor={id} className="text-sm text-gray-500 whitespace-nowrap hidden sm:block">
        Sort by
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="appearance-none text-sm border border-gray-200 rounded-lg
                     pl-3 pr-8 py-2 bg-white text-gray-800 font-medium
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     focus:border-transparent cursor-pointer"
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {/* Custom chevron overlay — pointer-events-none so clicks pass to the select */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none">
          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  )
}
