import { create } from 'zustand'

export const useBoardStore = create((set, get) => ({
  // State
  currentBoard: null,
  nodes: [],
  edges: [],
  sets: [],
  selectedNode: null,
  aiSuggestions: [],
  documents: [],
  categories: [],

  // Actions
  setCurrentBoard: (board) => set({ currentBoard: board }),

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  setSets: (sets) => set({ sets }),

  addNode: (node) => set((state) => ({
    nodes: [...state.nodes, {
      ...node,
      x: Math.random() * 800 + 200,
      y: Math.random() * 600 + 200
    }]
  })),

  updateNode: (id, updates) => set((state) => ({
    nodes: state.nodes.map(n => n.id === id ? { ...n, ...updates } : n)
  })),

  deleteNode: (id) => set((state) => ({
    nodes: state.nodes.filter(n => n.id !== id),
    edges: state.edges.filter(e => e.source !== id && e.target !== id)
  })),

  addEdge: (edge) => set((state) => ({
    edges: [...state.edges, edge]
  })),

  deleteEdge: (id) => set((state) => ({
    edges: state.edges.filter(e => e.id !== id)
  })),

  setSelectedNode: (nodeId) => set({ selectedNode: nodeId }),

  setAISuggestions: (suggestions) => set({ aiSuggestions: suggestions }),

  addAISuggestion: (suggestion) => set((state) => ({
    aiSuggestions: [...state.aiSuggestions, suggestion]
  })),

  removeSuggestion: (id) => set((state) => ({
    aiSuggestions: state.aiSuggestions.filter(s => s.id !== id)
  })),

  acceptSuggestion: (suggestion) => {
    if (suggestion.suggestion_type === 'connection' || suggestion.suggestion_type === 'edge') {
      // Add nodes if they don't exist
      const state = get()
      let sourceNode = state.nodes.find(n => n.name === suggestion.data.source_name)
      let targetNode = state.nodes.find(n => n.name === suggestion.data.target_name)

      if (!sourceNode) {
        sourceNode = {
          id: `node-${Date.now()}-source`,
          name: suggestion.data.source_name,
          label: suggestion.data.source_name,
          semantic_category_id: suggestion.data.source_category || 'person',
          metadata: {}
        }
        get().addNode(sourceNode)
      }

      if (!targetNode) {
        targetNode = {
          id: `node-${Date.now()}-target`,
          name: suggestion.data.target_name,
          label: suggestion.data.target_name,
          semantic_category_id: suggestion.data.target_category || 'person',
          metadata: {}
        }
        get().addNode(targetNode)
      }

      // Add edge
      get().addEdge({
        id: `edge-${Date.now()}`,
        source: sourceNode.id,
        target: targetNode.id,
        label: suggestion.data.relationship || '',
        metadata: { evidence: suggestion.evidence }
      })
    } else if (suggestion.suggestion_type === 'node') {
      get().addNode({
        id: `node-${Date.now()}`,
        name: suggestion.data.name,
        label: suggestion.data.name,
        semantic_category_id: suggestion.data.category || 'person',
        metadata: {}
      })
    }

    get().removeSuggestion(suggestion.id)
  },

  rejectSuggestion: (id) => {
    get().removeSuggestion(id)
  },

  setDocuments: (documents) => set({ documents }),

  addDocument: (document) => set((state) => ({
    documents: [...state.documents, document]
  })),

  setCategories: (categories) => set({ categories }),
}))
