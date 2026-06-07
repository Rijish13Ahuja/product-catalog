import ProductCard from '../ProductCard/ProductCard'
import ProductCardSkeleton from '../Skeleton/ProductCardSkeleton'

/**
 * Renders the product card grid.
 *
 * Layout breakpoints (spec):
 *   < 640px          (mobile)       → 1 column
 *   640px–767px      (large mobile) → 2 columns
 *   768px–1023px     (tablet)       → 3 columns  ← added to close the gap
 *   ≥ 1024px         (desktop)      → 4 columns
 *
 * The same grid class is applied during loading (skeletons) and after loading
 * (real cards) so the layout never shifts between states.
 *
 * This component is intentionally dumb: it knows nothing about filtering,
 * URL state, or pagination. It renders whatever it receives.
 * The calling page (ProductListingPage) decides whether to render
 * ProductGrid, EmptyState, or an error view.
 *
 * @param {Object}   props
 * @param {Array}    props.products - The current page's products (already paginated)
 * @param {boolean}  props.loading  - Shows skeletons when true
 */
export default function ProductGrid({ products, loading }) {
  const gridClass = 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'

  if (loading) {
    return (
      <div className={gridClass}>
        {Array.from({ length: 12 }, (_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className={gridClass}>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
