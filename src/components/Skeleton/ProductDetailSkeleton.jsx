/**
 * Animated placeholder that mirrors ProductDetailPage's layout.
 * The outer wrapper matches ProductDetailPage's min-h-screen bg-gray-50
 * so there is no background flash between skeleton and loaded states.
 */
export default function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 animate-pulse">
        {/* Back button placeholder */}
        <div className="h-5 bg-gray-200 rounded w-36 mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Left column: image gallery */}
          <div>
            <div className="aspect-square bg-gray-200 rounded-xl mb-3" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0" />
              ))}
            </div>
          </div>

          {/* Right column: product info */}
          <div className="space-y-4">
            <div className="h-3 bg-gray-200 rounded w-24" />
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-8 bg-gray-200 rounded w-1/4" />
            <div className="h-5 bg-gray-200 rounded w-36" />

            <div className="space-y-2 pt-2">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
            </div>

            <div className="space-y-3 pt-2">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded w-2/3" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
