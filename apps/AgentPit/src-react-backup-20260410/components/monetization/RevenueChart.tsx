import { useState } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import type { RevenueDataPoint, SourceDistribution } from '../../data/mockMonetization'

interface RevenueChartProps {
  data: RevenueDataPoint[]
  sourceData: SourceDistribution[]
}

type TimeRange = '7' | '30' | '90' | '365'
type ChartView = 'line' | 'bar'

const timeRanges: { value: TimeRange; label: string }[] = [
  { value: '7', label: '7天' },
  { value: '30', label: '30天' },
  { value: '90', label: '90天' },
  { value: '365', label: '1年' }
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-md rounded-lg shadow-xl border border-gray-100 p-4">
        <p className="text-sm font-semibold text-gray-900 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: ¥{entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    )
  }
  return null
}

const RevenueChart = ({ data, sourceData }: RevenueChartProps) => {
  const [selectedRange, setSelectedRange] = useState<TimeRange>('30')
  const [chartView, setChartView] = useState<ChartView>('line')

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="text-lg font-bold text-gray-900">收益趋势</h3>

        <div className="flex flex-wrap gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {timeRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => setSelectedRange(range.value)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                  selectedRange === range.value
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>

          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setChartView('line')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                chartView === 'line'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              折线图
            </button>
            <button
              onClick={() => setChartView('bar')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                chartView === 'bar'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              柱状图
            </button>
          </div>
        </div>
      </div>

      <div className="h-[300px] mb-8">
        <ResponsiveContainer width="100%" height="100%">
          {chartView === 'line' ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
                tickFormatter={(value) => `¥${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: '13px', paddingTop: '16px' }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                name="收入"
                stroke="#0ea5e9"
                strokeWidth={3}
                dot={{ fill: '#0ea5e9', r: 4, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, fill: '#0ea5e9', stroke: '#fff', strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="profit"
                name="净利润"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: '#10b981', r: 4, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
              />
            </LineChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
                tickFormatter={(value) => `¥${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: '13px', paddingTop: '16px' }}
              />
              <Bar
                dataKey="revenue"
                name="收入"
                fill="#0ea5e9"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="expenses"
                name="支出"
                fill="#f59e0b"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="border-t border-gray-100 pt-6">
        <h4 className="text-base font-semibold text-gray-900 mb-4">收入来源分布</h4>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => `${value}%`}
                  contentStyle={{
                    borderRadius: '8px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3">
            {sourceData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium text-gray-700">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RevenueChart
