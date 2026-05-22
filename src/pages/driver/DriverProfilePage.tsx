import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getMyDriverProfile } from '@/api/driver'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/authStore'
import { t } from '@/shared/i18n'
import { formatDateOnly, parseDateOnly } from '@/shared/utils/dateUtils'
import type { DriverProfile } from '@/types/driver'
import { getErrorMessage } from '@/shared/utils/errorMessageUtil.ts'

function isLicenseStillValid(licenseExpiryDate?: string): boolean {
  if (!licenseExpiryDate) {
    return true
  }

  const expiryDate = parseDateOnly(licenseExpiryDate)
  const now = new Date()

  const todayUtc = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  )

  return expiryDate.getTime() >= todayUtc.getTime()
}

export default function DriverProfilePage() {
  const user = useAuthStore((state) => state.user)
  const authenticated = useAuthStore((state) => state.authenticated)

  const {
    data: driver,
    isPending,
    isError,
    error,
  } = useQuery<DriverProfile>({
    queryKey: ['driver', 'me'],
    queryFn: getMyDriverProfile,
    enabled: authenticated,
  })

  const licenseValid = useMemo(
    () => isLicenseStillValid(driver?.licenseExpiryDate),
    [driver?.licenseExpiryDate],
  )

  const canGoOnline = Boolean(user?.isVerified) && licenseValid

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-slate-900">
            {t('driver.driverProfile.title')}
          </h1>
          <p className="mt-4 text-slate-600">{t('driver.driverProfile.loginRequired')}</p>
        </div>
      </main>
    )
  }

  if (isPending) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-slate-900">
            {t('driver.driverProfile.title')}
          </h1>
          <p className="mt-4 text-slate-600">{t('common.loading')}</p>
        </div>
      </main>
    )
  }

  if (isError || !driver) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-slate-900">
            {t('driver.driverProfile.title')}
          </h1>
          <p className="mt-4 text-sm text-red-600">
            {isError ? getErrorMessage(error) : t('driver.driverProfile.notFound')}
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 px-4 py-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
          <div className="space-y-3 text-center">
            <h1 className="text-3xl font-bold text-slate-900">
              {t('driver.driverProfile.title')}
            </h1>
            <p className="text-slate-600">{t('driver.driverProfile.subtitle')}</p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-500">
                {t('driver.driverProfile.fields.licenseNumber')}
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {driver.licenseNumber}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-500">
                {t('driver.driverProfile.fields.licenseExpiryDate')}
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {driver.licenseExpiryDate
                  ? formatDateOnly(driver.licenseExpiryDate)
                  : t('driver.driverProfile.noExpiryDate')}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-500">
                {t('driver.driverProfile.fields.licenseState')}
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {driver.licenseState || t('driver.driverProfile.notProvided')}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-500">
                {t('driver.driverProfile.fields.totalRides')}
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {driver.totalRides}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">
              {t('driver.driverProfile.availabilityTitle')}
            </h2>

            {!user?.isVerified ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
                {t('driver.driverProfile.awaitVerification')}
              </div>
            ) : !licenseValid ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
                {t('driver.driverProfile.licenseExpired')}
              </div>
            ) : (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700">
                {t('driver.driverProfile.readyToGoOnline')}
              </div>
            )}

            <div className="pt-2">
              <Button
                type="button"
                disabled={!canGoOnline}
                className="w-full rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-slate-300"
              >
                {t('driver.driverProfile.goOnline')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
