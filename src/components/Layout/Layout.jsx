import Header from './Header'
import Sidebar from '../Sidebar/Sidebar'
import RightPanel from '../RightPanel/RightPanel'
import { useUIStore } from '../../stores/uiStore'

export default function Layout({ children }) {
  const { leftSidebarOpen, rightPanelOpen } = useUIStore()

  return (
    <div className="h-screen flex flex-col bg-bg-primary">
      <Header />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        {leftSidebarOpen && (
          <div className="w-64 bg-bg-secondary border-r border-border-color flex-shrink-0">
            <Sidebar />
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 relative">
          {children}
        </div>

        {/* Right Panel */}
        {rightPanelOpen && (
          <div className="w-96 bg-bg-secondary border-l border-border-color flex-shrink-0">
            <RightPanel />
          </div>
        )}
      </div>
    </div>
  )
}
