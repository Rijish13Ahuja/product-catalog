/**
 * Pure filter and sort utilities for product data.
 *
 * Rules:
 * - Every function is pure: no side effects, no mutation, no React imports.
 * - Filters compose with AND logic: each function narrows the set further.
 * - Within filterByBrands, matching is OR: a product matches if its brand
 *   appears anywhere in the selected brands array.
 * - sortProducts always returns a new array so useMemo caches are never
 *   invalidated by in-place mutation.
 */

/**
 * Filters products by category slug.
 * An empty string means "all categories" and returns the full array unchanged.
 *
 * @param {Array} products
 * @param {string} category - Category slug (e.g. 'beauty') or '' for all
 * @returns {Array}
 */
export function filterByCategory(products, category) {
  if (!category) return products
  return products.filter(p => p.category === category)
}

/**
 * Filters products by brand names (multi-select OR within brands, AND across filters).
 * An empty brands array means "all brands" and returns the array unchanged.
 *
 * Products with no brand field (e.g. some grocery items) never match a brand
 * filter — they are only included when no brand filter is active.
 *
 * @param {Array} products
 * @param {string[]} brands - Selected brand names, e.g. ['Apple', 'Samsung']
 * @returns {Array}
 */
export function filterByBrands(products, brands) {
  if (!brands.length) return products
  return products.filter(p => brands.includes(p.brand))
}

/**
 * Filters products by price range, both bounds inclusive.
 * min=0 and max=Infinity is the "no price constraint" state and returns
 * the array unchanged (short-circuits without iterating).
 *
 * @param {Array} products
 * @param {number} min - Minimum price (>= 0)
 * @param {number} max - Maximum price (Infinity = no upper bound)
 * @returns {Array}
 */
export function filterByPrice(products, min, max) {
  if (min === 0 && max === Infinity) return products
  return products.filter(p => p.price >= min && p.price <= max)
}

/**
 * Comparator functions keyed by sort param value.
 * 'relevance' is intentionally absent — its absence means "no comparator",
 * which preserves the original API order.
 */
const SORT_COMPARATORS = {
  priceAsc: (a, b) => a.price - b.price,
  priceDesc: (a, b) => b.price - a.price,
  rating: (a, b) => b.rating - a.rating,
}

/**
 * Sorts a product array by the given key. Returns a new array.
 * 'relevance' (or any unrecognised key) preserves the original order.
 *
 * @param {Array} products
 * @param {'relevance'|'priceAsc'|'priceDesc'|'rating'} sort
 * @returns {Array}
 */
export function sortProducts(products, sort) {
  const comparator = SORT_COMPARATORS[sort]
  if (!comparator) return products
  return [...products].sort(comparator)
}

/**
 * Extracts unique, sorted brand names from a product array.
 * Products with no brand field are excluded so "Unbranded" never
 * appears as a filter option.
 *
 * Used to populate the brand filter checkboxes. Called on
 * categoryFilteredProducts (post-category, pre-brand-filter) so the
 * brand list stays consistent while multiple brands are selected.
 *
 * @param {Array} products
 * @returns {string[]} Alphabetically sorted unique brand names
 */
export function extractBrands(products) {
  const seen = new Set()
  for (const product of products) {
    if (product.brand) seen.add(product.brand)
  }
  return Array.from(seen).sort()
}

/**
 * Returns the slice of products for the requested page.
 * Pages are 1-indexed. Out-of-range pages return an empty array.
 *
 * @param {Array} products - The fully filtered and sorted array
 * @param {number} page    - Current page number (>= 1)
 * @param {number} [pageSize=12] - Items per page
 * @returns {Array}
 */
export function paginateProducts(products, page, pageSize = 12) {
  const start = (page - 1) * pageSize
  return products.slice(start, start + pageSize)
}

/**
 * Calculates total page count for a product set.
 *
 * @param {number} totalProducts
 * @param {number} [pageSize=12]
 * @returns {number}
 */
export function getTotalPages(totalProducts, pageSize = 12) {
  return Math.max(1, Math.ceil(totalProducts / pageSize))
}
