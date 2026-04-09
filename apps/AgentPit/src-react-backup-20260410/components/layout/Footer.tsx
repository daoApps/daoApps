const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">AgentPit</h3>
            <p className="text-sm text-gray-600">
              智能体协作平台，为您提供全方位的AI解决方案
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">快速链接</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-primary-600 transition-colors">关于我们</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">使用文档</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">API 接口</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">联系我们</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">法律信息</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-primary-600 transition-colors">隐私政策</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">服务条款</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">Cookie 政策</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            © {currentYear} AgentPit. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
