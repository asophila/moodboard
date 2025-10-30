import { useBoardStore } from '../../stores/boardStore'
import { CheckCircle, XCircle, FileText, AlertCircle, ArrowRight } from 'lucide-react'

export default function AISuggestions() {
  const { aiSuggestions, acceptSuggestion, rejectSuggestion } = useBoardStore()

  const getConfidenceBadge = (confidence) => {
    if (confidence >= 0.8) return { color: 'bg-accent-success', text: 'High' }
    if (confidence >= 0.5) return { color: 'bg-accent-warning', text: 'Medium' }
    return { color: 'bg-accent-danger', text: 'Low' }
  }

  if (aiSuggestions.length === 0) {
    return (
      <div className="p-6 text-center text-text-tertiary">
        <AlertCircle size={48} className="mx-auto mb-3 opacity-50" />
        <p className="mb-1">No suggestions yet</p>
        <p className="text-sm">Upload documents to get AI insights</p>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="text-2xl">🤖</span>
          AI Suggestions
        </h3>
        {aiSuggestions.length > 0 && (
          <span className="px-2 py-1 bg-accent-secondary text-white text-xs rounded-full">
            {aiSuggestions.length}
          </span>
        )}
      </div>

      {aiSuggestions.map((suggestion) => {
        const badge = getConfidenceBadge(suggestion.confidence)

        return (
          <div
            key={suggestion.id}
            className="bg-bg-tertiary border border-border-color rounded-lg p-4 space-y-3"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-white">
                    {suggestion.suggestion_type === 'connection' && '🔗 Connection Detected'}
                    {suggestion.suggestion_type === 'node' && '👤 Entity Found'}
                    {suggestion.suggestion_type === 'edge' && '↔️ Relationship Found'}
                  </span>
                  <span className={`px-2 py-0.5 text-xs rounded ${badge.color} text-white`}>
                    {badge.text}
                  </span>
                </div>

                {/* Connection summary */}
                {(suggestion.suggestion_type === 'connection' || suggestion.suggestion_type === 'edge') && (
                  <div className="flex items-center gap-2 text-white font-medium">
                    <span>{suggestion.data.source_name}</span>
                    <ArrowRight size={16} className="text-text-secondary" />
                    <span>{suggestion.data.target_name}</span>
                  </div>
                )}

                {suggestion.suggestion_type === 'node' && (
                  <p className="text-white font-medium">{suggestion.data.name}</p>
                )}

                {suggestion.data.relationship && (
                  <p className="text-sm text-text-secondary mt-1">{suggestion.data.relationship}</p>
                )}
              </div>
            </div>

            {/* Evidence */}
            {suggestion.evidence && suggestion.evidence.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-text-secondary font-medium">Evidence chain:</p>
                {suggestion.evidence.slice(0, 2).map((ev, idx) => (
                  <div
                    key={idx}
                    className="bg-bg-secondary border border-border-color rounded p-3 text-sm"
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <FileText className="w-4 h-4 text-accent-primary flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-accent-primary text-xs truncate">
                          {ev.document_name || 'Document'}
                        </p>
                        {ev.page && (
                          <p className="text-text-tertiary text-xs">
                            Page {ev.page}{ev.line && `, line ${ev.line}`}
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="text-text-primary text-xs leading-relaxed italic">
                      "{ev.excerpt}"
                    </p>
                  </div>
                ))}
                {suggestion.evidence.length > 2 && (
                  <p className="text-xs text-text-tertiary">
                    +{suggestion.evidence.length - 2} more evidence
                  </p>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => acceptSuggestion(suggestion)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-accent-success hover:bg-green-600 text-white text-sm rounded transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                Add to Board
              </button>
              <button
                onClick={() => rejectSuggestion(suggestion.id)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition-colors"
              >
                <XCircle className="w-4 h-4" />
                Dismiss
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
