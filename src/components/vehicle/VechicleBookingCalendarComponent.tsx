import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { t } from '@/shared/i18n'
import { getErrorMessage } from '@/shared/utils/errorMessageUtil.ts'
import type { VehicleCalendarBooking } from '@/types/booking.ts'
import { getVehicleBookingCalendar } from '@/api/bookings.ts'
import type { VehicleBookingCalendarComponentProps } from '@/types/vehicle.ts'
import {
  getCalendarDays,
  getMonthEnd,
  getMonthStart,
  isPastDay,
  toDateOnlyString,
} from '@/shared/utils/dateUtils.ts'
import { isSameMonth } from 'date-fns'

function isDateInsideBooking(day: Date, booking: VehicleCalendarBooking) {
  const dayOnly = toDateOnlyString(day)
  return dayOnly >= booking.startDate && dayOnly <= booking.endDate
}

export default function VehicleBookingCalendarComponent({
  vehicleId,
}: VehicleBookingCalendarComponentProps) {
  const [visibleMonth, setVisibleMonth] = useState(() => new Date())

  const monthStart = useMemo(() => getMonthStart(visibleMonth), [visibleMonth])
  const monthEnd = useMemo(() => getMonthEnd(visibleMonth), [visibleMonth])
  const calendarDays = useMemo(() => getCalendarDays(visibleMonth), [visibleMonth])

  const {
    data: bookings = [],
    isPending,
    isError,
    error,
  } = useQuery<VehicleCalendarBooking[]>({
    queryKey: [
      'vehicle',
      vehicleId,
      'booking-calendar',
      toDateOnlyString(monthStart),
      toDateOnlyString(monthEnd),
    ],
    queryFn: () =>
      getVehicleBookingCalendar({
        vehicleId,
        monthStart: toDateOnlyString(monthStart),
        monthEnd: toDateOnlyString(monthEnd),
      }),
    enabled: Boolean(vehicleId),
  })

  function handlePreviousMonth() {
    setVisibleMonth(
      (current) => new Date(current.getFullYear(), current.getMonth() - 1, 1),
    )
  }

  function handleNextMonth() {
    setVisibleMonth(
      (current) => new Date(current.getFullYear(), current.getMonth() + 1, 1),
    )
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            {t('vehicle.vehicleCalendar.title')}
          </h2>
          <p className="text-slate-600">{t('vehicle.vehicleCalendar.subtitle')}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePreviousMonth}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            {t('vehicle.vehicleCalendar.previous')}
          </button>

          <button
            type="button"
            onClick={handleNextMonth}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            {t('vehicle.vehicleCalendar.next')}
          </button>
        </div>
      </div>

      <h3 className="mt-6 text-center text-xl font-semibold text-slate-900">
        {visibleMonth.toLocaleString(undefined, { month: 'long', year: 'numeric' })}
      </h3>

      {isPending ? (
        <p className="mt-6 text-slate-600">{t('common.loading')}</p>
      ) : isError ? (
        <p className="mt-6 text-sm text-red-600">{getErrorMessage(error)}</p>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
          <div className="grid grid-cols-7 bg-slate-50 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                className="border-r border-slate-200 px-2 py-3 last:border-r-0"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {calendarDays.map((day) => {
              const dayBookings = bookings.filter((booking) =>
                isDateInsideBooking(day, booking),
              )

              const past = isPastDay(day)
              const outsideMonth = !isSameMonth(day, visibleMonth)

              return (
                <div
                  key={day.toISOString()}
                  className={`min-h-28 border-r border-t border-slate-200 p-2 last:border-r-0 ${
                    past || outsideMonth ? 'bg-slate-100 text-slate-400' : 'bg-white'
                  }`}
                >
                  <p className="text-sm font-semibold">{day.getDate()}</p>

                  <div className="mt-2 space-y-1">
                    {dayBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="rounded-lg bg-red-50 px-2 py-1 text-xs font-semibold text-red-700 ring-1 ring-red-200"
                      >
                        {t('vehicle.vehicleCalendar.booked')}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </section>
  )
}
