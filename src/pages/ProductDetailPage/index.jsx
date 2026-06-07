import { useParams, Link } from 'react-router-dom'
import { useProduct } from '../../hooks/useProduct'
import ProductGallery from '../../components/ProductGallery/ProductGallery'
import Reviews from '../../components/Reviews/Reviews'
import RatingStars from '../../components/RatingStars/RatingStars'
import Badge from '../../components/Badge/Badge'
import ProductDetailSkeleton from '../../components/Skeleton/ProductDetailSkeleton'

export default function ProductDetailPage() {
  const { id } = useParams()
  const { product, loading, error } = useProduct(id)

  if (loading) return <ProductDetailSkeleton />

  if (error) {
    const isNotFound = error === 'Product not found'
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="text-center max-w-sm">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5
            ${isNotFound ? 'bg-yellow-100' : 'bg-red-100'}`}>
            {isNotFound ? (
              <svg className="w-8 h-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            )}
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {isNotFound ? 'Product Not Found' : 'Failed to Load Product'}
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            {isNotFound ? "We couldn't find the product you're looking for." : error}
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-2.5 bg-blue-600 text-white text-sm font-medium
                       rounded-lg hover:bg-blue-700 transition-colors
                       focus-visible:outline-none focus-visible:ring-2
                       focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            ← Back to Products
          </Link>
        </div>
      </div>
    )
  }

  const {
    title, brand, description, category,
    price, discountPercentage, rating,
    stock, availabilityStatus,
    warrantyInformation, shippingInformation, returnPolicy,
    thumbnail, images, reviews,
  } = product

  const displayBrand  = brand || 'Unbranded'
  const hasDiscount   = discountPercentage > 0
  const originalPrice = hasDiscount
    ? (price / (1 - discountPercentage / 100)).toFixed(2)
    : null
  const isLowStock    = stock > 0 && stock < 10
  const isOutOfStock  = stock === 0

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600
                   hover:text-blue-700 mb-8 transition-colors rounded
                   focus-visible:outline-none focus-visible:ring-2
                   focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <ProductGallery thumbnail={thumbnail} images={images} title={title} />
        </div>

        <div>
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-2">
            {formatCategory(category)}
          </p>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-4">
            {title}
          </h1>

          <div className="flex items-center gap-3 mb-5">
            <RatingStars rating={rating} size="md" showValue={true} />
            {reviews?.length > 0 && (
              <span className="text-xs text-gray-500">
                ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-3 mb-5">
            <span className="text-3xl font-bold text-gray-900">${price}</span>
            {originalPrice && (
              <span className="text-lg text-gray-400 line-through">${originalPrice}</span>
            )}
            {hasDiscount && (
              <Badge variant="discount">−{Math.round(discountPercentage)}%</Badge>
            )}
          </div>

          <div className="flex items-center gap-2 mb-6">
            {isOutOfStock ? (
              <Badge variant="outOfStock">Out of Stock</Badge>
            ) : isLowStock ? (
              <>
                <Badge variant="lowStock">Low Stock</Badge>
                <span className="text-sm text-orange-600 font-medium">Only {stock} left</span>
              </>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-700">
                <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {availabilityStatus || 'In Stock'}
              </span>
            )}
          </div>

          <p className="text-sm text-gray-600 leading-relaxed mb-7">{description}</p>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Product Details
            </h3>
            <div className="space-y-3">
              <DetailRow label="Brand"    value={displayBrand} />
              <DetailRow label="Category" value={formatCategory(category)} />
              {warrantyInformation  && <DetailRow label="Warranty"  value={warrantyInformation} />}
              {shippingInformation  && <DetailRow label="Shipping"  value={shippingInformation} />}
              {returnPolicy         && <DetailRow label="Returns"   value={returnPolicy} />}
              {!isOutOfStock        && <DetailRow label="In Stock"  value={`${stock} units available`} />}
            </div>
          </div>
        </div>
      </div>

      <Reviews reviews={reviews} />
    </div>
  )
}

/**
 * Converts a category slug to display-ready text.
 * "home-decoration" → "Home Decoration"
 */
function formatCategory(slug) {
  if (!slug) return ''
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

function DetailRow({ label, value }) {
  return (
    <div className="flex gap-3 text-sm">
      <span className="text-gray-400 w-20 flex-shrink-0">{label}</span>
      <span className="text-gray-800 font-medium">{value}</span>
    </div>
  )
}
