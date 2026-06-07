/**
 * Displays removable pill chips for every active filter above the product grid.
 * Returns null when no filters are active — renders nothing in that state.
 *
 * Why this matters: URL-as-state means active filters are "invisible" without
 * this component. Chips make the filter state human-readable and let users
 * remove individual filters without opening the sidebar or drawer.
 *
 * @param {Object}   props
 * @param {Object}   props.params             - Parsed URL params from getParams()
 * @param {Array}    props.categories          - [{slug, name}] for name lookup
 * @param {Function} props.onRemoveCategory    - () => void
 * @param {Function} props.onRemoveBrand       - (brand: string) => void
 * @param {Function} props.onRemovePrice       - () => void
 * @param {Function} props.onClearAll          - () => void
 */
export default function FilterChips({
  params, categories,
  onRemoveCategory, onRemoveBrand, onRemovePrice, onClearAll,
}) {
  const { category, brands, min, max } = params

  const hasPriceFilter = min > 0 || isFinite(max)
  const hasAnyFilter   = category || brands.length > 0 || hasPriceFilter

  if (!hasAnyFilter) return null

  // Look up display name for the active category slug
  const categoryName = category
    ? (categories.find(c => c.slug === category)?.name ?? category)
    : null

  // Build the price chip label
  let priceLabel = null
  if (min > 0 && isFinite(max)) priceLabel = `$${min} – $${max}`
  else if (min > 0)              priceLabel = `$${min}+`
  else if (isFinite(max))        priceLabel = `Up to $${max}`

  return (
    <div
      className="flex flex-wrap items-center gap-2 mb-5"
      role="group"
      aria-label="Active filters"
    >
      {categoryName && (
        <Chip label={categoryName} onRemove={onRemoveCategory} />
      )}

      {brands.map(brand => (
        <Chip
          key={brand}
          label={brand}
          onRemove={() => onRemoveBrand(brand)}
        />
      ))}

      {priceLabel && (
        <Chip label={priceLabel} onRemove={onRemovePrice} />
      )}

      <button
        onClick={onClearAll}
        className="text-xs font-medium text-gray-400 hover:text-gray-600
                   underline underline-offset-2 transition-colors ml-1"
      >
        Clear all
      </button>
    </div>
  )
}

/**
 * Individual filter chip with a label and a remove (×) button.
 */
function Chip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5
                     bg-blue-50 text-blue-700 text-xs font-medium
                     rounded-full border border-blue-200">
      {label}
      <button
        onClick={onRemove}
        aria-label={`Remove ${label} filter`}
        className="w-4 h-4 rounded-full flex items-center justify-center
                   text-blue-400 hover:bg-blue-200 hover:text-blue-800
                   transition-colors duration-150"
      >
        <svg className="w-2.5 h-2.5" viewBox="0 0 10 10" fill="none">
          <path
            d="M2 2l6 6M8 2l-6 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </span>
  )
}
