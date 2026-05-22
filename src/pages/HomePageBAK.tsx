import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { t } from '@/shared/i18n'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/authStore'
import { getCurrentUser, upsertMyRoles } from '@/api/user'
import type { UserRole } from '@/types/user'
import axios from 'axios'
import { getMyDriverProfile } from '@/api/driver.ts'
import { getMyOwnerProfile } from '@/api/owner.ts'

export default function HomePageBAK() {
  const navigate = useNavigate()
  const authenticated = useAuthStore((state) => state.authenticated)
  const setPendingSignupRoles = useAuthStore((state) => state.setPendingSignupRoles)
  const setUser = useAuthStore((state) => state.setUser)

  const [showEntryModal] = useState(true)

  const roleMutation = useMutation({
    mutationFn: async (roles: UserRole[]) => upsertMyRoles({ roles }),
    onSuccess: (updatedUser) => {
      setUser(updatedUser)
    },
  })

  async function handleCustomer() {
    if (authenticated) {
      try {
        const updatedUser = await roleMutation.mutateAsync(['CUSTOMER'])
        setUser(updatedUser)

        try {
          await getCurrentUser()
          navigate('/user/profile')
        } catch (error) {
          if (axios.isAxiosError(error) && error.response?.status === 404) {
            navigate('/vehicle/search')
            return
          }

          navigate('/vehicle/search')
        }
      } catch {
        // handled by mutation state
      }
      return
    }

    setPendingSignupRoles(['CUSTOMER'])
    navigate('/login?redirect=/vehicle/search')
  }

  async function handleOwner() {
    if (authenticated) {
      try {
        const updatedUser = await roleMutation.mutateAsync(['OWNER'])
        setUser(updatedUser)

        try {
          await getMyOwnerProfile()
          navigate('/owner/profile')
        } catch (error) {
          if (axios.isAxiosError(error) && error.response?.status === 404) {
            navigate('/owner/register')
            return
          }

          navigate('/owner/register')
        }
      } catch {
        // handled by mutation state
      }
      return
    }

    setPendingSignupRoles(['OWNER'])
    navigate('/login?redirect=/owner/register')
  }

  async function handleDriver() {
    if (authenticated) {
      try {
        const updatedUser = await roleMutation.mutateAsync(['DRIVER'])
        setUser(updatedUser)

        try {
          await getMyDriverProfile()
          navigate('/driver/profile')
        } catch (error) {
          if (axios.isAxiosError(error) && error.response?.status === 404) {
            navigate('/driver/register')
            return
          }

          navigate('/driver/register')
        }
      } catch {
        // handled by mutation state
      }
      return
    }

    setPendingSignupRoles(['DRIVER'])
    navigate('/login?redirect=/driver/register')
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <section className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-16">
        <div className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-10 shadow-xl">
          <div className="space-y-4 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              {t('home.eyebrow')}
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
              {t('home.title')}
            </h1>
            <p className="mx-auto max-w-2xl text-base text-slate-600 md:text-lg">
              {t('home.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {showEntryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4">
          <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl">
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="group justify-items-center rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left transition hover:border-slate-300 hover:bg-slate-100">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {authenticated
                      ? t('home.entryModal.bookAuthenticatedTitle')
                      : t('home.entryModal.bookTitle')}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {authenticated
                      ? t('home.entryModal.bookAuthenticatedDescription')
                      : t('home.entryModal.bookDescription')}
                  </p>
                  <div className="pt-2">
                    <Button type="button" onClick={handleCustomer}>
                      {authenticated
                        ? t('home.entryModal.bookAuthenticatedButton')
                        : t('home.entryModal.bookButton')}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="group justify-items-center rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left transition hover:border-slate-300 hover:bg-slate-100">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {t('home.entryModal.rentOutTitle')}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {authenticated
                      ? t('home.entryModal.rentOutAuthenticatedDescription')
                      : t('home.entryModal.rentOutDescription')}
                  </p>
                  <div className="pt-2">
                    <Button
                      type="button"
                      onClick={handleOwner}
                      disabled={roleMutation.isPending}
                    >
                      {authenticated
                        ? t('home.entryModal.rentOutAuthenticatedButton')
                        : t('home.entryModal.rentOutButton')}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="group justify-items-center rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left transition hover:border-slate-300 hover:bg-slate-100">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {t('home.entryModal.driverTitle')}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {authenticated
                      ? t('home.entryModal.driverAuthenticatedDescription')
                      : t('home.entryModal.driverDescription')}
                  </p>
                  <div className="pt-2">
                    <Button
                      type="button"
                      onClick={handleDriver}
                      disabled={roleMutation.isPending}
                    >
                      {authenticated
                        ? t('home.entryModal.driverAuthenticatedButton')
                        : t('home.entryModal.driverButton')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {roleMutation.isError && (
              <p className="mt-4 text-center text-sm text-red-600">{t('common.error')}</p>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
