import { create } from 'zustand'
import type { SearchState } from '../types/search'

export const useSearchStore = create<SearchState>((set) => ({
  startDate: '',
  endDate: '',

  setDates: (startDate, endDate) =>
      set({
        startDate,
        endDate,
      }),

  clearDates: () =>
      set({
        startDate: '',
        endDate: '',
      }),
}))
