import { Link } from 'react-router-dom'

/**
 * Sticky global header. Appears on every page (listing + detail).
 * z-40 keeps it below the mobile FilterDrawer (z-50) so the drawer
 * overlays the header correctly on scroll.
 */
export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 h-14 flex items-center">
        <Link
          to="/"
          className="flex items-center gap-2.5 rounded
                     focus-visible:outline-none focus-visible:ring-2
                     focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          aria-label="Katalog — go to homepage"
        >
          {/* Logo mark — blue square with K */}
          <div
            className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0"
            aria-hidden="true"
          >
            <span className="text-white font-bold text-sm leading-none">K</span>
          </div>

          {/* Wordmark */}
          <span className="text-xl font-bold text-gray-900 tracking-tight">
            Katalog
          </span>
        </Link>
      </div>
    </header>
  )
}
