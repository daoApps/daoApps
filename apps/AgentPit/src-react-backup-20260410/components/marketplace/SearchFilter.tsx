import { useState, useEffect, useCallback } from 'react'
import { categories, Category } from '../../data/mockMarketplace'

export interface FilterState {
  search: string
  category: string
  subCategory: string
  priceRange: [number, number]
  minRating: number
  sortBy: 'default' | 'price_asc' | 'price_desc' | 'sales' | 'rating' | 'newest' | 'discount'
  deliveryType: string[]
}

interface SearchFilterProps {
  onFilterChange: (filters: FilterState) => void
  totalResults: number
}

const defaultFilters: FilterState = {
  search: '',
  category: '',
  subCategory: '',
  priceRange: [0, 100000],
  minRating: 0,
  sortBy: 'default',
  deliveryType: []
}

const sortOptions = [
  { value: 'default', label: '综合排序', icon: '📊' },
  { value: 'sales', label: '销量优先', icon: '🔥' },
  { value: 'rating', label: '好评优先', icon: '⭐' },
  { value: 'newest', label: '最新上架', icon: '🆕' },
  { value: 'price_asc', label: '价格从低到高', icon: '↑' },
  { value: 'price_desc', label: '价格从高到低', icon: '↓' },
  { value: 'discount', label: '折扣力度', icon: '💰' }
]

