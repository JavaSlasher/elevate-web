import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { t } from '@/shared/i18n'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/authStore'
import { createOwner, getMyOwnerProfile } from '@/api/owner'
import { getErrorMessage } from '@/shared/utils/errorMessageUtil.ts'

export default function OwnerRegisterPage() {
  const navigate = useNavigate()
  const authenticated = useAuthStore((state) => state.authenticated)
  const user = useAuthStore((state) => state.user)

  const [checkingExistingProfile, setCheckingExistingProfile] = useState(true)

  const [form, setForm] = useState({
    hasCompany: false,
    companyName: '',
  })

  useEffect(() => {
    let active = true

    async function checkExistingOwnerProfile() {
      if (!authenticated || !user?.id) {
        if (active) {
          setCheckingExistingProfile(false)
        }
        return
      }

      try {
        await getMyOwnerProfile()

        if (active) {
          navigate('/owner/profile', { replace: true })
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

    checkExistingOwnerProfile()

    return () => {
      active = false
    }
  }, [authenticated, user?.id, navigate])

  const mutation = useMutation({
    mutationFn: createOwner,
    onSuccess: () => {
      navigate('/vehicle/register')
    },
  })

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!user?.id) {
      navigate('/login?redirect=/owner/register')
      return
    }

    if (form.hasCompany && !form.companyName.trim()) {
      return
    }

    mutation.mutate({
      hasCompany: form.hasCompany,
      companyName: form.hasCompany ? form.companyName.trim() : undefined,
    })
  }

  if (checkingExistingProfile) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 px-4 py-10">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
            <div className="space-y-3 text-center">
              <h1 className="text-3xl font-bold text-slate-900">
                {t('owner.ownerRegister.title')}
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
              {t('owner.ownerRegister.title')}
            </h1>

            <p className="text-slate-600">{t('owner.ownerRegister.subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-6">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={form.hasCompany}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      hasCompany: e.target.checked,
                      companyName: e.target.checked ? prev.companyName : '',
                    }))
                  }
                  className="mt-1 h-4 w-4"
                />

                <div>
                  <p className="font-semibold text-slate-900">
                    {t('owner.ownerRegister.fields.hasCompany')}
                  </p>
                  <p className="text-sm text-slate-600">
                    {t('owner.ownerRegister.fields.hasCompanyHint')}
                  </p>
                </div>
              </label>
            </div>

            {form.hasCompany && (
              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-slate-700"
                  htmlFor="companyName"
                >
                  {t('owner.ownerRegister.fields.companyName')}
                </label>

                <input
                  id="companyName"
                  value={form.companyName}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      companyName: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  required={form.hasCompany}
                />
              </div>
            )}

            {mutation.isError && (
              <p className="text-sm text-red-600">{getErrorMessage(mutation.error)}</p>
            )}

            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
            >
              {mutation.isPending ? t('common.loading') : t('owner.ownerRegister.submit')}
            </Button>
          </form>
        </div>
      </div>
    </main>
  )
}
