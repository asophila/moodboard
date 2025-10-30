import { useUIStore } from '../../stores/uiStore'
import { Info, Sparkles, FileText } from 'lucide-react'
import NodeDetails from './NodeDetails'
import AISuggestions from './AISuggestions'
import DocumentList from './DocumentList'

export default function RightPanel() {
  const { rightPanelTab, setRightPanelTab } = useUIStore()

  const tabs = [
    { id: 'details', name: 'Details', icon: Info },
    { id: 'suggestions', name: 'AI Suggestions', icon: Sparkles },
    { id: 'documents', name: 'Documents', icon: FileText },
  ]

  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-border-color">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setRightPanelTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                rightPanelTab === tab.id
                  ? 'text-accent-primary border-b-2 border-accent-primary'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon size={16} />
              {tab.name}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {rightPanelTab === 'details' && <NodeDetails />}
        {rightPanelTab === 'suggestions' && <AISuggestions />}
        {rightPanelTab === 'documents' && <DocumentList />}
      </div>
    </div>
  )
}
