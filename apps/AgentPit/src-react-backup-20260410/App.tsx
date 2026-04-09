import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import HomePage from './pages/HomePage'
import MonetizationPage from './pages/MonetizationPage'
import SphinxPage from './pages/SphinxPage'
import ChatPage from './pages/ChatPage'
import SocialPage from './pages/SocialPage'
import MarketplacePage from './pages/MarketplacePage'
import CollaborationPage from './pages/CollaborationPage'
import MemoryPage from './pages/MemoryPage'
import CustomizePage from './pages/CustomizePage'
import LifestylePage from './pages/LifestylePage'
import SettingsPage from './pages/SettingsPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="monetization" element={<MonetizationPage />} />
          <Route path="sphinx" element={<SphinxPage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="social" element={<SocialPage />} />
          <Route path="marketplace" element={<MarketplacePage />} />
          <Route path="collaboration" element={<CollaborationPage />} />
          <Route path="memory" element={<MemoryPage />} />
          <Route path="customize" element={<CustomizePage />} />
          <Route path="customize/my-agents" element={<CustomizePage />} />
          <Route path="customize/:id/edit" element={<CustomizePage />} />
          <Route path="customize/:id/analytics" element={<CustomizePage />} />
          <Route path="lifestyle" element={<LifestylePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
