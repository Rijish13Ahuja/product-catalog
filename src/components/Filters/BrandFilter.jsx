/**
 * Purely presentational. Renders checkboxes for multi-brand selection.
 *
 * Accessibility note: same focus-within technique as CategoryFilter —
 * the real checkbox is sr-only so focus-within on the label provides
 * the visible keyboard focus ring.
 */
export default function BrandFilter({ availableBrands, selectedBrands, onBrandsChange }) {
  if (!availableBrands.length) return null

  function handleToggle(brand) {
    if (selectedBrands.includes(brand)) {
      onBrandsChange(selectedBrands.filter(b => b !== brand))
    } else {
      onBrandsChange([...selectedBrands, brand])
    }
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-800 mb-3">Brand</h3>

      {/* contain:layout isolates layout so the ~3000px scroll content of the brand
          list cannot inflate the grid container height in Chromium/Edge. */}
      <div className="h-52 overflow-y-auto pr-1 [contain:layout]">
        <ul className="space-y-1">
          {availableBrands.map(brand => {
            const checked = selectedBrands.includes(brand)
            return (
              <li key={brand}>
                <label className="flex items-center gap-2.5 cursor-pointer group py-1.5 rounded-lg
                                  focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-1">
                  <span
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0
                      transition-colors duration-150
                      ${checked
                        ? 'border-blue-600 bg-blue-600'
                        : 'border-gray-300 group-hover:border-blue-300'}`}
                  >
                    {checked && (
                      <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none">
                        <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.8"
                              strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleToggle(brand)}
                    aria-label={`Filter by ${brand}`}
                    className="sr-only"
                  />
                  <span className={`text-sm truncate ${checked ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                    {brand}
                  </span>
                </label>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
