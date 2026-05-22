import type { DateOnlyString } from './date'

export type SearchState = {
  startDate: DateOnlyString
  endDate: DateOnlyString
  setDates: (startDate: DateOnlyString, endDate: DateOnlyString) => void
  clearDates: () => void
}
