import { useState } from 'react'
import { Order, orders as allOrders } from '../../data/mockMarketplace'

interface OrderManagementProps {
  orders?: Order[]
}

const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  pending_payment: { label: '待付款', color: 'text-orange-600', bgColor: 'bg-orange-100' },
  pending_shipment: { label: '待发货', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  pending_receipt: { label: '待收货', color: 'text-primary-600', bgColor: 'bg-primary-100' },
  completed: { label: '已完成', color: 'text-green-600', bgColor: 'bg-green-100' },
  cancelled: { label: '已取消', color: 'text-gray-500', bgColor: 'bg-gray-100' },
  refunding: { label: '退款中', color: 'text-red-600', bgColor: 'bg-red-100' }
}

const tabs = [
  { key: 'all', label: '全部订单' },
  { key: 'pending_payment', label: '待付款' },
  { key: 'pending_shipment', label: '待发货' },
  { key: 'pending_receipt', label: '待收货' },
  { key: 'completed', label: '已完成' }
]

const OrderCard = ({ order }: { order: Order }) => {
  const [expanded, setExpanded] = useState(false)
  const status = statusConfig[order.status] || statusConfig.cancelled

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-500">订单号：{order.orderNumber}</span>
            <span className="text-gray-400">{order.createdAt}</span>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.color}`}>
            {status.label}
          </span>
        </div>

        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.product.id} className="flex items-center gap-4">
              <img
                src={item.product.images[0]}
                alt={item.product.name}
                className="w-20 h-20 object-cover rounded-lg bg-gray-100 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 line-clamp-1">{item.product.name}</h4>
                <p className="text-xs text-gray-500 mt-1">{item.product.subCategory}</p>
                <p className="text-xs text-gray-400 mt-1">x{item.quantity}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-semibold text-gray-900">¥{(item.price * item.quantity).toLocaleString()}</p>
                <p className="text-xs text-gray-400 mt-1">单价 ¥{item.price}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
          >
            {expanded ? '收起详情' : '查看详情'}
            <svg
              className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">实付：</span>
            <span className="text-lg font-bold text-red-500">¥{order.totalAmount.toLocaleString()}</span>
          </div>
        </div>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-4 bg-gray-50 -mx-6 px-6 py-4 rounded-b-xl">
            <div>
              <h5 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1.5">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                收货地址
              </h5>
              <p className="text-sm text-gray-700">
                {order.shippingAddress.recipient} {order.shippingAddress.phone}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {order.shippingAddress.province}{order.shippingAddress.city}{order.shippingAddress.district}
                {order.shippingAddress.detail}
              </p>
            </div>

            <div>
              <h5 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1.5">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                支付方式
              </h5>
              <p className="text-sm text-gray-700">{order.paymentMethod || '未支付'}</p>
            </div>

            {order.trackingNumber && (
              <div>
                <h5 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V4a1 1 0 00-1-1H4a1 1 0 00-1 1v16a1 1 0 001 1h2m8-1H9m4-1h2m0 0h2m-4 0v-4m0 4l-4-4" />
                  </svg>
                  物流信息
                </h5>
                <p className="text-sm text-gray-700 mb-2">运单号：{order.trackingNumber}</p>
                {order.logisticsInfo && order.logisticsInfo.length > 0 && (
                  <div className="relative pl-4 border-l-2 border-gray-200 space-y-3">
                    {order.logisticsInfo.map((step, idx) => (
                      <div key={idx} className="relative">
                        <div
                          className={`absolute -left-[21px] w-3 h-3 rounded-full border-2 ${
                            idx === 0 ? 'border-primary-500 bg-primary-500' : 'border-gray-300 bg-white'
                          }`}
                        />
                        <div className={`text-xs ${idx === 0 ? 'text-primary-600 font-medium' : 'text-gray-500'}`}>
                          {step.description}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">{step.time}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-2">
              {order.status === 'pending_payment' && (
                <>
                  <button className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors">
                    立即付款
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                    取消订单
                  </button>
                </>
              )}
              {order.status === 'pending_shipment' && (
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                  提醒发货
                </button>
              )}
              {order.status === 'pending_receipt' && (
                <>
                  <button className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors">
                    确认收货
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                    查看物流
                  </button>
                </>
              )}
              {order.status === 'completed' && (
                <>
                  <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600 transition-colors">
                    去评价
                  </button>
                  <button className="px-4 py-2 border border-primary-500 text-primary-500 rounded-lg text-sm font-medium hover:bg-primary-50 transition-colors">
                    再次购买
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                    申请售后
                  </button>
                </>
              )}
              {order.status === 'refunding' && (
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                  查看进度
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const OrderManagement = ({ orders: propOrders }: OrderManagementProps) => {
  const [activeTab, setActiveTab] = useState('all')
  const orders = propOrders || allOrders

  const filteredOrders = activeTab === 'all'
    ? orders
    : orders.filter(o => o.status === activeTab)

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <h1 className="text-2xl font-bold text-gray-900">我的订单</h1>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`relative px-5 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.key
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
            {tab.key !== 'all' && (
              <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-gray-200 rounded-full">
                {orders.filter(o => o.status === tab.key).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-gray-200">
          <svg className="w-16 h-16 text-gray-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-lg font-medium text-gray-900 mb-1">暂无相关订单</p>
          <p className="text-sm text-gray-500">快去市场挑选心仪的商品吧</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  )
}

export default OrderManagement
