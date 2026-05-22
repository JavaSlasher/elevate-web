import { apiClient } from '../shared/config/apiClientConfig.ts'
import type {
  CreateVehicleRequest,
  CreateVehicleResponse,
  GetAvailableVehiclesParams,
  Vehicle,
} from '../types/vehicle'

export async function getAvailableVehicles(
  params?: GetAvailableVehiclesParams,
): Promise<Vehicle[]> {
  const { data } = await apiClient.get('/vehicles/available', {
    params,
  })

  return data
}

export async function getVehicleById(id: string): Promise<Vehicle> {
  const { data } = await apiClient.get(`/vehicles/${id}`)
  return data
}

export async function createVehicle(
  payload: CreateVehicleRequest,
): Promise<CreateVehicleResponse> {
  const { data } = await apiClient.post('/vehicles', payload)
  return data
}
