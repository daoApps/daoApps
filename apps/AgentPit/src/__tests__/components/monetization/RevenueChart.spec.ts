import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RevenueChart from '@/components/monetization/RevenueChart.vue'

const mockRevenueData = [
  {
    date: '4月1日',
    revenue: 5000,
    expenses: 1200,
    profit: 3800
  },
  {
    date: '4月2日',
    revenue: 6200,
    expenses: 1500,
    profit: 4700
  },
  {
    date: '4月3日',
    revenue: 5800,
    expenses: 1300,
    profit: 4500
  }
]

const mockSourceData = [
  { name: '智能体服务', value: 45, color: '#0ea5e9' },
  { name: '建站分成', value: 25, color: '#10b981' },
  { name: '商品销售', value: 18, color: '#f59e0b' },
  { name: '其他收入', value: 12, color: '#8b5cf6' }
]

describe('RevenueChart', () => {
  it('should render chart component', () => {
    const wrapper = mount(RevenueChart, {
      props: {
        data: mockRevenueData,
        sourceData: mockSourceData
      }
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('should display revenue trend title', () => {
    const wrapper = mount(RevenueChart, {
      props: {
        data: mockRevenueData,
        sourceData: mockSourceData
      }
    })

    expect(wrapper.text()).toContain('收益趋势')
  })

  it('should display time range buttons', () => {
    const wrapper = mount(RevenueChart, {
      props: {
        data: mockRevenueData,
        sourceData: mockSourceData
      }
    })

    expect(wrapper.text()).toContain('7天')
    expect(wrapper.text()).toContain('30天')
    expect(wrapper.text()).toContain('90天')
    expect(wrapper.text()).toContain('1年')
  })

  it('should display chart type toggle buttons', () => {
    const wrapper = mount(RevenueChart, {
      props: {
        data: mockRevenueData,
        sourceData: mockSourceData
      }
    })

    expect(wrapper.text()).toContain('折线图')
    expect(wrapper.text()).toContain('柱状图')
  })

  it('should display income distribution section', () => {
    const wrapper = mount(RevenueChart, {
      props: {
        data: mockRevenueData,
        sourceData: mockSourceData
      }
    })

    expect(wrapper.text()).toContain('收入来源分布')
  })

  it('should display all source data items', () => {
    const wrapper = mount(RevenueChart, {
      props: {
        data: mockRevenueData,
        sourceData: mockSourceData
      }
    })

    for (const item of mockSourceData) {
      expect(wrapper.text()).toContain(item.name)
      expect(wrapper.text()).toContain(`${item.value}%`)
    }
  })
})
