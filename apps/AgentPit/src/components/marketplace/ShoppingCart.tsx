import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CartItem, Product, products } from '../../data/mockMarketplace'

const CART_STORAGE_KEY = 'marketplace_cart'

const loadCartFromStorage = (): CartItem[] => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    if (stored) {
      const parsed: CartItem[] = JSON.parse(stored)
      return parsed.map(item => ({
        ...item,
        product: products.find(p => p.id === item.product.id) || item.product
      })).filter(item => item.product)
    }
  } catch (e) {
    console.error('Failed to load cart:', e)
  }
  return []
}

const saveCartToStorage = (cart: CartItem[]) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  } catch (e) {
    console.error('Failed to save cart:', e)
  }
}

interface ShoppingCartProps {
  initialItems?: CartItem[]
}

const ShoppingCart = ({ initialItems }: ShoppingCartProps) => {
  const navigate = useNavigate()
  const [items, setItems] = useState<CartItem[]>(() => initialItems || loadCartFromStorage())

  useEffect(() => {
    saveCartToStorage(items)
  }, [items])

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return
    setItems(prev =>
      prev.map(item =>
        item.product.id === productId
          ? { ...item, quantity: Math.min(quantity, item.product.stock) }
          : item
      )
    )
  }

  const removeItem = (productId: string) => {
    setItems(prev => prev.filter(item => item.product.id !== productId))
  }

  const toggleSelect = (productId: string) => {
    setItems(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, selected: !item.selected } : item
      )
    )
  }

  const toggleSelectAll = () => {
    const allSelected = items.every(item => item.selected)
    setItems(prev => prev.map(item => ({ ...item, selected: !allSelected })))
  }

  const selectedItems = items.filter(item => item.selected)
  const subtotal = selectedItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const discount = selectedItems.reduce((sum, item) => {
    if (item.product.originalPrice) {
      return sum + (item.product.originalPrice - item.product.price) * item.quantity
    }
    return sum
  }, 0)
  const shipping = subtotal > 0 ? (subtotal >= 299 ? 0 : 15) : 0
  const total = subtotal - discount + shipping

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">购物车是空的</h3>
        <p className="text-gray-500 mb-6">快去挑选心仪的商品吧！</p>
        <button
          onClick={() => navigate('/marketplace')}
          className="px-6 py-3 bg-primary-500 text-white font-medium rounded-xl hover:bg-primary-600 transition-colors"
        >
          去逛逛
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">购物车 ({items.length})</h1>
        <button
          onClick={() => {
            if (confirm('确定要清空购物车吗？')) {
              setItems([])
            }
          }}
          className="text-sm text-red-500 hover:text-red-600 font-medium"
        >
          清空购物车
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-3 flex items-center gap-4 border-b border-gray-200">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={items.length > 0 && items.every(item => item.selected)}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700">全选</span>
              </label>
              <span className="text-sm text-gray-500 flex-1">商品信息</span>
              <span className="text-sm text-gray-500 w-20 text-center">单价</span>
              <span className="text-sm text-gray-500 w-28 text-center">数量</span>
              <span className="text-sm text-gray-500 w-24 text-center">小计</span>
              <span className="text-sm text-gray-500 w-16 text-center">操作</span>
            </div>

            <div className="divide-y divide-gray-100">
              {items.map((item) => (
                <div key={item.product.id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50/50 transition-colors">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.selected}
                      onChange={() => toggleSelect(item.product.id)}
                      className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                    />
                  </label>

                  <div
                    onClick={() => navigate(`/marketplace/product/${item.product.id}`)}
                    className="flex items-center gap-3 flex-1 cursor-pointer"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-lg bg-gray-100"
                    />
                    <div className="min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-2">{item.product.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">{item.product.subCategory}</p>
                      {item.product.tags.includes('digital') === false && item.product.type !== 'service' && (
                        <p className="text-xs text-green-600 mt-0.5">有货</p>
                      )}
                    </div>
                  </div>

                  <div className="w-20 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-semibold text-red-500">¥{item.product.price}</span>
                      {item.product.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">¥{item.product.originalPrice}</span>
                      )}
                    </div>
                  </div>

                  <div className="w-28 flex justify-center">
                    <div className="inline-flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition-colors"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value) || 1)}
                        className="w-12 h-8 text-center text-sm border-x border-gray-200 focus:outline-none"
                      />
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition-colors"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="w-24 text-center">
                    <span className="text-sm font-bold text-gray-900">
                      ¥{(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>

                  <div className="w-16 text-center">
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      title="删除"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-4">
            <h3 className="font-semibold text-gray-900 mb-4">订单摘要</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">已选商品</span>
                <span className="text-gray-900">{selectedItems.length} 件</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">商品总价</span>
                <span className="text-gray-900">¥{subtotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>优惠减免</span>
                  <span>- ¥{discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">运费</span>
                <span className={shipping === 0 ? 'text-green-600' : 'text-gray-900'}>
                  {shipping === 0 ? '免运费' : `¥${shipping}`}
                </span>
              </div>
              {subtotal > 0 && subtotal < 299 && (
                <p className="text-xs text-orange-500 bg-orange-50 px-3 py-2 rounded-lg">
                  再买 ¥{(299 - subtotal).toLocaleString()} 即可免运费
                </p>
              )}
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold text-gray-900">实付金额</span>
                  <span className="text-2xl font-bold text-red-500">¥{total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <button
              disabled={selectedItems.length === 0}
              className={`w-full mt-6 py-3.5 rounded-xl font-semibold text-base transition-all ${
                selectedItems.length > 0
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg hover:shadow-xl active:scale-[0.98]'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              结算 ({selectedItems.length})
            </button>

            <div className="mt-4 space-y-2 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>满 ¥299 包邮</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>7天无理由退换（部分商品除外）</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>正品保障 假一赔十</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShoppingCart
export { loadCartFromStorage, saveCartToStorage }
