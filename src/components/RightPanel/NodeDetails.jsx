import { useBoardStore } from '../../stores/boardStore'
import { User, Tag, Link2, Trash2, Edit } from 'lucide-react'

export default function NodeDetails() {
  const { nodes, selectedNode, deleteNode } = useBoardStore()

  const node = nodes.find(n => n.id === selectedNode)

  if (!node) {
    return (
      <div className="p-6 text-center text-text-tertiary">
        <User size={48} className="mx-auto mb-3 opacity-50" />
        <p>Select a node to view details</p>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-bold text-text-primary mb-1">{node.name}</h3>
          {node.label && node.label !== node.name && (
            <p className="text-sm text-text-secondary">{node.label}</p>
          )}
        </div>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-bg-tertiary rounded transition-colors" title="Edit">
            <Edit size={16} className="text-text-secondary" />
          </button>
          <button
            onClick={() => deleteNode(node.id)}
            className="p-2 hover:bg-red-900/20 rounded transition-colors"
            title="Delete"
          >
            <Trash2 size={16} className="text-accent-danger" />
          </button>
        </div>
      </div>

      {node.description && (
        <div>
          <h4 className="text-sm font-semibold text-text-secondary mb-2">Description</h4>
          <p className="text-sm text-text-primary">{node.description}</p>
        </div>
      )}

      {node.tags && node.tags.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-text-secondary mb-2 flex items-center gap-2">
            <Tag size={16} />
            Tags
          </h4>
          <div className="flex flex-wrap gap-2">
            {node.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-bg-tertiary text-text-primary text-xs rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {node.metadata?.links && node.metadata.links.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-text-secondary mb-2 flex items-center gap-2">
            <Link2 size={16} />
            Links
          </h4>
          <div className="space-y-2">
            {node.metadata.links.map((link, idx) => (
              <a
                key={idx}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-accent-primary hover:underline truncate"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="pt-4 border-t border-border-color">
        <h4 className="text-sm font-semibold text-text-secondary mb-2">Category</h4>
        <p className="text-sm text-text-primary capitalize">{node.semantic_category_id}</p>
      </div>
    </div>
  )
}
