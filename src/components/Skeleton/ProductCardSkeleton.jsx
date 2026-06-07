/**
 * Animated placeholder that mirrors ProductCard's exact layout.
 * Render 12 of these in ProductGrid while product data loads.
 * animate-pulse gives the shimmer effect without any additional CSS.
 */
export default function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
      {/* Image area — same aspect-square as ProductCard */}
      <div className="aspect-square bg-gray-200" />

      {/* Content area */}
      <div className="p-3 space-y-2">
        {/* Brand */}
        <div className="h-3 bg-gray-200 rounded w-1/3" />

        {/* Title — two lines */}
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />

        {/* Price + rating row */}
        <div className="flex items-center justify-between pt-1">
          <div className="h-5 bg-gray-200 rounded w-16" />
          <div className="h-3 bg-gray-200 rounded w-20" />
        </div>
      </div>
    </div>
  )
}
