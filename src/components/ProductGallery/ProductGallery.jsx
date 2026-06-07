import { useState } from 'react'

/**
 * Image gallery with a large main image and a scrollable thumbnail strip.
 * Clicking a thumbnail swaps the main image.
 *
 * Uses `thumbnail` as the initial main image because the API's `images[]`
 * sometimes contains the same URL as thumbnail or additional views.
 * The full `images[]` array populates the strip.
 *
 * @param {Object}   props
 * @param {string}   props.thumbnail  - Initial main image URL
 * @param {string[]} props.images     - Full image array for thumbnails
 * @param {string}   props.title      - Product title (used in alt text)
 */
export default function ProductGallery({ thumbnail, images, title }) {
  const [activeImage, setActiveImage] = useState(thumbnail || images?.[0] || '')

  // Deduplicate: some products list thumbnail again inside images[]
  const allImages = images?.length
    ? [...new Set([thumbnail, ...images].filter(Boolean))]
    : [thumbnail].filter(Boolean)

  return (
    <div>
      {/* Main image */}
      <div className="aspect-square rounded-xl overflow-hidden bg-gray-50 mb-3 border border-gray-100">
        <img
          src={activeImage}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnail strip — only render if there are multiple images */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImage(img)}
              aria-label={`View image ${idx + 1} of ${allImages.length}`}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all
                duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                ${activeImage === img
                  ? 'border-blue-600 shadow-sm'
                  : 'border-transparent hover:border-gray-300'}`}
            >
              <img
                src={img}
                alt={`${title} — view ${idx + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
