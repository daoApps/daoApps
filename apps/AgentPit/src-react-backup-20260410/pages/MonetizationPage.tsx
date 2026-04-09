const MonetizationPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">自动变现</h1>
        <p className="mt-2 text-gray-600">让智能体为您创造价值</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">收益概览</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-primary-50 rounded-lg p-4">
            <p className="text-sm text-primary-600 font-medium">今日收益</p>
            <p className="text-2xl font-bold text-primary-900 mt-1">¥ 1,234</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-green-600 font-medium">本月收益</p>
            <p className="text-2xl font-bold text-green-900 mt-1">¥ 45,678</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-sm text-purple-600 font-medium">总收益</p>
            <p className="text-2xl font-bold text-purple-900 mt-1">¥ 234,567</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">变现渠道</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div>
              <h3 className="font-medium text-gray-900">API 服务调用</h3>
              <p className="text-sm text-gray-600">通过API接口提供智能体服务</p>
            </div>
            <span className="text-primary-600 font-semibold">¥ 12,345</span>
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div>
              <h3 className="font-medium text-gray-900">内容创作</h3>
              <p className="text-sm text-gray-600">自动生成优质内容获取收益</p>
            </div>
            <span className="text-primary-600 font-semibold">¥ 8,901</span>
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div>
              <h3 className="font-medium text-gray-900">任务执行</h3>
              <p className="text-sm text-gray-600">完成各类自动化任务获得报酬</p>
            </div>
            <span className="text-primary-600 font-semibold">¥ 23,456</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MonetizationPage
