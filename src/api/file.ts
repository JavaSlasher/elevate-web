import { apiClient } from '@/shared/config/apiClientConfig'
import type { UploadedFileResponse } from '@/types/vehicle.ts'

export async function uploadVehicleDocument(file: File): Promise<{ path: string }> {
  const formData = new FormData()
  formData.append('file', file)

  const { data } = await apiClient.post('/files/vehicle-document', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return data
}

export async function uploadVehicleImage(
    file: File,
): Promise<{ path: string }> {
  await new Promise((resolve) => setTimeout(resolve, 800)) // simulate delay

  const mockPath = `/mock/uploads/${file.name}`

  return {
    path: mockPath,
  }
}

export async function getVehicleImageNames(vehicleId: string): Promise<string[]> {
  const { data } = await apiClient.get(`/content/vehicle-images/${vehicleId}`)

  return data
}

export function getVehicleImageUrl(vehicleId: string, fileName: string) {
  const baseURL = apiClient.defaults.baseURL ?? ''

  return `${baseURL}/content/vehicle-images/${vehicleId}/${encodeURIComponent(fileName)}`
}

export async function uploadVehicleImages(
    vehicleId: string,
    files: File[],
): Promise<UploadedFileResponse[]> {
  const formData = new FormData()

  files.forEach((file) => {
    formData.append('files', file)
  })

  const { data } = await apiClient.post(
      `/files/vehicle-image/${vehicleId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
  )

  return data
}

export async function deleteVehicleImage(
    vehicleId: string,
    imageName: string,
): Promise<{ message: string }> {
  const { data } = await apiClient.delete(
      `/files/vehicle-image/${vehicleId}/${imageName}`,
  )

  return data
}

export async function replaceVehicleImage(
    vehicleId: string,
    imageName: string,
    file: File,
): Promise<{ path: string }> {
  const formData = new FormData()
  formData.append('file', file)

  const { data } = await apiClient.put(
      `/files/vehicle-image/${vehicleId}/${imageName}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
  )

  return data
}
