import type { DateOnlyString } from './date'

export type VehicleStatus = 'ACTIVE' | 'INACTIVE' | 'BLOCKED'
export type VehicleAvailabilityStatus = 'AVAILABLE' | 'UNAVAILABLE'

export type VehicleType = 'NANO' | 'SEDAN' | 'CROSSOVER' | 'SUV' | 'CYCLE' | 'MOTORBIKE'

export type Vehicle = {
  id: string
  ownerId?: string
  make: string
  model: string
  year: number
  licensePlate?: string
  vehicleType?: VehicleType
  status?: VehicleStatus
  availabilityStatus?: VehicleAvailabilityStatus
  capacity?: number
  dailyRate?: number
  weeklyRate?: number
  monthlyRate?: number
  rating?: number
}

export type GetAvailableVehiclesParams = {
  startDate?: DateOnlyString
  endDate?: DateOnlyString
}

export type CreateVehicleRequest = {
  userId?: string
  make: string
  model: string
  year: number
  licensePlate: string
  vehicleType: VehicleType
  capacity: number
  status?: VehicleStatus
  availabilityStatus?: VehicleAvailabilityStatus
  dailyRate: number
  weeklyRate?: number
  monthlyRate?: number
}

export type CreateVehicleResponse = {
  success: boolean
  message: string
  vehicleId: string
}

export type VehicleBookingCalendarComponentProps = {
  vehicleId: string
}

export type FeaturedVehicleCard = {
  id: string
  image: string
  year: number
  make: string
  model: string
}

export type FeaturedVehicleCarouselProps = {
  vehicles: FeaturedVehicleCard[]
}

export type VehicleImagesComponentProps = {
  vehicleId: string
  canManage?: boolean
}

export type UploadedFileResponse = {
  path: string
}

export type VehiclesResponse =
    | Vehicle[]
    | {
  content?: Vehicle[]
  vehicles?: Vehicle[]
  data?: Vehicle[]
}
