import { create } from 'zustand'

interface UIState {
  sidebarOpen: boolean
  mobileSidebarOpen: boolean
  notificationDrawerOpen: boolean
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  setMobileSidebarOpen: (open: boolean) => void
  toggleMobileSidebar: () => void
  setNotificationDrawerOpen: (open: boolean) => void
  toggleNotificationDrawer: () => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  mobileSidebarOpen: false,
  notificationDrawerOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),
  toggleMobileSidebar: () => set((state) => ({ mobileSidebarOpen: !state.mobileSidebarOpen })),
  setNotificationDrawerOpen: (open) => set({ notificationDrawerOpen: open }),
  toggleNotificationDrawer: () => set((state) => ({ notificationDrawerOpen: !state.notificationDrawerOpen })),
}))
