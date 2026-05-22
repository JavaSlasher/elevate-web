import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

import { t } from '@/shared/i18n'
import { Button } from '@/components/ui/button.tsx'
import { useAuthStore } from '@/store/authStore.ts'
import { createDriver, getMyDriverProfile } from '@/api/driver.ts'
import { getErrorMessage } from '@/shared/utils/errorMessageUtil.ts'

export default function DriverRegisterPage() {
  const navigate = useNavigate()
  const authenticated = useAuthStore((state) => state.authenticated)
  const user = useAuthStore((state) => state.user)
  const [checkingExistingProfile, setCheckingExistingProfile] = useState(true)
  const [form, setForm] = useState({
    licenseNumber: '',
    licenseExpiryDate: '',
    licenseState: '',
  })

  useEffect(() => {
    let active = true

    async function checkExistingDriverProfile() {
      if (!authenticated || !user?.id) {
        if (active) {
          setCheckingExistingProfile(false)
        }
        return
      }

      try {
        await getMyDriverProfile()

        if (active) {
          navigate('/driver/profile', { replace: true })
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          if (active) {
            setCheckingExistingProfile(false)
          }
          return
        }

        if (active) {
          setCheckingExistingProfile(false)
        }
      }
    }

    checkExistingDriverProfile()

    return () => {
      active = false
    }
  }, [authenticated, user?.id, navigate])

  const mutation = useMutation({
    mutationFn: createDriver,
    onSuccess: () => {
      navigate('/driver/profile')
    },
  })

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!user?.id) {
      navigate('/login?redirect=/driver/register')
      return
    }

    mutation.mutate({
      licenseNumber: form.licenseNumber.trim(),
      licenseExpiryDate: form.licenseExpiryDate || undefined,
      licenseState: form.licenseState || undefined,
    })
  }

  if (checkingExistingProfile) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 px-4 py-10">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
            <div className="space-y-3 text-center">
              <h1 className="text-3xl font-bold text-slate-900">
                {t('driver.driverRegister.title')}
              </h1>
              <p className="text-slate-600">{t('common.loading')}</p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
          <div className="space-y-3 text-center">
            <h1 className="text-3xl font-bold text-slate-900">
              {t('driver.driverRegister.title')}
            </h1>

            <p className="text-slate-600">{t('driver.driverRegister.subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-6">
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-slate-700"
                htmlFor="licenseNumber"
              >
                {t('driver.driverRegister.fields.licenseNumber')}
              </label>

              <input
                id="licenseNumber"
                value={form.licenseNumber}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    licenseNumber: e.target.value,
                  }))
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-slate-700"
                htmlFor="licenseExpiryDate"
              >
                {t('driver.driverRegister.fields.licenseExpiryDate')}
              </label>

              <input
                id="licenseExpiryDate"
                type="date"
                value={form.licenseExpiryDate}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    licenseExpiryDate: e.target.value,
                  }))
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-slate-700"
                htmlFor="licenseState"
              >
                {t('driver.driverRegister.fields.licenseState')}
              </label>

              <input
                id="licenseState"
                value={form.licenseState}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    licenseState: e.target.value,
                  }))
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {mutation.isError && (
              <p className="text-sm text-red-600">{getErrorMessage(mutation.error)}</p>
            )}

            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
            >
              {mutation.isPending
                ? t('common.loading')
                : t('driver.driverRegister.submit')}
            </Button>
          </form>
        </div>
      </div>
    </main>
  )
}
