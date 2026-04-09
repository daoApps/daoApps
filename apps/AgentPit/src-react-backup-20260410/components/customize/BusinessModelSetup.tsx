import { useState, useEffect } from 'react'

interface BusinessModelSetupProps {
  data: {
    mode: 'free' | 'subscription' | 'payPerUse' | 'freemium' | 'adRevenue'
    pricing: {
      currency: string
      monthlyPrice?: number
      yearlyPrice?: number
      perUsePrice?: number
      trialDays?: number
    }
    membershipLevels: Array<{
      name: string
      price: number
      features: string[]
    }>
    serviceLimits: {
      dailyLimit?: number
      monthlyLimit?: number
      responseTime: string
    }
    paymentMethods: string[]
    platformCommission: number
  }
  onChange: (data: any) => void
}

const BusinessModelSetup = ({ data, onChange }: BusinessModelSetupProps) => {
  const [estimatedUsers, setEstimatedUsers] = useState(1000)
  const [conversionRate, setConversionRate] = useState(5)

  const modes = [
    {
      id: 'free',
      name: '免费模式',
      icon: '🆓',
      description: '公益或个人使用，不收取任何费用'
    },
    {
      id: 'subscription',
      name: '付费订阅',
      icon: '💳',
      description: '月费或年费制，用户定期支付订阅费'
    },
    {
      id: 'payPerUse',
      name: '按次付费',
      icon: '💰',
      description: '每次对话或每次使用收取固定费用'
    },
    {
      id: 'freemium',
      name: '增值服务',
      icon: '⭐',
      description: '基础功能免费，高级功能需要付费解锁'
    },
    {
      id: 'adRevenue',
      name: '广告分成',
      icon: '📢',
      description: '在对话中嵌入广告，通过广告获得收益'
    }
  ]

  const currencies = [
    { value: 'CNY', label: '人民币 (¥)', symbol: '¥' },
    { value: 'USD', label: '美元 ($)', symbol: '$' },
    { value: 'EUR', label: '欧元 (€)', symbol: '€' },
    { value: 'GBP', label: '英镑 (£)', symbol: '£' }
  ]

  const paymentOptions = [
    { id: 'alipay', name: '支付宝', icon: '💙' },
    { id: 'wechat', name: '微信支付', icon: '💚' },
    { id: 'creditcard', name: '信用卡', icon: '💳' },
    { id: 'crypto', name: '加密货币', icon: '₿' }
  ]

  const calculateRevenueEstimate = () => {
    let monthlyRevenue = 0

    switch (data.mode) {
      case 'subscription':
        monthlyRevenue = estimatedUsers * (conversionRate / 100) * (data.pricing.monthlyPrice || 0)
        break
      case 'payPerUse':
        const usesPerUser = 20
        monthlyRevenue = estimatedUsers * (conversionRate / 100) * usesPerUser * (data.pricing.perUsePrice || 0)
        break
      case 'freemium':
        const payingUsers = estimatedUsers * (conversionRate / 100)
        monthlyRevenue = payingUsers * (data.pricing.monthlyPrice || 0)
        break
      case 'adRevenue':
        const adRevenuePerUser = 2.5
        monthlyRevenue = estimatedUsers * adRevenuePerUser
        break
      default:
        monthlyRevenue = 0
    }

    const platformFee = monthlyRevenue * (data.platformCommission / 100)
    const netRevenue = monthlyRevenue - platformFee

    return {
      gross: Math.round(monthlyRevenue),
      platformFee: Math.round(platformFee),
      net: Math.round(netRevenue),
      yearly: Math.round(netRevenue * 12)
    }
  }

  const revenue = calculateRevenueEstimate()

  const handleTogglePayment = (methodId: string) => {
    if (data.paymentMethods.includes(methodId)) {
      onChange({
        ...data,
        paymentMethods: data.paymentMethods.filter(m => m !== methodId)
      })
    } else {
      onChange({
        ...data,
        paymentMethods: [...data.paymentMethods, methodId]
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* 盈利模式选择 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="mr-2">💼</span>
          盈利模式选择
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {modes.map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => onChange({ ...data, mode: mode.id as any })}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                data.mode === mode.id
                  ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="text-3xl mb-2">{mode.icon}</div>
              <h4 className="font-semibold text-gray-900 text-sm">{mode.name}</h4>
              <p className="text-xs text-gray-600 mt-1">{mode.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* 定价策略 */}
      {(data.mode === 'subscription' || data.mode === 'freemium') && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">💵</span>
            定价策略设置
          </h3>

          <div className="space-y-4">
            {/* 货币选择 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">货币类型</label>
              <select
                value={data.pricing.currency}
                onChange={(e) => onChange({
                  ...data,
                  pricing: { ...data.pricing, currency: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {currencies.map((currency) => (
                  <option key={currency.value} value={currency.value}>
                    {currency.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 价格输入 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  月度价格 ({currencies.find(c => c.value === data.pricing.currency)?.symbol})
                </label>
                <input
                  type="number"
                  value={data.pricing.monthlyPrice || ''}
                  onChange={(e) => onChange({
                    ...data,
                    pricing: { ...data.pricing, monthlyPrice: parseFloat(e.target.value) || 0 }
                  })}
                  placeholder="29.9"
                  min="0"
                  step="0.1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  年度价格 ({currencies.find(c => c.value === data.pricing.currency)?.symbol})
                </label>
                <input
                  type="number"
                  value={data.pricing.yearlyPrice || ''}
                  onChange={(e) => onChange({
                    ...data,
                    pricing: { ...data.pricing, yearlyPrice: parseFloat(e.target.value) || 0 }
                  })}
                  placeholder="299"
                  min="0"
                  step="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* 试用期 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                免费试用天数
              </label>
              <input
                type="number"
                value={data.pricing.trialDays || ''}
                onChange={(e) => onChange({
                  ...data,
                  pricing: { ...data.pricing, trialDays: parseInt(e.target.value) || 0 }
                })}
                placeholder="7"
                min="0"
                max="90"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <p className="mt-1 text-xs text-gray-500">设置为 0 表示不提供试用期</p>
            </div>

            {/* 会员等级体系 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">会员等级体系</label>
              <div className="space-y-3">
                {['普通用户', 'VIP会员', 'SVIP会员'].map((levelName, index) => (
                  <div key={levelName} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{levelName}</h4>
                      {index > 0 && (
                        <input
                          type="number"
                          placeholder="价格"
                          onChange={(e) => {
                            const newLevels = [...(data.membershipLevels || [])]
                            while (newLevels.length <= index) {
                              newLevels.push({ name: '', price: 0, features: [] })
                            }
                            newLevels[index] = {
                              ...newLevels[index],
                              name: levelName,
                              price: parseFloat(e.target.value) || 0
                            }
                            onChange({ ...data, membershipLevels: newLevels })
                          }}
                          className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      )}
                    </div>
                    <textarea
                      placeholder="该等级的特权功能，每行一个..."
                      rows={2}
                      onChange={(e) => {
                        const newLevels = [...(data.membershipLevels || [])]
                        while (newLevels.length <= index) {
                          newLevels.push({ name: '', price: 0, features: [] })
                        }
                        newLevels[index] = {
                          ...newLevels[index],
                          name: levelName,
                          features: e.target.value.split('\n').filter(f => f.trim())
                        }
                        onChange({ ...data, membershipLevels: newLevels })
                      }}
                      className="w-full px-3 py-2 border border-gray-200 rounded text-sm resize-none"
                    ></textarea>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 按次付费定价 */}
      {data.mode === 'payPerUse' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">💰</span>
            按次付费设置
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                每次使用价格 ({currencies.find(c => c.value === data.pricing.currency)?.symbol})
              </label>
              <input
                type="number"
                value={data.pricing.perUsePrice || ''}
                onChange={(e) => onChange({
                  ...data,
                  pricing: { ...data.pricing, perUsePrice: parseFloat(e.target.value) || 0 }
                })}
                placeholder="0.5"
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                💡 <strong>建议：</strong>按次付费适合低频高价值场景。建议价格范围：¥0.1 - ¥5.0/次
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 服务范围定义 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="mr-2">🎯</span>
          服务范围与限制
        </h3>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                每日使用次数限制
              </label>
              <input
                type="number"
                value={data.serviceLimits.dailyLimit || ''}
                onChange={(e) => onChange({
                  ...data,
                  serviceLimits: { ...data.serviceLimits, dailyLimit: parseInt(e.target.value) || undefined }
                })}
                placeholder="不限制"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                每月使用次数限制
              </label>
              <input
                type="number"
                value={data.serviceLimits.monthlyLimit || ''}
                onChange={(e) => onChange({
                  ...data,
                  serviceLimits: { ...data.serviceLimits, monthlyLimit: parseInt(e.target.value) || undefined }
                })}
                placeholder="不限制"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              响应速度承诺
            </label>
            <select
              value={data.serviceLimits.responseTime}
              onChange={(e) => onChange({
                ...data,
                serviceLimits: { ...data.serviceLimits, responseTime: e.target.value }
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="< 1秒">&lt; 1秒 (极速)</option>
              <option value="< 3秒">&lt; 3秒 (快速)</option>
              <option value="< 5秒">&lt; 5秒 (标准)</option>
              <option value="< 10秒">&lt; 10秒 (普通)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 支付方式 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="mr-2">💳</span>
          支付方式配置
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {paymentOptions.map((method) => (
            <button
              key={method.id}
              type="button"
              onClick={() => handleTogglePayment(method.id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                data.paymentMethods.includes(method.id)
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-1">{method.icon}</div>
              <p className="text-sm font-medium text-gray-900">{method.name}</p>
              {data.paymentMethods.includes(method.id) && (
                <p className="text-xs text-green-600 mt-1">✓ 已启用</p>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 平台分成 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="mr-2">📊</span>
          平台分成比例
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              平台抽成比例: {data.platformCommission}%
            </label>
            <input
              type="range"
              min="5"
              max="50"
              value={data.platformCommission}
              onChange={(e) => onChange({ ...data, platformCommission: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>5% (您得95%)</span>
              <span>50% (您得50%)</span>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-800">
              <strong>您的收益比例：</strong>{100 - data.platformCommission}% |
              <strong>平台收益比例：</strong>{data.platformCommission}%
            </p>
          </div>
        </div>
      </div>

      {/* 收益预估计算器 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="mr-2">📈</span>
          收益预估计算器
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 输入参数 */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                预计月活跃用户数
              </label>
              <input
                type="number"
                value={estimatedUsers}
                onChange={(e) => setEstimatedUsers(parseInt(e.target.value) || 0)}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                付费转化率 (%)
              </label>
              <input
                type="range"
                min="1"
                max="30"
                value={conversionRate}
                onChange={(e) => setConversionRate(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1%</span>
                <span className="font-semibold text-primary-600">{conversionRate}%</span>
                <span>30%</span>
              </div>
            </div>
          </div>

          {/* 预估结果 */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-6 border border-yellow-200">
            <h4 className="font-semibold text-gray-900 mb-4">收益预测</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">月总收入</span>
                <span className="text-xl font-bold text-gray-900">
                  ¥{revenue.gross.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">平台抽成 ({data.platformCommission}%)</span>
                <span className="text-red-600">-¥{revenue.platformFee.toLocaleString()}</span>
              </div>
              <div className="pt-3 border-t border-yellow-300">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">月净收入</span>
                  <span className="text-2xl font-bold text-green-600">
                    ¥{revenue.net.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="pt-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">年净收入预估</span>
                  <span className="font-semibold text-green-700">
                    ¥{revenue.yearly.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BusinessModelSetup
