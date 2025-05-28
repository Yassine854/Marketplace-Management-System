import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useGlobalStore = create<any>(
  persist(
    (set, get) => ({
      storeId: "",
      isNoEditUser: false,
      isAdmin: false,
      isMultipleStoreAccessUser: false,
      notifications: [],

      reset: () =>
        set({
          notifications: [],
        }),

      setNotifications: (notifications: any[]) =>
        set(() => ({
          notifications,
        })),
      addNotification: (notification: any) =>
        set((state: any) => {
          // Check if notification already exists to avoid duplicates
          const exists = state.notifications.some(
            (n: any) => n.id === notification.id,
          );
          if (exists) return state;

          return {
            notifications: [notification, ...state.notifications],
          };
        }),
      markNotificationAsRead: (notificationId: string) =>
        set((state: any) => ({
          notifications: state.notifications.map((n: any) =>
            n.id === notificationId ? { ...n, isRead: true } : n,
          ),
        })),
      markAllNotificationsAsRead: () =>
        set((state: any) => ({
          notifications: state.notifications.map((n: any) => ({
            ...n,
            isRead: true,
          })),
        })),
      clearNotifications: () =>
        set(() => ({
          notifications: [],
        })),
      setStoreId: (storeId: string) => set({ storeId }),
      setIsAdmin: (isAdmin: boolean) => set({ isAdmin }),
      setIsMultipleStoreAccessUser: (isMultipleStoreAccessUser: boolean) =>
        set({ isMultipleStoreAccessUser }),
      setIsNoEditUser: (isNoEditUser: boolean) => set({ isNoEditUser }),
      updateNotification: (updatedNotification: any) =>
        set((state: any) => ({
          notifications: state.notifications.map((n: any) =>
            n.id === updatedNotification.id ? updatedNotification : n,
          ),
        })),
    }),
    {
      name: "globalStore",
      getStorage: () => localStorage,
    },
  ),
);
