/**
 * Renders a fractional star rating display.
 *
 * Star fill technique: a gray ★ base defines the element width. A yellow ★
 * overlay is absolutely positioned on top, clipped to `fill%` via overflow:hidden.
 * This avoids SVG linearGradient ID collisions that occur when multiple instances
 * render on the same page (e.g. 12 product cards each with a rating).
 *
 * Used in three contexts:
 *   - ProductCard       → size="sm", showValue=true
 *   - ProductDetailPage → size="md", showValue=true
 *   - Reviews           → size="sm", showValue=true
 */

const SIZE_CLASSES = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
}

/**
 * Single star with a yellow fill clipped to `fill` (0–1).
 * fill=1 → fully yellow, fill=0 → fully gray, fill=0.5 → half yellow.
 *
 * @param {Object} props
 * @param {number} props.fill  - Fill level from 0 to 1
 */
function StarFill({ fill }) {
  return (
    <span className="relative inline-block leading-none" aria-hidden="true">
      {/* Gray base — always fully visible, defines the element's width */}
      <span className="text-gray-300">★</span>

      {/* Yellow overlay — clipped to fill% of the base star's width */}
      <span
        className="absolute top-0 left-0 overflow-hidden text-yellow-400 whitespace-nowrap"
        style={{ width: `${Math.round(fill * 100)}%` }}
      >
        ★
      </span>
    </span>
  )
}

/**
 * @param {Object}  props
 * @param {number}  props.rating              - Numeric rating, e.g. 4.2
 * @param {boolean} [props.showValue=true]    - Whether to render the numeric value
 * @param {'xs'|'sm'|'md'|'lg'} [props.size='sm'] - Controls star font size
 */
export default function RatingStars({ rating, showValue = true, size = 'sm' }) {
  const clamped = Math.min(5, Math.max(0, rating ?? 0))
  const sizeClass = SIZE_CLASSES[size] ?? SIZE_CLASSES.sm

  return (
    <div
      className={`flex items-center gap-0.5 ${sizeClass}`}
      role="img"
      aria-label={`Rating: ${clamped.toFixed(1)} out of 5`}
    >
      {Array.from({ length: 5 }, (_, i) => {
        const fill = Math.min(1, Math.max(0, clamped - i))
        return <StarFill key={i} fill={fill} />
      })}

      {showValue && (
        <span className="ml-1 text-gray-500" style={{ fontSize: '0.85em' }}>
          {clamped.toFixed(1)}
        </span>
      )}
    </div>
  )
}
