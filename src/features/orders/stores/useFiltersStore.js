import { create } from 'zustand';

export const useFiltersStore = create((set) => ({
  filters: '', // Store the filters as a string initially
  setFilters: (newFilters) => set({ filters: newFilters }), // Action to update filters
}));
