/**
 * Shown when the active filters return zero products.
 *
 * @param {Object}   props
 * @param {Function} [props.onClearFilters] - If provided, renders a Clear Filters button.
 *                                            Omit when the component is used outside a
 *                                            filter context (e.g. empty search results).
 */
export default function EmptyState({ onClearFilters }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-4">
      {/* Search icon */}
      <svg
        className="w-16 h-16 text-gray-300 mb-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>

      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        No products match your filters
      </h3>
      <p className="text-gray-500 mb-6 max-w-sm text-sm">
        Try adjusting your search criteria or clearing the active filters to see more results.
      </p>

      {onClearFilters && (
        <button
          onClick={onClearFilters}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium
                     hover:bg-blue-700 active:bg-blue-800 transition-colors duration-150
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Clear Filters
        </button>
      )}
    </div>
  )
}
