import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { useUIStore } from '../../stores/uiStore'
import { useBoardStore } from '../../stores/boardStore'

const NODE_CATEGORIES = [
  { id: 'person', name: 'Person', subcategories: ['Lawyer', 'Judge', 'Politician', 'Witness'] },
  { id: 'organization', name: 'Organization', subcategories: ['Company', 'University', 'Government'] },
  { id: 'event', name: 'Event', subcategories: ['Meeting', 'Transaction', 'Incident'] },
  { id: 'location', name: 'Location', subcategories: ['Office', 'Residence', 'Public Place'] },
  { id: 'document', name: 'Document', subcategories: ['Contract', 'Email', 'Report'] },
]

export default function NodeFormModal() {
  const { nodeFormOpen, nodeFormData, closeNodeForm } = useUIStore()
  const { addNode, updateNode } = useBoardStore()

  const [formData, setFormData] = useState({
    name: '',
    label: '',
    semantic_category_id: 'person',
    subcategory: '',
    description: '',
    tags: '',
    links: '',
  })

  useEffect(() => {
    if (nodeFormData) {
      setFormData({
        name: nodeFormData.name || '',
        label: nodeFormData.label || '',
        semantic_category_id: nodeFormData.semantic_category_id || 'person',
        subcategory: nodeFormData.subcategory || '',
        description: nodeFormData.description || '',
        tags: nodeFormData.tags?.join(', ') || '',
        links: nodeFormData.metadata?.links?.join('\n') || '',
      })
    }
  }, [nodeFormData])

  const handleSubmit = (e) => {
    e.preventDefault()

    const nodeData = {
      name: formData.name,
      label: formData.label || formData.name,
      semantic_category_id: formData.semantic_category_id,
      subcategory: formData.subcategory,
      description: formData.description,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      metadata: {
        links: formData.links.split('\n').map(l => l.trim()).filter(Boolean)
      }
    }

    if (nodeFormData?.id) {
      updateNode(nodeFormData.id, nodeData)
    } else {
      addNode({
        id: `node-${Date.now()}`,
        ...nodeData
      })
    }

    closeNodeForm()
    setFormData({
      name: '',
      label: '',
      semantic_category_id: 'person',
      subcategory: '',
      description: '',
      tags: '',
      links: '',
    })
  }

  if (!nodeFormOpen) return null

  const selectedCategory = NODE_CATEGORIES.find(c => c.id === formData.semantic_category_id)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-bg-tertiary border border-border-color rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-bg-tertiary border-b border-border-color px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-text-primary">
            {nodeFormData?.id ? 'Edit Node' : 'Add Node'}
          </h2>
          <button
            onClick={closeNodeForm}
            className="p-2 hover:bg-bg-secondary rounded transition-colors"
          >
            <X size={20} className="text-text-secondary" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 bg-bg-secondary border border-border-color rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
              placeholder="Luis Hermosilla Osorio"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Label (short display name)
            </label>
            <input
              type="text"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              className="w-full px-4 py-2 bg-bg-secondary border border-border-color rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
              placeholder="Hermosilla"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Category *
              </label>
              <select
                value={formData.semantic_category_id}
                onChange={(e) => setFormData({ ...formData, semantic_category_id: e.target.value, subcategory: '' })}
                className="w-full px-4 py-2 bg-bg-secondary border border-border-color rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                required
              >
                {NODE_CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Subcategory
              </label>
              <select
                value={formData.subcategory}
                onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                className="w-full px-4 py-2 bg-bg-secondary border border-border-color rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
              >
                <option value="">Select...</option>
                {selectedCategory?.subcategories.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Tags
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-4 py-2 bg-bg-secondary border border-border-color rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
              placeholder="lawyer, corruption, case-a"
            />
            <p className="text-xs text-text-tertiary mt-1">Comma-separated</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-bg-secondary border border-border-color rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
              rows={4}
              placeholder="Additional information about this entity..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Links
            </label>
            <textarea
              value={formData.links}
              onChange={(e) => setFormData({ ...formData, links: e.target.value })}
              className="w-full px-4 py-2 bg-bg-secondary border border-border-color rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
              rows={3}
              placeholder="https://example.com/article&#10;https://example.com/report"
            />
            <p className="text-xs text-text-tertiary mt-1">One URL per line</p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={closeNodeForm}
              className="flex-1 px-4 py-2 bg-bg-secondary hover:bg-gray-700 text-text-primary rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-accent-primary hover:bg-blue-600 text-white rounded-md transition-colors"
            >
              {nodeFormData?.id ? 'Save Changes' : 'Create Node'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
