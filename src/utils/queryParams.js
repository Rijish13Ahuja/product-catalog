/**
 * Single source of truth for URL search parameter parsing and serialisation.
 *
 * Components never call searchParams.get() directly. They call getParams()
 * to read and buildParams() / clearFilterParams() to write. This keeps all
 * URL schema knowledge in one place.
 *
 * URL schema:
 *   ?category=smartphones
 *   &brands=Apple,Samsung
 *   &min=500
 *   &max=1500
 *   &sort=priceAsc
 *   &page=2
 */

/** Exhaustive list of valid sort keys. Anything else falls back to 'relevance'. */
const VALID_SORTS = ['relevance', 'priceAsc', 'priceDesc', 'rating']

/**
 * @typedef {Object} ParsedParams
 * @property {string}   category - Category slug or '' (all categories)
 * @property {string[]} brands   - Selected brand names or [] (all brands)
 * @property {number}   min      - Minimum price (>= 0), 0 = no lower bound
 * @property {number}   max      - Maximum price, Infinity = no upper bound
 * @property {'relevance'|'priceAsc'|'priceDesc'|'rating'} sort
 * @property {number}   page     - Current page, always >= 1
 */

/**
 * Parses URLSearchParams into a normalized, type-safe params object.
 * Every invalid or missing value falls back to a safe default so no
 * downstream code needs to guard against null, NaN, or unexpected strings.
 *
 * Edge cases handled:
 *   ?page=abc    → page: 1        (parseInt returns NaN)
 *   ?page=0      → page: 1        (pages are 1-indexed)
 *   ?page=-1     → page: 1        (pages must be positive)
 *   ?min=-100    → min: 0         (negative prices do not exist)
 *   ?min=foo     → min: 0         (NaN from parseFloat)
 *   ?max=foo     → max: Infinity  (NaN means no upper bound)
 *   ?max=-5      → max: Infinity  (negative max is invalid)
 *   ?brands=     → brands: []     (empty string → empty array)
 *   ?brands=a,   → brands: ['a']  (trailing commas stripped)
 *   ?brands=,b   → brands: ['b']  (leading commas stripped)
 *   ?sort=xyz    → sort: 'relevance' (unrecognised value)
 *
 * @param {URLSearchParams} searchParams - Object from useSearchParams()
 * @returns {ParsedParams}
 */
export function getParams(searchParams) {
  // Category
  const category = searchParams.get('category') || ''

  // Brands: comma-separated → trimmed, non-empty string array
  const rawBrands = searchParams.get('brands') || ''
  const brands = rawBrands
    ? rawBrands.split(',').map(b => b.trim()).filter(Boolean)
    : []

  // Min price: must be a non-negative finite number
  const rawMin = parseFloat(searchParams.get('min'))
  const min = isNaN(rawMin) || rawMin < 0 ? 0 : rawMin

  // Max price: must be a non-negative finite number, else no upper bound
  const rawMax = parseFloat(searchParams.get('max'))
  const max = isNaN(rawMax) || rawMax < 0 ? Infinity : rawMax

  // Sort: must be one of the four recognised keys
  const rawSort = searchParams.get('sort') || ''
  const sort = VALID_SORTS.includes(rawSort) ? rawSort : 'relevance'

  // Page: must be a positive integer
  const rawPage = parseInt(searchParams.get('page'), 10)
  const page = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage

  return { category, brands, min, max, sort, page }
}

/**
 * Merges a patch onto the current parsed params and serialises the result
 * into a plain object ready for setSearchParams().
 *
 * Rules applied automatically:
 * 1. A category change clears the brand selection. Brands in the UI are
 *    scoped to the selected category; previously-selected brands may not
 *    exist in the new category and would silently produce empty results.
 * 2. Any filter or sort change resets page to 1. The current page may be
 *    out of range after results change.
 * 3. Params at their default value are omitted from the URL.
 *    (sort=relevance, page=1, min=0, max=Infinity are never written)
 *    This keeps the URL clean and readable.
 *
 * Usage:
 *   // User selects a category
 *   setSearchParams(buildParams(params, { category: 'beauty' }))
 *
 *   // User checks a brand (adding to existing selection)
 *   setSearchParams(buildParams(params, { brands: [...params.brands, 'Apple'] }))
 *
 *   // User changes page
 *   setSearchParams(buildParams(params, { page: 3 }))
 *
 * @param {ParsedParams} current - Current parsed params from getParams()
 * @param {Partial<ParsedParams>} patch - The values to change
 * @returns {Record<string, string>} Plain object for setSearchParams()
 */
export function buildParams(current, patch) {
  const next = { ...current, ...patch }

  // Rule 1: category change clears stale brand selection
  if (patch.category !== undefined && patch.category !== current.category) {
    next.brands = []
  }

  // Rule 2: any filter/sort change resets to page 1
  const filterKeys = ['category', 'brands', 'min', 'max', 'sort']
  if (filterKeys.some(k => k in patch)) {
    next.page = 1
  }

  // Serialise — omit params that equal their default value
  const result = {}

  if (next.category)             result.category = next.category
  if (next.brands.length)        result.brands   = next.brands.join(',')
  if (next.min > 0)              result.min      = String(next.min)
  if (next.max !== Infinity)     result.max      = String(next.max)
  if (next.sort !== 'relevance') result.sort     = next.sort
  if (next.page > 1)             result.page     = String(next.page)

  return result
}

/**
 * Returns an empty params object that clears every filter, sort, and page.
 * Calling setSearchParams(clearFilterParams()) navigates the URL back to '/'.
 *
 * @returns {Record<string, string>}
 */
export function clearFilterParams() {
  return {}
}
