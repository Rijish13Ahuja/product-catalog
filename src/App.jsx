import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header'
import ProductListingPage from './pages/ProductListingPage'
import ProductDetailPage from './pages/ProductDetailPage'

function App() {
  return (
    <BrowserRouter>
      {/* Header is outside Routes so it persists across page transitions */}
      <Header />
      <Routes>
        <Route path="/" element={<ProductListingPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
