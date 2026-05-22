import { apiClient } from '@/shared/config/apiClientConfig'

export async function rateVehicle(
    targetId: string,
    rating: number,
    comment: string
) {
    await apiClient.post('/rating', {
        targetId,
        targetType: 'VEHICLE',
        rating,
        comment,
    })
}
