import { useNavigate } from 'react-router-dom'
import RatingStars from '../RatingStars/RatingStars'
import Badge from '../Badge/Badge'

export default function ProductCard({ product }) {
  const navigate = useNavigate()

  const {
    id, title, brand, price, rating,
    discountPercentage, stock, thumbnail, images,
  } = product

  const displayBrand  = brand || 'Unbranded'
  const hasDiscount   = discountPercentage > 0
  const isLowStock    = stock > 0 && stock < 10
  const isOutOfStock  = stock === 0
  const originalPrice = hasDiscount
    ? (price / (1 - discountPercentage / 100)).toFixed(2)
    : null

  // Determines hover behaviour: two-image products cross-fade between images;
  // single-image products zoom the thumbnail instead.
  const hasSecondImage = Boolean(
    images?.length > 1 && images[1] && images[1] !== thumbnail
  )

  function handleNavigate() {
    navigate(`/products/${id}`)
  }

  return (
    <article
      onClick={handleNavigate}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleNavigate()}
      tabIndex={0}
      aria-label={`${title} by ${displayBrand}, $${price}`}
      className="bg-white rounded-xl border border-gray-100 overflow-hidden cursor-pointer
                 shadow-sm transition-all duration-300
                 hover:shadow-lg hover:-translate-y-1
                 focus-visible:outline-none focus-visible:ring-2
                 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                 group"
    >
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <img
          src={thumbnail}
          alt={title}
          loading="lazy"
          className={`w-full h-full object-cover ${
            hasSecondImage
              ? 'transition-opacity duration-300 group-hover:opacity-0'
              : 'transition-transform duration-500 group-hover:scale-105'
          }`}
        />

        {/* Secondary image fades in simultaneously as primary fades out.
            aria-hidden: primary already carries the descriptive alt text. */}
        {hasSecondImage && (
          <img
            src={images[1]}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover
                       opacity-0 transition-opacity duration-300
                       group-hover:opacity-100"
          />
        )}

        {hasDiscount && (
          <div className="absolute top-2 left-2">
            <Badge variant="discount">−{Math.round(discountPercentage)}%</Badge>
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute top-2 right-2">
            <Badge variant="outOfStock">Out of Stock</Badge>
          </div>
        )}
        {!isOutOfStock && isLowStock && (
          <div className="absolute top-2 right-2">
            <Badge variant="lowStock">Low Stock</Badge>
          </div>
        )}
      </div>

      <div className="px-4 pt-5 pb-4">
        <p className="text-xs text-gray-400 tracking-wide mb-2 truncate">
          {displayBrand}
        </p>

        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug mb-4 min-h-[2.5rem]">
          {title}
        </h3>

        <div className="flex items-baseline gap-1.5 mb-2">
          <span className="text-base font-bold text-gray-900">${price}</span>
          {originalPrice && (
            <span className="text-xs text-gray-400 line-through">${originalPrice}</span>
          )}
        </div>

        <RatingStars rating={rating} size="sm" showValue={true} />
      </div>
    </article>
  )
}
