# Katalog — Ecommerce Product Catalog

A modern ecommerce product catalog built with React, Vite, React Router, and Tailwind CSS.

The application provides an Amazon-style browsing experience with dynamic filtering, pagination, product detail pages, URL-persisted state, responsive layouts, loading states, and error handling while consuming the DummyJSON Products API.

---

## Live Demo

[Add Vercel URL Here]

---

## GitHub Repository

[Add GitHub Repository URL Here]

---

# Overview

Katalog is a frontend-only ecommerce application designed to demonstrate production-oriented engineering practices rather than simply fulfilling UI requirements.

The project focuses on:

* Clean component architecture
* Reusable UI primitives
* URL-driven application state
* Predictable filtering behavior
* Responsive design
* Loading and error states
* Accessibility considerations
* Maintainable code organization

The application allows users to:

* Browse products
* Filter by category
* Filter by brand
* Filter by price range
* Sort products
* Navigate through paginated results
* View detailed product information
* Preserve filter state during navigation
* Share filtered URLs

---

# Tech Stack

## Core

* React 19
* Vite
* React Router DOM
* Tailwind CSS

## APIs

* DummyJSON Products API

Endpoints used:

```txt
/products
/products/categories
/products/{id}
```

---

# Features

## Product Listing Page

* Responsive product grid
* Dynamic category filtering
* Dynamic brand filtering
* Price range filtering
* Product sorting
* Pagination
* Loading skeletons
* Error states
* Empty states

### Product Cards

Each card displays:

* Product image
* Product title
* Brand
* Price
* Original price
* Discount badge
* Rating
* Stock indicators

### Hover Experience

For products with multiple images:

* Secondary image preview on hover
* Smooth image crossfade transition
* Pure CSS implementation
* No JavaScript timers or intervals

---

## Product Detail Page

Displays:

* Product gallery
* Product title
* Brand
* Category
* Description
* Rating
* Price
* Discount information
* Stock status
* Warranty information
* Shipping information
* Return policy
* Customer reviews

Additional UX enhancements:

* Image gallery thumbnails
* Loading skeletons
* Product not found state
* Error recovery state

---

# Architecture Decisions

## 1. Fetch All Products Once

### Decision

Fetch the complete product catalog on initial load and perform filtering client-side.

### Why

DummyJSON contains approximately 200 products.

Advantages:

* Simpler state management
* Instant filter updates
* No additional network requests
* Easier filter composition
* Better user experience

Alternative considered:

* Fetch per category
* Fetch per filter combination

Rejected because it would add unnecessary complexity for a small dataset.

---

## 2. Derived Filtering Using useMemo

### Decision

Filtered products are derived from source data rather than stored separately.

### Why

Avoids:

* State duplication
* Synchronization bugs
* Multiple sources of truth

Filtering remains deterministic and easy to reason about.

---

## 3. URL-Driven State

### Decision

Filter and pagination state are synchronized with URL search parameters.

Example:

```txt
/?category=groceries&page=2
```

### Why

Benefits:

* Shareable URLs
* Browser refresh persistence
* Back/forward navigation support
* Better user experience

This approach mirrors production ecommerce platforms.

---

## 4. Component Composition

The UI is built from small reusable components:

```txt
ProductCard
ProductGrid
FilterSidebar
FilterDrawer
Pagination
RatingStars
Badge
EmptyState
Skeleton Components
```

This keeps responsibilities isolated and promotes maintainability.

---

## 5. Mobile-First Responsive Design

Responsive behavior includes:

* Desktop filter sidebar
* Mobile filter drawer
* Adaptive grid layouts
* Touch-friendly interactions

Breakpoints were tested across:

* Mobile
* Tablet
* Desktop
* Large desktop

---

# Filtering Strategy

Filtering is performed in a predictable order:

1. Category
2. Brand
3. Price Range

All filters are combined.

Example:

```txt
Category = Smartphones
Brand = Apple
Price = 500–1500
```

returns only products satisfying all criteria.

Benefits:

* Consistent behavior
* Easy debugging
* Single source of filtering logic

Implementation lives in:

```txt
src/utils/filterProducts.js
```

---

# URL State Strategy

Application state is synchronized using URL search parameters.

Examples:

```txt
/?category=groceries

/?category=groceries&brand=Nestle

/?category=groceries&brand=Nestle&page=2

/?category=groceries&brand=Nestle&minPrice=10&maxPrice=100
```

Benefits:

* Deep linking
* State persistence
* Better navigation experience
* Easier debugging

---

# Loading & Error Handling

## Listing Page

* Skeleton loaders during fetch
* Retry support
* Empty state handling

## Product Detail Page

* Detail skeleton
* Product not found state
* Error state with recovery path

---

# Accessibility Considerations

Implemented:

* Semantic HTML structure
* Keyboard-accessible controls
* Focus-visible states
* Screen-reader-friendly labels
* Decorative image handling where appropriate

---

# Project Structure

```txt
src
├── api
├── hooks
├── components
│   ├── Filters
│   ├── Pagination
│   ├── ProductCard
│   ├── ProductGallery
│   ├── ProductGrid
│   ├── Reviews
│   ├── Skeleton
│   └── Toolbar
├── pages
│   ├── ProductListingPage
│   └── ProductDetailPage
└── utils
```

---

# Setup Instructions

## Clone Repository

```bash
git clone <repository-url>
cd product-catalog-app
```

## Install Dependencies

```bash
npm install
```

## Start Development Server

```bash
npm run dev
```

Application will be available at:

```txt
http://localhost:5173
```

## Production Build

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

---

# Assumptions

* Product catalog size remains small enough for client-side filtering.
* DummyJSON API remains available.
* No authentication is required.
* No server-side persistence is required.

---

# Future Improvements

Given additional time, the following enhancements could be added:

### Search

* Product search
* Debounced search input

### Advanced Filtering

* Rating filter
* Stock availability filter
* Discount filter

### Performance

* React Query / TanStack Query
* Image preloading
* Virtualized product grid

### Ecommerce Enhancements

* Wishlist
* Shopping cart
* Product comparison
* Recently viewed products

### Testing

* Unit tests
* Integration tests
* End-to-end tests

---

# Engineering Highlights

* URL-driven application state
* Reusable component architecture
* Client-side derived filtering
* Responsive mobile-first design
* Graceful loading and error handling
* Accessibility-conscious implementation
* Clean separation of concerns
* Production-oriented code organization
