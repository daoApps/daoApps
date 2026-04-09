import { WalletData } from '../../data/mockMonetization'

interface WalletCardProps {
  data: WalletData
  onRecharge?: () => void
  onWithdraw?: () => void
}

const formatCurrency = (amount: number, currency: string): string => {
  const symbol = currency === 'CNY' ? '¥' : '$'
  return `${symbol} ${amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const WalletCard = ({ data, onRecharge, onWithdraw }: WalletCardProps) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 p-6 shadow-xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-white/80 text-sm font-medium">总余额</p>
            <h2 className="text-3xl font-bold text-white mt-1">
              {formatCurrency(data.totalBalance, data.currency)}
            </h2>
          </div>
          <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
            <span className="text-3xl">💰</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4">
            <p className="text-white/70 text-xs font-medium mb-1">可用余额</p>
            <p className="text-lg font-semibold text-white">
              {formatCurrency(data.availableBalance, data.currency)}
            </p>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4">
            <p className="text-white/70 text-xs font-medium mb-1">冻结金额</p>
            <p className="text-lg font-semibold text-white">
              {formatCurrency(data.frozenBalance, data.currency)}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onRecharge}
            className="flex-1 bg-white hover:bg-white/90 text-teal-600 font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            充值
          </button>
          <button
            onClick={onWithdraw}
            className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 border border-white/30"
          >
            提现
          </button>
        </div>
      </div>
    </div>
  )
}

export default WalletCard
