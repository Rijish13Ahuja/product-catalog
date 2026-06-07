import { useState, useEffect, useRef } from 'react'
import { useDebounce } from '../../hooks/useDebounce'

/**
 * Price range filter with debounced URL updates.
 * "From" / "To" labels make the input pair feel designed rather than form-like.
 */
export default function PriceFilter({ min, max, onPriceChange }) {
  const [localMin, setLocalMin] = useState(min > 0 ? String(min) : '')
  const [localMax, setLocalMax] = useState(isFinite(max) ? String(max) : '')

  const debouncedMin = useDebounce(localMin, 300)
  const debouncedMax = useDebounce(localMax, 300)

  const onPriceChangeRef = useRef(onPriceChange)
  useEffect(() => { onPriceChangeRef.current = onPriceChange })

  // Push debounced values to URL after the user pauses typing.
  // parsedMax fix: `|| Infinity` would treat $0 as "no upper bound" (0 is falsy).
  // Using isNaN check instead correctly allows $0 as a max price.
  useEffect(() => {
    const parsedMin = debouncedMin === '' ? 0 : Math.max(0, parseFloat(debouncedMin) || 0)
    const rawMax    = parseFloat(debouncedMax)
    const parsedMax = debouncedMax === '' || isNaN(rawMax) ? Infinity : Math.max(0, rawMax)
    onPriceChangeRef.current(parsedMin, parsedMax)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedMin, debouncedMax])

  // Sync local inputs when URL changes externally (e.g. Clear Filters, browser nav).
  // Combined into one effect since both respond to the same conceptual action.
  useEffect(() => {
    setLocalMin(min > 0 ? String(min) : '')
    setLocalMax(isFinite(max) ? String(max) : '')
  }, [min, max])

  const inputClass = `w-full px-3 py-2 text-sm border border-gray-200 rounded-lg
    bg-white focus:outline-none focus:ring-2 focus:ring-blue-500
    focus:border-transparent placeholder-gray-400`

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-800 mb-3">Price</h3>

      <div className="flex items-end gap-2">
        <div className="flex-1">
          <label htmlFor="price-min" className="block text-xs text-gray-500 mb-1.5">
            From
          </label>
          <input
            id="price-min"
            type="number"
            min="0"
            placeholder="$"
            value={localMin}
            onChange={e => setLocalMin(e.target.value)}
            className={inputClass}
          />
        </div>

        <span className="text-gray-300 pb-2.5 flex-shrink-0 text-sm">—</span>

        <div className="flex-1">
          <label htmlFor="price-max" className="block text-xs text-gray-500 mb-1.5">
            To
          </label>
          <input
            id="price-max"
            type="number"
            min="0"
            placeholder="$"
            value={localMax}
            onChange={e => setLocalMax(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>
    </div>
  )
}
