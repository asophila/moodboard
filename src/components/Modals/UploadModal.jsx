import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { X, Upload, FileText, CheckCircle } from 'lucide-react'
import { useUIStore } from '../../stores/uiStore'
import { useBoardStore } from '../../stores/boardStore'

export default function UploadModal() {
  const { uploadModalOpen, closeUploadModal } = useUIStore()
  const { addDocument } = useBoardStore()
  const [files, setFiles] = useState([])
  const [processWithAI, setProcessWithAI] = useState(true)

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(prev => [...prev, ...acceptedFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/plain': ['.txt']
    }
  })

  const handleUpload = () => {
    // Mock upload for MVP
    files.forEach(file => {
      addDocument({
        id: `doc-${Date.now()}-${Math.random()}`,
        filename: file.name,
        file_size: file.size,
        file_type: file.type,
        uploaded_at: new Date().toISOString(),
        processed: false,
        processing_status: 'pending'
      })
    })

    // Simulate AI processing delay
    if (processWithAI) {
      setTimeout(() => {
        alert('AI processing would happen here! In production, this would call the Supabase Edge Function.')
      }, 1000)
    }

    setFiles([])
    closeUploadModal()
  }

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  if (!uploadModalOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-bg-tertiary border border-border-color rounded-lg w-full max-w-2xl">
        <div className="border-b border-border-color px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-text-primary">Upload Documents</h2>
          <button
            onClick={closeUploadModal}
            className="p-2 hover:bg-bg-secondary rounded transition-colors"
          >
            <X size={20} className="text-text-secondary" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-accent-primary bg-accent-primary/10'
                : 'border-border-color hover:border-accent-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload size={48} className="mx-auto mb-4 text-text-secondary" />
            {isDragActive ? (
              <p className="text-text-primary">Drop files here...</p>
            ) : (
              <>
                <p className="text-text-primary mb-2">
                  Drag & drop files here, or click to browse
                </p>
                <p className="text-sm text-text-tertiary">
                  Supported: PDF, Excel, TXT
                </p>
              </>
            )}
          </div>

          {/* File list */}
          {files.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-text-secondary mb-3">
                Files to upload ({files.length})
              </h3>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-bg-secondary border border-border-color rounded"
                  >
                    <div className="flex items-center gap-3">
                      <FileText size={20} className="text-accent-primary" />
                      <div>
                        <p className="text-sm text-text-primary">{file.name}</p>
                        <p className="text-xs text-text-tertiary">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="p-1 hover:bg-bg-tertiary rounded transition-colors"
                    >
                      <X size={16} className="text-text-secondary" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Processing option */}
          <div className="flex items-start gap-3 p-4 bg-accent-secondary/10 border border-accent-secondary/30 rounded-lg">
            <input
              type="checkbox"
              id="processWithAI"
              checked={processWithAI}
              onChange={(e) => setProcessWithAI(e.target.checked)}
              className="mt-1"
            />
            <label htmlFor="processWithAI" className="flex-1 cursor-pointer">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-text-primary">
                  Process with AI
                </span>
                <span className="px-2 py-0.5 bg-accent-secondary text-white text-xs rounded">
                  Premium
                </span>
              </div>
              <p className="text-xs text-text-secondary">
                Extract entities and relationships automatically
              </p>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={closeUploadModal}
              className="flex-1 px-4 py-2 bg-bg-secondary hover:bg-gray-700 text-text-primary rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={files.length === 0}
              className="flex-1 px-4 py-2 bg-accent-primary hover:bg-blue-600 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Upload {files.length > 0 && `(${files.length})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
