import { useParams, useNavigate, useLocation } from 'react-router-dom'
import AgentCreatorWizard from '../components/customize/AgentCreatorWizard'
import MyAgentsList from '../components/customize/MyAgentsList'
import AgentAnalytics from '../components/customize/AgentAnalytics'

const CustomizePage = () => {
  const { id, action } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const handleEditAgent = (agentId: string) => {
    navigate(`/customize/${agentId}/edit`)
  }

  const handleViewAnalytics = (agentId: string) => {
    navigate(`/customize/${agentId}/analytics`)
  }

  const renderContent = () => {
    if (location.pathname.includes('/my-agents')) {
      return <MyAgentsList onEditAgent={handleEditAgent} onViewAnalytics={handleViewAnalytics} />
    }

    if (id && action === 'analytics') {
      return <AgentAnalytics agentId={id} />
    }

    if (id && action === 'edit') {
      return (
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="mb-6 flex items-center space-x-4">
              <button
                onClick={() => navigate('/customize/my-agents')}
                className="px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              >
                ← 返回列表
              </button>
              <h1 className="text-3xl font-bold text-gray-900">编辑智能体</h1>
            </div>
            <AgentCreatorWizard />
          </div>
        </div>
      )
    }

    return <AgentCreatorWizard />
  }

  return renderContent()
}

export default CustomizePage
