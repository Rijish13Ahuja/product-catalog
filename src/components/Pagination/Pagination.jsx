/**
 * Windowed pagination with ellipsis.
 *
 * Algorithm — always includes:
 *   - Page 1 and page totalPages
 *   - currentPage ± 1 (the "window")
 *   - '...' where there are gaps of ≥ 2 pages
 *
 * Examples (current page in brackets):
 *   [1]  2  ...  17           (on page 1)
 *   1  ...  5  [6]  7  ...  17  (on page 6)
 *   1  ...  15  16  [17]      (on page 17)
 *
 * Accessibility:
 *   - nav with aria-label
 *   - aria-current="page" on the active page button
 *   - aria-label on Prev / Next
 *   - Disabled buttons remain in the tab order but use aria-disabled
 *
 * @param {Object}   props
 * @param {number}   props.currentPage  - Active page (1-indexed)
 * @param {number}   props.totalPages   - Total page count
 * @param {Function} props.onPageChange - (page: number) => void
 */

/**
 * Generates the page number sequence with '...' sentinels.
 * @param {number} currentPage
 * @param {number} totalPages
 * @returns {Array<number|'...'>}
 */
function getPageNumbers(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const pages = [1]

  // Left ellipsis: gap between page 1 and the window start
  if (currentPage > 3) pages.push('...')

  // Window: currentPage ± 1, clamped to [2, totalPages-1]
  const winStart = Math.max(2, currentPage - 1)
  const winEnd   = Math.min(totalPages - 1, currentPage + 1)
  for (let p = winStart; p <= winEnd; p++) pages.push(p)

  // Right ellipsis: gap between the window end and the last page
  if (currentPage < totalPages - 2) pages.push('...')

  pages.push(totalPages)
  return pages
}

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const pages = getPageNumbers(currentPage, totalPages)

  const btnBase = `inline-flex items-center justify-center min-w-[2.25rem] h-9 px-2
    text-sm rounded-lg transition-colors duration-200
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1`

  const btnActive   = 'bg-blue-600 text-white font-semibold shadow-sm'
  const btnInactive = 'font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900'
  const btnDisabled = 'font-medium text-gray-300 cursor-not-allowed'

  return (
    // Outer div allows horizontal scroll on very small screens (< 375px) without
    // breaking the page layout. On most mobile screens pagination fits without scroll.
    <div className="overflow-x-auto pb-1">
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1 w-max mx-auto px-1">
      {/* Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Go to previous page"
        className={`${btnBase} gap-1 px-3 ${currentPage === 1 ? btnDisabled : btnInactive}`}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="hidden sm:inline">Prev</span>
      </button>

      {/* Page numbers */}
      {pages.map((page, idx) =>
        page === '...' ? (
          <span
            key={`ellipsis-${idx}`}
            aria-hidden="true"
            className="inline-flex items-center justify-center min-w-[2.25rem] h-9 text-sm text-gray-400"
          >
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            aria-label={`Page ${page}`}
            aria-current={currentPage === page ? 'page' : undefined}
            className={`${btnBase} ${currentPage === page ? btnActive : btnInactive}`}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Go to next page"
        className={`${btnBase} gap-1 px-3 ${currentPage === totalPages ? btnDisabled : btnInactive}`}
      >
        <span className="hidden sm:inline">Next</span>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </nav>
    </div>
  )
}
