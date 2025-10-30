import { useBoardStore } from '../../stores/boardStore'
import { FileText, Upload } from 'lucide-react'
import { useUIStore } from '../../stores/uiStore'

export default function DocumentList() {
  const { documents } = useBoardStore()
  const { openUploadModal } = useUIStore()

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Documents</h3>
        <button
          onClick={openUploadModal}
          className="flex items-center gap-2 px-3 py-1.5 bg-accent-primary hover:bg-blue-600 text-white text-sm rounded transition-colors"
        >
          <Upload size={14} />
          Upload
        </button>
      </div>

      {documents.length === 0 ? (
        <div className="text-center py-8 text-text-tertiary">
          <FileText size={48} className="mx-auto mb-3 opacity-50" />
          <p className="mb-1">No documents uploaded</p>
          <p className="text-sm">Upload PDFs to enable AI analysis</p>
        </div>
      ) : (
        <div className="space-y-2">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-bg-tertiary border border-border-color rounded-lg p-3 hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-start gap-3">
                <FileText size={20} className="text-accent-primary flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-primary font-medium truncate">
                    {doc.filename}
                  </p>
                  <p className="text-xs text-text-tertiary mt-1">
                    {doc.file_size ? `${(doc.file_size / 1024).toFixed(1)} KB` : 'Unknown size'}
                  </p>
                  {doc.processed && (
                    <span className="inline-block mt-2 px-2 py-0.5 bg-accent-success text-white text-xs rounded">
                      Processed
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
