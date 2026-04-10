import { useState, useMemo } from 'react'
import { Routes, Route, useParams } from 'react-router-dom'
import ProductGrid from '../components/marketplace/ProductGrid'
import ProductDetail from '../components/marketplace/ProductDetail'
import SearchFilter, { FilterState } from '../components/marketplace/SearchFilter'
import ShoppingCart from '../components/marketplace/ShoppingCart'
import OrderManagement from '../components/marketplace/OrderManagement'
import SellerCenter from '../components/marketplace/SellerCenter'
import { products, categories } from '../data/mockMarketplace'

const MarketplaceHome = () => {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: '',
    subCategory: '',
    priceRange: [0, 100000],
    minRating: 0,
    sortBy: 'default',
    deliveryType: []
  })

  const filteredProducts = useMemo(() => {
    let result = [...products]

    if (filters.search) {
      const keyword = filters.search.toLowerCase()
      result = result.filter(p =>
        p.name.toLowerCase().includes(keyword) ||
        p.description.toLowerCase().includes(keyword) ||
        p.subCategory.toLowerCase().includes(keyword)
      )
    }

    if (filters.category && !filters.subCategory) {
      result = result.filter(p => p.category === categories.find(c => c.id === filters.category)?.name)
    } else if (filters.subCategory) {
      const cat = categories.find(c => c.id === filters.category)
      const subCat = cat?.children?.find(s => s.id === filters.subCategory)
      if (subCat) {
        result = result.filter(p => p.subCategory === subCat.name)
      }
    }

    result = result.filter(
      p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    )

    if (filters.minRating > 0) {
      result = result.filter(p => p.rating >= filters.minRating)
    }

    if (filters.deliveryType.length > 0) {
      result = result.filter(p => filters.deliveryType.includes(p.type))
    }

    switch (filters.sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price_desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'sales':
        result.sort((a, b) => b.salesCount - a.salesCount)
        break
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'discount':
        result.sort((a, b) => {
          const discountA = a.originalPrice ? (1 - a.price / a.originalPrice) : 0
          const discountB = b.originalPrice ? (1 - b.price / b.originalPrice) : 0
          return discountB - discountA
        })
        break
      default:
        break
    }

    return result
  }, [filters])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">交易市场</h1>
          <p className="mt-2 text-gray-600">发现优质AI产品与服务，开启智能新体验</p>
        </div>
      </div>

      <SearchFilter onFilterChange={setFilters} totalResults={filteredProducts.length} />

      <ProductGrid products={filteredProducts} />
    </div>
  )
}

const ProductPageWrapper = () => {
  const { id } = useParams()
  return <ProductDetail />
}

const MarketplacePage = () => {
  return (
    <Routes>
      <Route index element={<MarketplaceHome />} />
      <Route path="product/:id" element={<ProductPageWrapper />} />
      <Route path="cart" element={<ShoppingCart />} />
      <Route path="orders" element={<OrderManagement />} />
      <Route path="seller" element={<SellerCenter />} />
    </Routes>
  )
}

export default MarketplacePage
