import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { useUIStore } from '../../stores/uiStore'
import { Menu, Save, Share2, LogOut, PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen } from 'lucide-react'

export default function Header() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { leftSidebarOpen, rightPanelOpen, toggleLeftSidebar, toggleRightPanel } = useUIStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="h-16 bg-bg-secondary border-b border-border-color flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleLeftSidebar}
          className="p-2 hover:bg-bg-tertiary rounded-md transition-colors"
          title={leftSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          {leftSidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
        </button>

        <h1 className="text-xl font-bold text-text-primary">
          Moodboard
        </h1>

        <input
          type="text"
          defaultValue="Investigation Board"
          className="bg-transparent border-none text-text-primary focus:outline-none focus:bg-bg-tertiary px-2 py-1 rounded"
          placeholder="Board Title"
        />
      </div>

      <div className="flex items-center gap-2">
        <button className="px-4 py-2 bg-accent-primary hover:bg-blue-600 text-white rounded-md transition-colors flex items-center gap-2">
          <Save size={16} />
          Save
        </button>

        <button className="px-4 py-2 bg-bg-tertiary hover:bg-gray-700 text-text-primary rounded-md transition-colors flex items-center gap-2">
          <Share2 size={16} />
          Share
        </button>

        <button
          onClick={toggleRightPanel}
          className="p-2 hover:bg-bg-tertiary rounded-md transition-colors"
          title={rightPanelOpen ? 'Close panel' : 'Open panel'}
        >
          {rightPanelOpen ? <PanelRightClose size={20} /> : <PanelRightOpen size={20} />}
        </button>

        <button
          onClick={handleLogout}
          className="p-2 hover:bg-bg-tertiary rounded-md transition-colors text-text-secondary"
          title="Logout"
        >
          <LogOut size={20} />
        </button>

        <div className="ml-2 w-8 h-8 rounded-full bg-accent-primary flex items-center justify-center text-white text-sm font-medium">
          {user?.email?.[0]?.toUpperCase() || 'U'}
        </div>
      </div>
    </header>
  )
}
