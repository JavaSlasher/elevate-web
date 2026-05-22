import type { DateOnlyString } from './date'

export type DriverProfile = {
  id: string
  userId: string
  licenseNumber: string
  licenseExpiryDate?: DateOnlyString
  licenseState?: string
  rating?: number
  totalRides: number
}
