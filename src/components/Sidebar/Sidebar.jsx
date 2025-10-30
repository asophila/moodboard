import { User, Building2, Calendar, MapPin, FileText, Upload, Plus } from 'lucide-react'
import { useUIStore } from '../../stores/uiStore'

const NODE_TYPES = [
  { id: 'person', name: 'Person', icon: User, color: '#3B82F6' },
  { id: 'organization', name: 'Organization', icon: Building2, color: '#8B5CF6' },
  { id: 'event', name: 'Event', icon: Calendar, color: '#F59E0B' },
  { id: 'location', name: 'Location', icon: MapPin, color: '#10B981' },
  { id: 'document', name: 'Document', icon: FileText, color: '#6366F1' },
]

export default function Sidebar() {
  const { openNodeForm, openUploadModal } = useUIStore()

  const handleDragStart = (e, type) => {
    e.dataTransfer.setData('nodeType', JSON.stringify(type))
  }

  return (
    <div className="h-full flex flex-col p-4">
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-text-secondary mb-3 uppercase tracking-wider">
          Node Palette
        </h3>
        <div className="space-y-2">
          {NODE_TYPES.map((type) => {
            const Icon = type.icon
            return (
              <div
                key={type.id}
                draggable
                onDragStart={(e) => handleDragStart(e, type)}
                className="flex items-center gap-3 p-3 bg-bg-tertiary hover:bg-gray-700 border border-border-color rounded-lg cursor-move transition-colors"
                style={{ borderLeft: `4px solid ${type.color}` }}
              >
                <Icon size={20} style={{ color: type.color }} />
                <span className="text-text-primary text-sm">{type.name}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-semibold text-text-secondary mb-3 uppercase tracking-wider">
          Actions
        </h3>
        <button
          onClick={() => openNodeForm(null)}
          className="w-full flex items-center gap-3 p-3 bg-accent-primary hover:bg-blue-600 rounded-lg transition-colors"
        >
          <Plus size={20} />
          <span className="text-sm font-medium">Add Node</span>
        </button>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-text-secondary mb-3 uppercase tracking-wider">
          Documents
        </h3>
        <button
          onClick={openUploadModal}
          className="w-full flex items-center gap-3 p-3 bg-bg-tertiary hover:bg-gray-700 border border-border-color rounded-lg transition-colors"
        >
          <Upload size={20} />
          <span className="text-sm">Upload Documents</span>
        </button>

        <div className="mt-4 text-xs text-text-tertiary">
          <p>Drop PDFs here or click to upload</p>
        </div>
      </div>
    </div>
  )
}
