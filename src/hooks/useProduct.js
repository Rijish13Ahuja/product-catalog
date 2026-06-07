import { useState, useEffect } from 'react'
import { fetchProductById } from '../api/productsApi'

/**
 * @typedef {Object} UseProductResult
 * @property {Object|null} product  - The fetched product, or null while loading
 * @property {boolean} loading      - True while the fetch is in-flight
 * @property {string|null} error    - Error message on failure, null otherwise.
 *                                    "Product not found" signals a 404;
 *                                    any other string signals a server/network error.
 */

/**
 * Fetches a single product by ID from the API.
 *
 * Called only from ProductDetailPage — not from the listing page, which derives
 * individual product data from the already-loaded `allProducts` array.
 * Fetching from the API directly means the detail page supports:
 *   - Direct URL access  (/products/42 opened in a new tab)
 *   - Hard refresh       (page reload on the detail URL)
 *
 * Design decisions:
 * - State is reset to (null, true, null) at the start of every new fetch so the
 *   skeleton loader appears immediately when navigating between products, rather
 *   than flashing stale data from the previous product.
 * - `id` in the dependency array means the effect re-runs automatically on
 *   navigation (e.g. user goes from /products/1 to /products/2).
 * - A `cancelled` flag prevents setState on an unmounted component (e.g. user
 *   navigates away before the fetch resolves).
 *
 * @param {string|number} id - Product ID, typically from useParams()
 * @returns {UseProductResult}
 */
export function useProduct(id) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return

    let cancelled = false

    setLoading(true)
    setError(null)
    setProduct(null)

    async function load() {
      try {
        const data = await fetchProductById(id)
        if (!cancelled) {
          setProduct(data)
          setLoading(false)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message)
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [id])

  return { product, loading, error }
}
