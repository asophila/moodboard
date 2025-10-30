import { create } from 'zustand'

export const useUIStore = create((set) => ({
  // UI State
  rightPanelOpen: true,
  rightPanelTab: 'details', // 'details' | 'suggestions' | 'documents'
  leftSidebarOpen: true,

  nodeFormOpen: false,
  nodeFormData: null,

  uploadModalOpen: false,

  // Actions
  toggleRightPanel: () => set((state) => ({ rightPanelOpen: !state.rightPanelOpen })),
  setRightPanelTab: (tab) => set({ rightPanelTab: tab }),

  toggleLeftSidebar: () => set((state) => ({ leftSidebarOpen: !state.leftSidebarOpen })),

  openNodeForm: (data) => set({ nodeFormOpen: true, nodeFormData: data }),
  closeNodeForm: () => set({ nodeFormOpen: false, nodeFormData: null }),

  openUploadModal: () => set({ uploadModalOpen: true }),
  closeUploadModal: () => set({ uploadModalOpen: false }),
}))
