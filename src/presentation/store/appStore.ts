import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { SortBy, TaskCategory } from '@/domain/entities/Task';

interface FilterState {
  sortBy: SortBy;
  categories: TaskCategory[];
  createdDateFrom: Date | null;
  createdDateTo: Date | null;
  dueDateFrom: Date | null;
  dueDateTo: Date | null;
  page: number;
  pageSize: number;
}

interface UIState {
  isDrawerOpen: boolean;
  selectedTaskId: string | null;
  isTaskFormOpen: boolean;
  editingTaskId: string | null;
}

interface AppState {
  filters: FilterState;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
  ui: UIState;
  setDrawerOpen: (isOpen: boolean) => void;
  setSelectedTaskId: (taskId: string | null) => void;
  openTaskForm: (taskId?: string) => void;
  closeTaskForm: () => void;
  userId: string;
  setUserId: (userId: string) => void;
}

const initialFilterState: FilterState = {
  sortBy: 'CREATED_AT' as SortBy,
  categories: [],
  createdDateFrom: null,
  createdDateTo: null,
  dueDateFrom: null,
  dueDateTo: null,
  page: 0,
  pageSize: 9,
};

const initialUIState: UIState = {
  isDrawerOpen: false,
  selectedTaskId: null,
  isTaskFormOpen: false,
  editingTaskId: null,
};

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        filters: initialFilterState,
        setFilters: (newFilters) =>
          set((state) => ({
            filters: { ...state.filters, ...newFilters },
          })),
        resetFilters: () =>
          set(() => ({
            filters: initialFilterState,
          })),
        ui: initialUIState,
        setDrawerOpen: (isOpen) =>
          set((state) => ({
            ui: { ...state.ui, isDrawerOpen: isOpen },
          })),
        setSelectedTaskId: (taskId) =>
          set((state) => ({
            ui: { 
              ...state.ui, 
              selectedTaskId: taskId,
              isDrawerOpen: taskId !== null,
            },
          })),
        openTaskForm: (taskId) =>
          set((state) => ({
            ui: { 
              ...state.ui, 
              isTaskFormOpen: true,
              editingTaskId: taskId || null,
            },
          })),
        closeTaskForm: () =>
          set((state) => ({
            ui: { 
              ...state.ui, 
              isTaskFormOpen: false,
              editingTaskId: null,
            },
          })),
        userId: import.meta.env.VITE_USER_ID || 'Argaop01',
        setUserId: (userId) => set(() => ({ userId })),
      }),
      {
        name: 'task-manager-storage',
        partialize: (state) => ({ 
          filters: state.filters,
          userId: state.userId,
        }),
        storage: {
          getItem: (name) => {
            const str = localStorage.getItem(name);
            if (!str) return null;
            
            const { state } = JSON.parse(str);
            
            if (state.filters) {
              if (state.filters.createdDateFrom) {
                state.filters.createdDateFrom = new Date(state.filters.createdDateFrom);
              }
              if (state.filters.createdDateTo) {
                state.filters.createdDateTo = new Date(state.filters.createdDateTo);
              }
              if (state.filters.dueDateFrom) {
                state.filters.dueDateFrom = new Date(state.filters.dueDateFrom);
              }
              if (state.filters.dueDateTo) {
                state.filters.dueDateTo = new Date(state.filters.dueDateTo);
              }
            }
            
            return { state };
          },
          setItem: (name, value) => {
            localStorage.setItem(name, JSON.stringify(value));
          },
          removeItem: (name) => {
            localStorage.removeItem(name);
          },
        },
      }
    ),
    { name: 'TaskManagerStore' }
  )
);
