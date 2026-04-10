import { useState, useEffect } from 'react'

interface WithdrawModalProps {
  isOpen: boolean
  onClose: () => void
  availableBalance: number
  onSuccess?: (amount: number, method: string) => void
}

type WithdrawMethod = 'bank' | 'alipay' | 'wechat'

const MIN_WITHDRAW = 100
const FEE_RATE = 0.005

const withdrawMethods: { value: WithdrawMethod; label: string; icon: string }[] = [
  { value: 'bank', label: '银行卡', icon: '🏦' },
  { value: 'alipay', label: '支付宝', icon: '💳' },
  { value: 'wechat', label: '微信支付', icon: '💬' }
]

const WithdrawModal = ({ isOpen, onClose, availableBalance, onSuccess }: WithdrawModalProps) => {
  const [amount, setAmount] = useState('')
  const [selectedMethod, setSelectedMethod] = useState<WithdrawMethod>('bank')
  const [showConfirm, setShowConfirm] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const withdrawAmount = parseFloat(amount) || 0
  const fee = withdrawAmount * FEE_RATE
  const actualAmount = withdrawAmount - fee

  const isValidAmount =
    withdrawAmount >= MIN_WITHDRAW && withdrawAmount <= availableBalance

  useEffect(() => {
    if (!isOpen) {
      setAmount('')
      setSelectedMethod('bank')
      setShowConfirm(false)
      setIsProcessing(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = () => {
    if (isValidAmount && !showConfirm) {
      setShowConfirm(true)
    } else if (showConfirm && !isProcessing) {
      setIsProcessing(true)
      setTimeout(() => {
        onSuccess?.(withdrawAmount, selectedMethod)
        setIsProcessing(false)
        onClose()
      }, 2000)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">提现</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {showConfirm ? (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 text-center">
                <p className="text-sm text-gray-600 mb-2">确认提现金额</p>
                <p className="text-3xl font-bold text-primary-600">
                  ¥{withdrawAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                </p>
              </div>

              <div className="space-y-3 bg-gray-50 rounded-xl p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">提现方式</span>
                  <span className="font-medium text-gray-900">
                    {withdrawMethods.find((m) => m.value === selectedMethod)?.label}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">手续费</span>
                  <span className="font-medium text-orange-600">¥{fee.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <span className="font-semibold text-gray-900">实际到账</span>
                  <span className="font-bold text-green-600 text-lg">
                    ¥{actualAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  ⚠️ 提现申请提交后，预计1-3个工作日内到账。请确保您的账户信息正确。
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  disabled={isProcessing}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  返回修改
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isProcessing}
                  className="flex-1 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      处理中...
                    </>
                  ) : (
                    '确认提现'
                  )}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-blue-50 rounded-xl p-4 mb-4">
                <p className="text-sm text-blue-700">
                  可用余额：¥{availableBalance.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  最低提现额度：¥{MIN_WITHDRAW}，手续费率：{(FEE_RATE * 100).toFixed(1)}%
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  提现金额
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                    ¥
                  </span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="请输入提现金额"
                    min={MIN_WITHDRAW}
                    max={availableBalance}
                    step="0.01"
                    className="w-full pl-10 pr-20 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg font-semibold"
                  />
                  <button
                    onClick={() => setAmount(availableBalance.toString())}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-xs font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
                  >
                    全部
                  </button>
                </div>
                {amount && (
                  <div className="mt-2 space-y-1">
                    {withdrawAmount < MIN_WITHDRAW && (
                      <p className="text-xs text-red-600">
                        最低提现金额为 ¥{MIN_WITHDRAW}
                      </p>
                    )}
                    {withdrawAmount > availableBalance && (
                      <p className="text-xs text-red-600">
                        超过可用余额
                      </p>
                    )}
                    {isValidAmount && (
                      <div className="bg-green-50 rounded-lg p-2">
                        <p className="text-xs text-green-700">
                          手续费：¥{fee.toFixed(2)} | 实际到账：¥{actualAmount.toFixed(2)}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  提现方式
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {withdrawMethods.map((method) => (
                    <button
                      key={method.value}
                      onClick={() => setSelectedMethod(method.value)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        selectedMethod === method.value
                          ? 'border-primary-500 bg-primary-50 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-2xl mb-2">{method.icon}</div>
                      <p className={`text-sm font-medium ${
                        selectedMethod === method.value ? 'text-primary-700' : 'text-gray-700'
                      }`}>
                        {method.label}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!isValidAmount}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
              >
                下一步
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default WithdrawModal
