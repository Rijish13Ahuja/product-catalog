import { useState, useEffect } from 'react'
import { fetchAllProducts, fetchCategories } from '../api/productsApi'

/**
 * @typedef {Object} Product
 * @property {number} id
 * @property {string} title
 * @property {string} [brand]
 * @property {string} description
 * @property {string} category
 * @property {number} price
 * @property {number} discountPercentage
 * @property {number} rating
 * @property {number} stock
 * @property {string} availabilityStatus
 * @property {string} warrantyInformation
 * @property {string} shippingInformation
 * @property {string} returnPolicy
 * @property {string} thumbnail
 * @property {string[]} images
 * @property {Array<{rating: number, comment: string, reviewerName: string}>} reviews
 */

/**
 * @typedef {Object} Category
 * @property {string} slug  - Used as the URL filter param value
 * @property {string} name  - Used as the display label
 * @property {string} url
 */

/**
 * @typedef {Object} UseProductsResult
 * @property {Product[]} products    - All products, in original API order
 * @property {Category[]} categories - All category objects
 * @property {boolean} loading       - True while the initial fetch is in-flight
 * @property {string|null} error     - Error message if the fetch failed, null otherwise
 * @property {() => void} retry      - Call to re-trigger the fetch (e.g. from a Retry button)
 */

/**
 * Fetches all products and all categories in parallel on mount.
 *
 * Design decisions:
 * - Promise.all ensures both requests run concurrently; total wait time equals
 *   whichever request is slower, not the sum of both.
 * - A `retryCount` state variable acts as a toggle: incrementing it causes the
 *   effect to re-run, which re-triggers the fetch without re-mounting the component.
 * - A `cancelled` flag prevents setState calls on an unmounted component.
 *   Note: the flag guards state updates only — it does not cancel the in-flight
 *   network request. AbortController would be needed for that (future improvement).
 *
 * @returns {UseProductsResult}
 */
export function useProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      try {
        const [fetchedProducts, fetchedCategories] = await Promise.all([
          fetchAllProducts(),
          fetchCategories(),
        ])

        if (!cancelled) {
          setProducts(fetchedProducts)
          setCategories(fetchedCategories)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [retryCount])

  return {
    products,
    categories,
    loading,
    error,
    retry: () => setRetryCount(c => c + 1),
  }
}
