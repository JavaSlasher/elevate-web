import type { Vehicle } from '@/types/vehicle.ts'

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'

// export type Booking = {
//     id: string
//     vehicleId: string
//     userId: string
//     startDate: DateOnlyString
//     endDate: DateOnlyString
//     status: BookingStatus
//     totalAmount?: number
//     createdAt?: UtcIsoDateTimeString
//     updatedAt?: UtcIsoDateTimeString
// }

export type Booking = {
  id: string
  vehicle: Vehicle
  startDate: string
  endDate?: string
  status?: string
}

export type CreateBookingRequest = {
  vehicleId: string
  rentalUnit: 'MONTH' | 'DAY' | 'WEEK'
  rentalQuantity: number
  startDate: string
  endDate: string
  pricePerUnit: number
  taxAmount?: number
  discountAmount?: number
  securityDeposit?: number
}

export type CreateBookingResponse = {
  success: boolean
  message: string
  bookingId: string
  status: BookingStatus
}

export type BookingSummaryResponse = {
  vehicleComment: string
  vehicleRating: number
  id: string
  vehicleId: string
  vehicleYear: number
  vehicleMake: string
  vehicleModel: string
  vehicleLicensePlate?: string | null
  startDate: string
  endDate?: string | null
  status: string
}

export type VehicleCalendarBooking = {
  id: string
  startDate: string
  endDate: string
  status: string
}
