import { useState, useMemo } from 'react'
import type { TransactionRecord } from '../../data/mockMonetization'

interface TransactionHistoryProps {
  transactions: TransactionRecord[]
}

type FilterType = 'all' | 'income' | 'expense'
type FilterStatus = 'all' | 'success' | 'processing' | 'failed'

const ITEMS_PER_PAGE = 5

const statusConfig = {
  success: {
    label: '成功',
    bg: 'bg-green-100',
    text: 'text-green-700',
    dot: 'bg-green-500'
  },
  processing: {
    label: '处理中',
    bg: 'bg-yellow-100',
    text: 'text-yellow-700',
    dot: 'bg-yellow-500'
  },
  failed: {
    label: '失败',
    bg: 'bg-red-100',
    text: 'text-red-700',
    dot: 'bg-red-500'
  }
}

const TransactionHistory = ({ transactions }: TransactionHistoryProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<FilterType>('all')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [currentPage, setCurrentPage] = useState(1)

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesSearch =
        searchQuery === '' ||
        tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.description.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesType = filterType === 'all' || tx.type === filterType
      const matchesStatus = filterStatus === 'all' || tx.status === filterStatus

      return matchesSearch && matchesType && matchesStatus
    })
  }, [transactions, searchQuery, filterType, filterStatus])

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE)
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const formatAmount = (amount: number, type: string) => {
    const prefix = type === 'income' ? '+' : '-'
    const colorClass = type === 'income' ? 'text-green-600' : 'text-red-600'
    return (
      <span className={`font-semibold ${colorClass}`}>
        {prefix}¥{amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
      </span>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <h3 className="text-lg font-bold text-gray-900">交易历史</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            共 {filteredTransactions.length} 条记录
          </span>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-100">
          <div className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="搜索交易ID或描述..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                />
              </div>

              <select
                value={filterType}
                onChange={(e) => {
                  setFilterType(e.target.value as FilterType)
                  setCurrentPage(1)
                }}
                className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white"
              >
                <option value="all">全部类型</option>
                <option value="income">收入</option>
                <option value="expense">支出</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value as FilterStatus)
                  setCurrentPage(1)
                }}
                className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white"
              >
                <option value="all">全部状态</option>
                <option value="success">成功</option>
                <option value="processing">处理中</option>
                <option value="failed">失败</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      交易ID
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      描述
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      类型
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      金额
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      状态
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      时间
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <span className="text-sm font-mono text-gray-900">{tx.id}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{tx.description}</p>
                          <p className="text-xs text-gray-500">{tx.category}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            tx.type === 'income'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {tx.type === 'income' ? '收入' : '支出'}
                        </span>
                      </td>
                      <td className="py-4 px-4">{formatAmount(tx.amount, tx.type)}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[tx.status].bg} ${statusConfig[tx.status].text}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${statusConfig[tx.status].dot}`} />
                          {statusConfig[tx.status].label}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-500">{tx.timestamp}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {paginatedTransactions.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-400">暂无匹配的交易记录</p>
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  显示 {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{' '}
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredTransactions.length)} 条，共{' '}
                  {filteredTransactions.length} 条
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    上一页
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                        currentPage === page
                          ? 'bg-primary-500 text-white'
                          : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    下一页
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default TransactionHistory
