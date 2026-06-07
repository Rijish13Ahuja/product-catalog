import { useMemo, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { useProducts } from '../../hooks/useProducts'
import {
  filterByCategory, filterByBrands, filterByPrice,
  sortProducts, extractBrands, paginateProducts, getTotalPages,
} from '../../utils/filterProducts'
import { getParams, buildParams, clearFilterParams } from '../../utils/queryParams'

import FilterSidebar  from '../../components/Filters/FilterSidebar'
import FilterDrawer   from '../../components/Filters/FilterDrawer'
import FilterChips    from '../../components/FilterChips/FilterChips'
import Toolbar        from '../../components/Toolbar/Toolbar'
import ProductGrid    from '../../components/ProductGrid/ProductGrid'
import Pagination     from '../../components/Pagination/Pagination'
import EmptyState     from '../../components/EmptyState/EmptyState'

const PAGE_SIZE = 12

export default function ProductListingPage() {
  const { products, categories, loading, error, retry } = useProducts()
  const [searchParams, setSearchParams] = useSearchParams()
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Close the drawer when the viewport crosses the lg breakpoint (1024px).
  // Without this, resizing from tablet to desktop leaves the drawer mounted
  // with body scroll locked — the user cannot scroll the page.
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)')
    function handleBreakpoint(e) {
      if (e.matches) setDrawerOpen(false)
    }
    mql.addEventListener('change', handleBreakpoint)
    return () => mql.removeEventListener('change', handleBreakpoint)
  }, [])

  const params = useMemo(() => getParams(searchParams), [searchParams])

  const categoryFilteredProducts = useMemo(
    () => filterByCategory(products, params.category),
    [products, params.category]
  )

  const availableBrands = useMemo(
    () => extractBrands(categoryFilteredProducts),
    [categoryFilteredProducts]
  )

  const filteredProducts = useMemo(() => {
    const byPrice = filterByPrice(categoryFilteredProducts, params.min, params.max)
    return filterByBrands(byPrice, params.brands)
  }, [categoryFilteredProducts, params.min, params.max, params.brands])

  const sortedProducts = useMemo(
    () => sortProducts(filteredProducts, params.sort),
    [filteredProducts, params.sort]
  )

  const totalPages = useMemo(
    () => getTotalPages(sortedProducts.length, PAGE_SIZE),
    [sortedProducts.length]
  )

  const safePage = useMemo(
    () => Math.min(Math.max(1, params.page), totalPages),
    [params.page, totalPages]
  )

  useEffect(() => {
    if (!loading && params.page !== safePage) {
      setSearchParams(buildParams(params, { page: safePage }), { replace: true })
    }
  }, [params.page, safePage, loading])

  const paginatedProducts = useMemo(
    () => paginateProducts(sortedProducts, safePage, PAGE_SIZE),
    [sortedProducts, safePage]
  )

  function handleCategoryChange(category) {
    setSearchParams(buildParams(params, { category }))
  }

  function handleBrandsChange(brands) {
    setSearchParams(buildParams(params, { brands }))
  }

  function handleRemoveBrand(brand) {
    setSearchParams(buildParams(params, { brands: params.brands.filter(b => b !== brand) }))
  }

  function handlePriceChange(min, max) {
    setSearchParams(buildParams(params, { min, max }))
  }

  function handleSortChange(sort) {
    setSearchParams(buildParams(params, { sort }))
  }

  function handlePageChange(page) {
    setSearchParams(buildParams(params, { page }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleClearFilters() {
    setSearchParams(clearFilterParams())
  }

  const activeFilterCount =
    (params.category ? 1 : 0) +
    params.brands.length +
    (params.min > 0 || isFinite(params.max) ? 1 : 0)

  const displayCategoryName = params.category
    ? (categories.find(c => c.slug === params.category)?.name ?? params.category)
    : null

  const filterProps = {
    categories,
    selectedCategory: params.category,
    onCategoryChange: handleCategoryChange,
    availableBrands,
    selectedBrands: params.brands,
    onBrandsChange: handleBrandsChange,
    min: params.min,
    max: params.max,
    onPriceChange: handlePriceChange,
    onClearFilters: handleClearFilters,
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Failed to load products</h2>
          <p className="text-sm text-gray-500 mb-6">{error}</p>
          <button
            onClick={retry}
            className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg
                       hover:bg-blue-700 active:bg-blue-800 transition-colors
                       focus-visible:outline-none focus-visible:ring-2
                       focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const showEmptyState = !loading && filteredProducts.length === 0

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6">
      {/* Two-column grid at ≥ lg: sidebar (256px) + main (1fr).
          Grid avoids Chromium's overflow:auto flex intrinsic-sizing inflation bug.
          sticky top-20 = h-14 header (56px) + 24px gap. */}
      <div className="lg:grid lg:grid-cols-[256px_1fr] lg:gap-6 lg:items-start">

        <aside className="hidden lg:block sticky top-20 self-start">
          <FilterSidebar {...filterProps} loading={loading} />
        </aside>

        {/* Main content */}
        <main className="min-w-0">

          {/* Section title */}
          <div className="mb-5">
            <h1 className="text-2xl font-bold text-gray-900">
              {displayCategoryName ?? 'All Products'}
            </h1>
          </div>

          {/* Toolbar: count + sort */}
          <Toolbar
            totalCount={filteredProducts.length}
            currentPage={safePage}
            pageSize={PAGE_SIZE}
            sort={params.sort}
            onSortChange={handleSortChange}
            activeFilterCount={activeFilterCount}
            onOpenDrawer={() => setDrawerOpen(true)}
            loading={loading}
          />

          {/* Active filter chips — shown between toolbar and grid */}
          <FilterChips
            params={params}
            categories={categories}
            onRemoveCategory={() => handleCategoryChange('')}
            onRemoveBrand={handleRemoveBrand}
            onRemovePrice={() => handlePriceChange(0, Infinity)}
            onClearAll={handleClearFilters}
          />

          {showEmptyState ? (
            <EmptyState onClearFilters={handleClearFilters} />
          ) : (
            <>
              <ProductGrid products={paginatedProducts} loading={loading} />

              {!loading && totalPages > 1 && (
                <div className="mt-10 mb-6">
                  <Pagination
                    currentPage={safePage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Mobile filter drawer */}
      {drawerOpen && (
        <FilterDrawer
          {...filterProps}
          onClose={() => setDrawerOpen(false)}
        />
      )}
    </div>
  )
}
