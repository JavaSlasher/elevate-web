import type { DateOnlyString, UtcIsoDateTimeString } from '@/types/date'

export function toDateOnlyString(date: Date): DateOnlyString {
  return date.toISOString().split('T')[0]
}

export function parseDateOnly(value: DateOnlyString): Date {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day))
}

export function formatDateOnly(value: DateOnlyString): string {
  const [year, month, day] = value.split('-')
  return `${year}-${month}-${day}`
}

export function formatUtcToLocal(value: UtcIsoDateTimeString): string {
  return new Date(value).toISOString()
}

export function getDayCount(start: DateOnlyString, end: DateOnlyString): number {
  const diff = parseDateOnly(end).getTime() - parseDateOnly(start).getTime()
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

export function getMonthStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export function getMonthEnd(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

export function getCalendarStart(date: Date) {
  const monthStart = getMonthStart(date)
  return new Date(
    monthStart.getFullYear(),
    monthStart.getMonth(),
    1 - monthStart.getDay(),
  )
}

export function getCalendarDays(date: Date) {
  const start = getCalendarStart(date)

  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(start)
    day.setDate(start.getDate() + index)
    return day
  })
}

export function isSameMonth(day: Date, month: Date) {
  return day.getMonth() === month.getMonth() && day.getFullYear() === month.getFullYear()
}

export function isPastDay(day: Date) {
  const today = new Date()
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const dayOnly = new Date(day.getFullYear(), day.getMonth(), day.getDate())

  return dayOnly < todayOnly
}
