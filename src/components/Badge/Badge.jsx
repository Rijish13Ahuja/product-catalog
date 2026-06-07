/**
 * Small colored label for product status indicators.
 * The variant→class mapping is the single source of truth for badge styling.
 * Adding a new badge type requires only one new entry in VARIANTS.
 *
 * @param {Object} props
 * @param {'discount'|'lowStock'|'outOfStock'} [props.variant='discount']
 * @param {React.ReactNode} props.children
 */

const VARIANTS = {
  discount:   'bg-red-500 text-white',
  lowStock:   'bg-orange-500 text-white',
  outOfStock: 'bg-gray-500 text-white',
}

export default function Badge({ variant = 'discount', children }) {
  const classes = VARIANTS[variant] ?? VARIANTS.discount

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold
                  tracking-wide shadow-sm ${classes}`}
    >
      {children}
    </span>
  )
}
