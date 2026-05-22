import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { login } from '@/api/auth'
import { useAuthStore } from '@/store/authStore'
import { t } from '@/shared/i18n'
import type { UserRole } from '@/types/user'
import { getCurrentUser, upsertMyRoles } from '@/api/user.ts'
import UserRoleSelectionModal from '@/components/user/UserRoleSelectionModal.tsx'
import { getErrorMessage } from '@/shared/utils/errorMessageUtil.ts'

type LoginResponse = {
  success?: boolean
  message?: string
  token?: string
  accessToken?: string
  access_token?: string
}

function getSafeRedirect(value: string | null) {
  if (!value || !value.startsWith('/')) {
    return '/'
  }

  return value
}

function getTokenFromLoginResponse(data: unknown) {
  if (!data || typeof data !== 'object') {
    return null
  }

  const response = data as LoginResponse

  return response.token ?? response.accessToken ?? response.access_token ?? null
}

export default function LoginPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams()

  const setAuthenticated = useAuthStore((state) => state.setAuthenticated)
  const setUser = useAuthStore((state) => state.setUser)

  const redirect = useMemo(
      () => getSafeRedirect(searchParams.get('redirect')),
      [searchParams],
  )

  const [form, setForm] = useState({
    username: '',
    password: '',
  })

  const [error, setError] = useState<string | null>(null)
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [pendingNavigationPath, setPendingNavigationPath] = useState<string>(redirect)
  const [roleSaving, setRoleSaving] = useState(false)

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: async (data: unknown) => {
      setError(null)

      const token = getTokenFromLoginResponse(data)

      if (!token) {
        setAuthenticated(false)
        setUser(null)
        setError('Login succeeded, but no access token was returned.')
        return
      }

      localStorage.setItem('accessToken', token)

      try {
        const currentUser = await getCurrentUser()

        setAuthenticated(true)
        setUser(currentUser)

        await queryClient.resetQueries()
        await queryClient.invalidateQueries()

        const hasRoles =
            Array.isArray(currentUser.roles) && currentUser.roles.length > 0

        if (currentUser.isVerified && !hasRoles) {
          setPendingNavigationPath(redirect)
          setShowRoleModal(true)
          return
        }

        navigate(redirect, { replace: true })
      } catch (err: unknown) {
        localStorage.removeItem('accessToken')
        setAuthenticated(false)
        setUser(null)
        setError(getErrorMessage(err))
      }
    },
    onError: (err: unknown) => {
      localStorage.removeItem('accessToken')
      setAuthenticated(false)
      setUser(null)
      setError(getErrorMessage(err))
    },
  })

  async function handleRoleSelectionSubmit(roles: UserRole[]) {
    setRoleSaving(true)
    setError(null)

    try {
      const updatedUser = await upsertMyRoles({ roles })
      setUser(updatedUser)
      setShowRoleModal(false)

      await queryClient.resetQueries()
      await queryClient.invalidateQueries()

      navigate(pendingNavigationPath, { replace: true })
    } catch (err: unknown) {
      setError(getErrorMessage(err))
    } finally {
      setRoleSaving(false)
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    loginMutation.mutate({
      username: form.username.trim(),
      password: form.password,
    })
  }

  return (
      <>
        <main className="grid min-h-screen place-items-center bg-gradient-to-b from-slate-50 to-indigo-50 p-5">
          <section className="w-full max-w-[440px] rounded-[20px] border border-slate-200 bg-white p-7 shadow-[0_16px_40px_rgba(0,0,0,0.08)]">
            <h1 className="mb-2 mt-0 text-3xl font-bold">{t('auth.login.title')}</h1>
            <p className="mt-0 text-slate-600">{t('auth.login.subtitle')}</p>

            <form onSubmit={handleSubmit} className="mt-5 grid gap-4">
              <div>
                <label htmlFor="username" className="mb-1.5 block">
                  {t('auth.login.username')}
                </label>
                <input
                    id="username"
                    type="text"
                    value={form.username}
                    onChange={(e) =>
                        setForm((prev) => ({ ...prev, username: e.target.value }))
                    }
                    className="box-border w-full rounded-xl border border-slate-300 px-3.5 py-3"
                    required
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-1.5 block">
                  {t('auth.login.password')}
                </label>
                <input
                    id="password"
                    type="password"
                    value={form.password}
                    onChange={(e) =>
                        setForm((prev) => ({ ...prev, password: e.target.value }))
                    }
                    className="box-border w-full rounded-xl border border-slate-300 px-3.5 py-3"
                    required
                />
              </div>

              {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {error}
                  </div>
              )}

              <button
                  type="submit"
                  disabled={loginMutation.isPending || roleSaving}
                  className="rounded-xl border-none bg-slate-900 px-[18px] py-3 font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {loginMutation.isPending ? t('common.loading') : t('auth.login.submit')}
              </button>
            </form>

            <p className="mt-5 text-slate-600">
              {t('auth.login.noAccount')}{' '}
              <Link to={`/signup?redirect=${encodeURIComponent(redirect)}`}>
                {t('auth.login.signupLink')}
              </Link>
            </p>
          </section>
        </main>

        <UserRoleSelectionModal
            open={showRoleModal}
            onSubmit={handleRoleSelectionSubmit}
            isSubmitting={roleSaving}
        />
      </>
  )
}
