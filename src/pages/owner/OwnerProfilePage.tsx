import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getMyOwnerProfile, getMyOwnerVehicles } from '@/api/owner'
import { useAuthStore } from '@/store/authStore'
import { t } from '@/shared/i18n'
import type { OwnerProfile } from '@/types/owner'
import type { Vehicle } from '@/types/vehicle'
import { getErrorMessage } from '@/shared/utils/errorMessageUtil.ts'
import { Button } from '@/components/ui/button.tsx'
import { useNavigate } from 'react-router-dom'
import Rating from "../../components/common/RatingStar.tsx";

type VehiclesResponse =
    | Vehicle[]
    | {
  content?: Vehicle[]
  vehicles?: Vehicle[]
  data?: Vehicle[]
}

function normalizeVehicles(response: VehiclesResponse | undefined): Vehicle[] {
  if (Array.isArray(response)) return response
  if (Array.isArray(response?.content)) return response.content
  if (Array.isArray(response?.vehicles)) return response.vehicles
  if (Array.isArray(response?.data)) return response.data
  return []
}

function getUserFullName(owner?: OwnerProfile) {
  if (!owner) return ''

  return [owner.firstName, owner.middleName, owner.lastName]
      .filter(Boolean)
      .join(' ')
      .trim()
}

export default function OwnerProfilePage() {
  const authenticated = useAuthStore((state) => state.authenticated)
  const navigate = useNavigate()

  const hasAccessToken = Boolean(localStorage.getItem('accessToken'))

  const {
    data: owner,
    isPending: ownerPending,
    isError: ownerError,
    error: ownerQueryError,
  } = useQuery<OwnerProfile>({
    queryKey: ['owner', 'me'],
    queryFn: getMyOwnerProfile,
    enabled: authenticated && hasAccessToken,
    retry: false,
  })

  const {
    data: vehiclesResponse,
    isPending: vehiclesPending,
    isError: vehiclesError,
    error: vehiclesQueryError,
  } = useQuery<VehiclesResponse>({
    queryKey: ['owner', 'me', 'vehicles'],
    queryFn: getMyOwnerVehicles,
    enabled: authenticated && hasAccessToken,
    retry: false,
  })

  const vehicles = normalizeVehicles(vehiclesResponse)
  const fullName = useMemo(() => getUserFullName(owner), [owner])

  function handleAddVehicleClick() {
    navigate('/vehicle/register')
  }

  if (!authenticated && hasAccessToken) {
    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 px-4 py-10">
          <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
            <h1 className="text-3xl font-bold text-slate-900">
              {t('owner.ownerProfile.title')}
            </h1>

            <Button
                className="mt-4 text-slate-600"
                onClick={() => navigate('/login?redirect=/owner/profile')}
            >
              {t('owner.ownerProfile.loginRequired')}
            </Button>
          </div>
        </main>
    )
  }

  if (ownerPending || (owner && vehiclesPending)) {
    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 px-4 py-10">
          <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
            <h1 className="text-3xl font-bold text-slate-900">
              {t('owner.ownerProfile.title')}
            </h1>
            <p className="mt-4 text-slate-600">{t('common.loading')}</p>
          </div>
        </main>
    )
  }

  if (ownerError || !owner) {
    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 px-4 py-10">
          <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
            <h1 className="text-3xl font-bold text-slate-900">
              {t('owner.ownerProfile.title')}
            </h1>
            <p className="mt-4 text-sm text-red-600">
              {ownerError
                  ? getErrorMessage(ownerQueryError)
                  : t('owner.ownerProfile.notFound')}
            </p>
          </div>
        </main>
    )
  }

  return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 px-4 py-10">
        <div className="mx-auto max-w-6xl space-y-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
            <div className="space-y-3 text-center">
              <h1 className="text-3xl font-bold text-slate-900">
                {t('owner.ownerProfile.title')}
              </h1>
              <p className="text-slate-600">{t('owner.ownerProfile.subtitle')}</p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-medium text-slate-500">
                  {t('owner.ownerProfile.fields.fullName')}
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{fullName}</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-medium text-slate-500">
                  {t('owner.ownerProfile.fields.username')}
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-900">
                  {owner.username}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-medium text-slate-500">
                  {t('owner.ownerProfile.fields.phone')}
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-900">
                  {owner.phone || t('owner.ownerProfile.notProvided')}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-medium text-slate-500">
                  {t('owner.ownerProfile.fields.email')}
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-900">
                  {owner.email || t('owner.ownerProfile.notProvided')}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-medium text-slate-500">
                  {t('owner.ownerProfile.fields.verified')}
                </p>
                <p
                    className={`mt-2 text-lg font-semibold ${
                        owner.isVerified ? 'text-emerald-600' : 'text-amber-600'
                    }`}
                >
                  {owner.isVerified
                      ? t('owner.ownerProfile.values.verified')
                      : t('owner.ownerProfile.values.notVerified')}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-medium text-slate-500">
                  {t('owner.ownerProfile.fields.hasCompany')}
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-900">
                  {owner.hasCompany
                      ? t('owner.ownerProfile.values.yes')
                      : t('owner.ownerProfile.values.no')}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 md:col-span-2 xl:col-span-3">
                <p className="text-sm font-medium text-slate-500">
                  {t('owner.ownerProfile.fields.companyName')}
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-900">
                  {owner.companyName || t('owner.ownerProfile.notProvided')}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
            <div className="pb-3.75">
              <Button
                  className="w-full rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
                  onClick={handleAddVehicleClick}
              >
                {t('owner.ownerProfile.myVehicles.addVehicleButtonText')}
              </Button>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {t('owner.ownerProfile.myVehicles.title')}
                </h2>
                <p className="text-slate-600">
                  {t('owner.ownerProfile.myVehicles.subtitle')}
                </p>
              </div>
            </div>

            {vehiclesError ? (
                <p className="mt-6 text-sm text-red-600">
                  {getErrorMessage(vehiclesQueryError)}
                </p>
            ) : vehicles.length === 0 ? (
                <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
                  {t('owner.ownerProfile.myVehicles.empty')}
                </div>
            ) : (
                <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
                  <div className="hidden grid-cols-[1.8fr_1fr_1fr_1fr] bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-600 md:grid">
                    <div>{t('owner.ownerProfile.myVehicles.columns.vehicle')}</div>
                    <div>{t('owner.ownerProfile.myVehicles.columns.licensePlate')}</div>
                    <div>{t('owner.ownerProfile.myVehicles.columns.status')}</div>
                    <div>{t('owner.ownerProfile.myVehicles.columns.rating')}</div>
                  </div>

                  <div className="divide-y divide-slate-200">
                    {vehicles.map((vehicle) => (
                        <div
                            key={vehicle.id}
                            className="grid cursor-pointer gap-3 px-5 py-4 transition hover:bg-slate-50 md:grid-cols-[1.8fr_1fr_1fr_1fr] md:items-center"
                        >
                          <div>
                            <p className="text-sm font-medium text-slate-500 md:hidden">
                              {t('owner.ownerProfile.myVehicles.columns.vehicle')}
                            </p>
                            <p className="text-base font-semibold text-slate-900">
                              {vehicle.year} {vehicle.make} {vehicle.model}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-500 md:hidden">
                              {t('owner.ownerProfile.myVehicles.columns.licensePlate')}
                            </p>
                            <p className="text-base font-semibold text-slate-900">
                              {vehicle.licensePlate || t('owner.ownerProfile.notProvided')}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-500 md:hidden">
                              {t('owner.ownerProfile.myVehicles.columns.status')}
                            </p>
                            <Button
                                onClick={() =>
                                    navigate(`/owner/profile/vehicles/${vehicle.id}`)
                                }
                            >
                              {t('owner.ownerProfile.myVehicles.columns.status')}
                            </Button>
                          </div>
                          <div className="flex items-center justify-start md:justify-center">
                            <Rating value={vehicle.rating} />
                          </div>
                        </div>
                    ))}
                  </div>
                </div>
            )}
          </section>
        </div>
      </main>
  )
}
