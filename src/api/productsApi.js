const API_BASE_URL = 'https://dummyjson.com'

/**
 * Two-step fetch strategy:
 * Step 1 — GET /products?limit=1&select=id  → reads `total` from response metadata.
 *           The `select=id` param is supported by DummyJSON (verified). It minimises
 *           the payload of this probe request to near-zero product data.
 * Step 2 — GET /products?limit={total}      → fetches all products in a single call.
 *
 * This approach is robust: if DummyJSON adds more products, the fetch automatically
 * adjusts rather than silently missing records (which a hardcoded limit=194 would do).
 */
export async function fetchAllProducts() {
  const countRes = await fetch(`${API_BASE_URL}/products?limit=1&select=id`)
  if (!countRes.ok) {
    throw new Error(`Failed to fetch product count (${countRes.status})`)
  }
  const { total } = await countRes.json()

  const res = await fetch(`${API_BASE_URL}/products?limit=${total}`)
  if (!res.ok) {
    throw new Error(`Failed to fetch products (${res.status})`)
  }
  const data = await res.json()
  return data.products
}

/**
 * Returns an array of category objects: [{ slug, name, url }, ...]
 * We use `slug` as the URL filter param and `name` as the display label.
 * The `url` field is unused — filter URLs are built via useSearchParams.
 */
export async function fetchCategories() {
  const res = await fetch(`${API_BASE_URL}/products/categories`)
  if (!res.ok) {
    throw new Error(`Failed to fetch categories (${res.status})`)
  }
  return res.json()
}

/**
 * Fetches a single product by ID.
 * Called only from useProduct() on the detail page — never from the listing page.
 * 404 is separated from generic errors so the UI can show "Product not found"
 * vs "Something went wrong — please try again."
 */
export async function fetchProductById(id) {
  const res = await fetch(`${API_BASE_URL}/products/${id}`)
  if (res.status === 404) {
    throw new Error('Product not found')
  }
  if (!res.ok) {
    throw new Error(`Failed to fetch product (${res.status})`)
  }
  return res.json()
}
