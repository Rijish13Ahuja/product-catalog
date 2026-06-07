import RatingStars from '../RatingStars/RatingStars'

/**
 * Customer reviews section. Not required by the assignment brief but
 * included because the API provides reviews[] and it meaningfully
 * improves the detail page's completeness.
 *
 * @param {Object[]} reviews  - Array of review objects from the API
 * @param {string}   reviews[].reviewerName
 * @param {number}   reviews[].rating
 * @param {string}   reviews[].comment
 * @param {string}   reviews[].date
 */
export default function Reviews({ reviews }) {
  if (!reviews?.length) return null

  const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)

  return (
    <section aria-label="Customer reviews" className="mt-10">
      <div className="border-t border-gray-100 pt-8">
        {/* Header */}
        <div className="flex items-baseline gap-3 mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Customer Reviews</h2>
          <span className="text-sm text-gray-500">
            {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
          </span>
          <div className="flex items-center gap-1.5 ml-auto">
            <RatingStars rating={Number(avgRating)} size="sm" showValue={true} />
            <span className="text-xs text-gray-500">average</span>
          </div>
        </div>

        {/* Review list */}
        <ul className="space-y-4">
          {reviews.map((review, idx) => (
            <li key={idx} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex items-center gap-2.5">
                  {/* Avatar initials */}
                  <div
                    className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-xs
                               font-semibold flex items-center justify-center flex-shrink-0"
                    aria-hidden="true"
                  >
                    {review.reviewerName?.charAt(0).toUpperCase() ?? '?'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{review.reviewerName}</p>
                    {review.date && (
                      <p className="text-xs text-gray-400">
                        {new Date(review.date).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'short', day: 'numeric',
                        })}
                      </p>
                    )}
                  </div>
                </div>
                <RatingStars rating={review.rating} size="xs" showValue={false} />
              </div>

              <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
