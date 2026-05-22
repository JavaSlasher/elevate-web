import type { DriverProfile } from '@/types/driver'
import { apiClient } from '@/shared/config/apiClientConfig.ts'

export async function createDriver(payload: {
  licenseNumber: string
  licenseExpiryDate?: string
  licenseState?: string
}) {
  const { data } = await apiClient.post('/drivers', payload)
  return data
}

export async function getMyDriverProfile(): Promise<DriverProfile> {
  const { data } = await apiClient.get('/drivers/me')
  return data
}