const CategoryItem = ({ 
  category, 
  selectedCategory, 
  selectedSubCategory,
  onSelect,
  isExpanded,
  onToggleExpand
}: {
  category: Category
  selectedCategory: string
  selectedSubCategory: string
  onSelect: (categoryId: string, subCategoryId?: string) => void
  isExpanded: boolean
  onToggleExpand: () => void
}) => (
  <div>
    <button
      onClick={() => {
        if (category.children) {
          onToggleExpand()
        }
        onSelect(category.id)
      }}
      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
        selectedCategory === category.id && !selectedSubCategory
          ? 'bg-primary-50 text-primary-700 font-medium'
          : 'text-gray-700 hover:bg-gray-50'
      }`}
    >
      <div className="flex items-center gap-2.5">
        <span className="text-lg">{category.icon}</span>
        <span>{category.name}</span>
      </div>
      {category.children && (
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      )}
    </button>
    {category.children && isExpanded && (
      <div className="ml-4 mt-1 space-y-0.5">
        {category.children.map((sub) => (
          <button
            key={sub.id}
            onClick={() => onSelect(category.id, sub.id)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
              selectedSubCategory === sub.id
                ? 'bg-primary-50 text-primary-700 font-medium'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span>{sub.name}</span>
            <span className="text-xs text-gray-400">{sub.count}</span>
          </button>
        ))}
      </div>
    )}
  </div>
)

const SearchFilter = ({ onFilterChange, totalResults }: SearchFilterProps) => {
  const [filters, setFilters] = useState<FilterState>(defaultFilters)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchInput])

  useEffect(() => {
    onFilterChange({ ...filters, search: debouncedSearch })
  }, [filters, debouncedSearch])

  const updateFilter = useCallback(<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  const handleCategorySelect = (categoryId: string, subCategoryId?: string) => {
    setFilters(prev => ({
      ...prev,
      category: categoryId,
      subCategory: subCategoryId || ''
    }))
    if (!subCategoryId) {
      setExpandedCategories(prev => {
        const next = new Set(prev)
        if (next.has(categoryId)) {
          next.delete(categoryId)
        } else {
          next.add(categoryId)
        }
        return next
      })
    }
  }

  const toggleCategoryExpand = (categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev)
      if (next.has(categoryId)) {
        next.delete(categoryId)
      } else {
        next.add(categoryId)
      }
      return next
    })
  }

  const clearAllFilters = () => {
    setFilters(defaultFilters)
    setSearchInput('')
  }

  const activeFilterCount = [
    filters.search,
    filters.category,
    filters.subCategory,
    filters.minRating > 0 ? String(filters.minRating) : '',
    filters.priceRange[0] > 0 || filters.priceRange[1] < 100000 ? '1' : '',
    filters.deliveryType.length > 0 ? '1' : ''
  ].filter(Boolean).length

  return (
    <div className="space-y-4">
      <div className="flex gap-3 items-center">
        <div className="flex-1 relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="搜索商品、服务、课程..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          />
          {searchInput && (
            <button
              onClick={() => setSearchInput('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <button
          onClick={() => setShowMobileFilters(true)}
          className="lg:hidden flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-primary-500 transition-colors relative"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          筛选
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      <div className="flex gap-4">
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-4 space-y-4">
            <h3 className="font-semibold text-gray-900 text-sm">全部分类</h3>
            <div className="space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto">
              <button
                onClick={() => handleCategorySelect('')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  !filters.category ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span>📦</span>
                <span>全部商品</span>
              </button>
              {categories.map((category) => (
                <CategoryItem
                  key={category.id}
                  category={category}
                  selectedCategory={filters.category}
                  selectedSubCategory={filters.subCategory}
                  onSelect={handleCategorySelect}
                  isExpanded={expandedCategories.has(category.id)}
                  onToggleExpand={() => toggleCategoryExpand(category.id)}
                />
              ))}
            </div>
          </div>
        </aside>

        <div className="flex-1 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-500">排序：</span>
                <div className="flex gap-1.5 flex-wrap">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updateFilter('sortBy', option.value as FilterState['sortBy'])}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        filters.sortBy === option.value
                          ? 'bg-primary-500 text-white shadow-sm'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="ml-auto text-sm text-gray-500">
                共 <span className="font-semibold text-primary-600">{totalResults}</span> 个结果
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-500 whitespace-nowrap">价格</label>
                <input
                  type="number"
                  placeholder="最低"
                  value={filters.priceRange[0] || ''}
                  onChange={(e) => updateFilter('priceRange', [parseInt(e.target.value) || 0, filters.priceRange[1]])}
                  className="w-20 px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  placeholder="最高"
                  value={filters.priceRange[1] >= 100000 ? '' : filters.priceRange[1]}
                  onChange={(e) => updateFilter('priceRange', [filters.priceRange[0], parseInt(e.target.value) || 100000])}
                  className="w-20 px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-500 whitespace-nowrap">评分</label>
                <select
                  value={filters.minRating}
                  onChange={(e) => updateFilter('minRating', Number(e.target.value))}
                  className="px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white"
                >
                  <option value={0}>不限</option>
                  <option value={4}>4分以上</option>
                  <option value={4.5}>4.5分以上</option>
                  <option value={4.8}>4.8分以上</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-500 whitespace-nowrap">类型</label>
                {['digital', 'physical', 'service'].map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      const types = [...filters.deliveryType]
                      const idx = types.indexOf(type)
                      if (idx > -1) {
                        types.splice(idx, 1)
                      } else {
                        types.push(type)
                      }
                      updateFilter('deliveryType', types)
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      filters.deliveryType.includes(type)
                        ? 'bg-primary-100 text-primary-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {type === 'digital' ? '数字产品' : type === 'physical' ? '实体商品' : '服务'}
                  </button>
                ))}
              </div>

              {activeFilterCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="ml-auto text-xs text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  清除筛选
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-full bg-white shadow-2xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between z-10">
              <h3 className="font-semibold text-gray-900">筛选条件</h3>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">分类</h4>
                <div className="space-y-1">
                  <button
                    onClick={() => handleCategorySelect('')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm ${!filters.category ? 'bg-primary-50 text-primary-700 font-medium' : 'hover:bg-gray-50'}`}
                  >
                    全部商品
                  </button>
                  {categories.map((cat) => (
                    <CategoryItem
                      key={cat.id}
                      category={cat}
                      selectedCategory={filters.category}
                      selectedSubCategory={filters.subCategory}
                      onSelect={handleCategorySelect}
                      isExpanded={expandedCategories.has(cat.id)}
                      onToggleExpand={() => toggleCategoryExpand(cat.id)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">价格区间</h4>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    placeholder="最低价"
                    value={filters.priceRange[0] || ''}
                    onChange={(e) => updateFilter('priceRange', [parseInt(e.target.value) || 0, filters.priceRange[1]])}
                    className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <span className="text-gray-400">-</span>
                  <input
                    type="number"
                    placeholder="最高价"
                    value={filters.priceRange[1] >= 100000 ? '' : filters.priceRange[1]}
                    onChange={(e) => updateFilter('priceRange', [filters.priceRange[0], parseInt(e.target.value) || 100000])}
                    className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">最低评分</h4>
                <select
                  value={filters.minRating}
                  onChange={(e) => updateFilter('minRating', Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value={0}>不限</option>
                  <option value={4}>4分以上</option>
                  <option value={4.5}>4.5分以上</option>
                  <option value={4.8}>4.8分以上</option>
                </select>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">商品类型</h4>
                <div className="space-y-2">
                  {[
                    { value: 'digital', label: '数字产品' },
                    { value: 'physical', label: '实体商品' },
                    { value: 'service', label: '专业服务' }
                  ].map((type) => (
                    <label key={type.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.deliveryType.includes(type.value)}
                        onChange={() => {
                          const types = [...filters.deliveryType]
                          const idx = types.indexOf(type.value)
                          if (idx > -1) {
                            types.splice(idx, 1)
                          } else {
                            types.push(type.value)
                          }
                          updateFilter('deliveryType', types)
                        }}
                        className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex gap-3">
              <button
                onClick={clearAllFilters}
                className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
              >
                重置
              </button>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="flex-1 py-2.5 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600"
              >
                确定 ({totalResults})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchFilter
export type { FilterState }
