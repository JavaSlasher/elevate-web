import { apiClient } from '@/shared/config/apiClientConfig'
import type {
  CreateOwnerRequest,
  CreateOwnerResponse,
  OwnerProfile,
} from '@/types/owner'
import type { Vehicle } from '@/types/vehicle'

export async function createOwner(
    payload: CreateOwnerRequest,
): Promise<CreateOwnerResponse> {
  const { data } = await apiClient.post('/owners', payload)
  return data
}

export async function getMyOwnerProfile(): Promise<OwnerProfile> {
  const { data } = await apiClient.get('/owners/me')
  return data
}

export async function getMyOwnerVehicles(): Promise<Vehicle[]> {
  const { data } = await apiClient.get('/owners/me/vehicles')

  if (Array.isArray(data)) {
    return data
  }

  if (Array.isArray(data?.content)) {
    return data.content
  }

  if (Array.isArray(data?.vehicles)) {
    return data.vehicles
  }

  if (Array.isArray(data?.data)) {
    return data.data
  }

  return []
}
