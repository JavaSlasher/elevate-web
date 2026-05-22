import { useNavigate, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { getAvailableVehicles } from '@/api/vehicle.ts'
import type { Vehicle } from '@/types/vehicle.ts'
import { t } from '@/shared/i18n'
import { useSearchStore } from '@/store/searchStore.ts'
import { Button } from '@/components/ui/button.tsx'

type VehiclesResponse =
    | Vehicle[]
    | {
  content?: Vehicle[]
  vehicles?: Vehicle[]
  data?: Vehicle[]
}

function normalizeVehicles(response: VehiclesResponse | undefined): Vehicle[] {
  if (Array.isArray(response)) {
    return response
  }

  if (Array.isArray(response?.content)) {
    return response.content
  }

  if (Array.isArray(response?.vehicles)) {
    return response.vehicles
  }

  if (Array.isArray(response?.data)) {
    return response.data
  }

  return []
}

export default function VehiclesPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const storeStartDate = useSearchStore((s) => s.startDate)
  const storeEndDate = useSearchStore((s) => s.endDate)
  const setDates = useSearchStore((s) => s.setDates)

  useEffect(() => {
    const urlStart = searchParams.get('startDate') ?? ''
    const urlEnd = searchParams.get('endDate') ?? ''

    if (urlStart && urlEnd) {
      setDates(urlStart, urlEnd)
    }
  }, [searchParams, setDates])

  const startDate = storeStartDate
  const endDate = storeEndDate
  const hasValidDates = Boolean(startDate && endDate)

  const {
    data: vehiclesResponse,
    isPending,
    isError,
    error,
  } = useQuery<VehiclesResponse>({
    queryKey: ['vehicles', 'available', startDate, endDate],
    queryFn: () => getAvailableVehicles({ startDate, endDate }),
    enabled: hasValidDates,
  })

  const vehicles = normalizeVehicles(vehiclesResponse)

  if (!hasValidDates) {
    return (
        <main style={{ padding: 20 }}>
          <h1>{t('vehicle.title')}</h1>
          <p>{t('vehicle.selectDatesFirst')}</p>
        </main>
    )
  }

  if (isPending) {
    return (
        <main style={{ padding: 20 }}>
          <h1>{t('vehicle.title')}</h1>
          <p>{t('vehicle.loadingAvailable')}</p>
        </main>
    )
  }

  if (isError) {
    return (
        <main style={{ padding: 20 }}>
          <h1>{t('vehicle.title')}</h1>
          <p>{error instanceof Error ? error.message : t('common.error')}</p>
        </main>
    )
  }

  return (
      <main style={{ padding: 20 }}>
        <h1>{t('vehicle.title')}</h1>

        <p>
          {t('vehicle.showingResults', {
            startDate,
            endDate,
          })}
        </p>

        {vehicles.length === 0 ? (
            <p>{t('vehicles.noAvailable')}</p>
        ) : (
            vehicles.map((vehicle) => (
                <article key={vehicle.id} style={{ marginBottom: 16 }}>
                  <h2>
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </h2>

                  <div className="outline-2 outline-offset-2 outline-red-700 rounded-3xl">
                    <Button
                        onClick={() =>
                            navigate(
                                `/vehicle/${vehicle.id}?startDate=${encodeURIComponent(
                                    startDate,
                                )}&endDate=${encodeURIComponent(endDate)}`,
                            )
                        }
                    >
                      {t('vehicle.viewDetails')}
                    </Button>
                  </div>
                </article>
            ))
        )}
      </main>
  )
}
