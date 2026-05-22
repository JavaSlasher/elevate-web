import { apiClient } from '../shared/config/apiClientConfig.ts'
import type {
  BookingSummaryResponse,
  CreateBookingRequest,
  CreateBookingResponse,
  VehicleCalendarBooking,
} from '../types/booking'

export async function createBooking(
  payload: CreateBookingRequest,
): Promise<CreateBookingResponse> {
  const { data } = await apiClient.post('/bookings', payload)
  return data
}

export async function getMyBookings(): Promise<BookingSummaryResponse[]> {
  const { data } = await apiClient.get('/bookings/me')
  return data
}

export async function getVehicleBookingCalendar(params: {
  vehicleId: string
  monthStart: string
  monthEnd: string
}): Promise<VehicleCalendarBooking[]> {
  const { data } = await apiClient.get(`/bookings/vehicle/${params.vehicleId}/calendar`, {
    params: {
      monthStart: params.monthStart,
      monthEnd: params.monthEnd,
    },
  })

  return data
}
