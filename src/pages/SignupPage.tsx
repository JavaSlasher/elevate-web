import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { createUser } from '@/api/user'
import { useAuthStore } from '@/store/authStore'
import { t } from '@/shared/i18n'
import { getErrorMessage } from '@/shared/utils/errorMessageUtil'
import type { UserRole } from '@/types/user'

export default function SignupPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const pendingSignupRoles = useAuthStore((state) => state.pendingSignupRoles)
  const clearPendingSignupRoles = useAuthStore((state) => state.clearPendingSignupRoles)

  const redirect = useMemo(() => searchParams.get('redirect') ?? '/login', [searchParams])

  const roles = useMemo<UserRole[]>(() => {
    if (pendingSignupRoles.length > 0) {
      return pendingSignupRoles
    }

    return []
  }, [pendingSignupRoles])

  const [form, setForm] = useState({
    username: '',
    password: '',
    firstName: '',
    middleName: '',
    lastName: '',
    phone: '',
    email: '',
  })

  const [error, setError] = useState<string | null>(null)

  const signupMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      setError(null)
      clearPendingSignupRoles()
      navigate(redirect)
    },
    onError: (err: unknown) => {
      setError(getErrorMessage(err))
    },
  })

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    signupMutation.mutate({
      username: form.username.trim(),
      password: form.password,
      firstName: form.firstName.trim(),
      middleName: form.middleName.trim() || undefined,
      lastName: form.lastName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || undefined,
      roles,
    })
  }

  return (
      <main className="min-h-screen bg-slate-100 px-4 py-10">
        <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold text-slate-900">
              {t('auth.signup.title')}
            </h1>
            <p className="text-slate-600">{t('auth.signup.subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </div>
            )}

            <input
                className="w-full rounded-xl border border-slate-200 px-4 py-3"
                placeholder={t('auth.signup.username')}
                value={form.username}
                onChange={(e) =>
                    setForm((prev) => ({ ...prev, username: e.target.value }))
                }
            />

            <input
                type="password"
                className="w-full rounded-xl border border-slate-200 px-4 py-3"
                placeholder={t('auth.signup.password')}
                value={form.password}
                onChange={(e) =>
                    setForm((prev) => ({ ...prev, password: e.target.value }))
                }
            />

            <input
                className="w-full rounded-xl border border-slate-200 px-4 py-3"
                placeholder={t('auth.signup.firstName')}
                value={form.firstName}
                onChange={(e) =>
                    setForm((prev) => ({ ...prev, firstName: e.target.value }))
                }
            />

            <input
                className="w-full rounded-xl border border-slate-200 px-4 py-3"
                placeholder={t('auth.signup.middleName')}
                value={form.middleName}
                onChange={(e) =>
                    setForm((prev) => ({ ...prev, middleName: e.target.value }))
                }
            />

            <input
                className="w-full rounded-xl border border-slate-200 px-4 py-3"
                placeholder={t('auth.signup.lastName')}
                value={form.lastName}
                onChange={(e) =>
                    setForm((prev) => ({ ...prev, lastName: e.target.value }))
                }
            />

            <input
                className="w-full rounded-xl border border-slate-200 px-4 py-3"
                placeholder={t('auth.signup.phone')}
                value={form.phone}
                onChange={(e) =>
                    setForm((prev) => ({ ...prev, phone: e.target.value }))
                }
            />

            <input
                className="w-full rounded-xl border border-slate-200 px-4 py-3"
                placeholder={t('auth.signup.email')}
                value={form.email}
                onChange={(e) =>
                    setForm((prev) => ({ ...prev, email: e.target.value }))
                }
            />

            <button
                type="submit"
                disabled={signupMutation.isPending}
                className="w-full rounded-xl bg-slate-900 px-4 py-3 font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {signupMutation.isPending
                  ? t('common.loading')
                  : t('auth.signup.submit')}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            {t('auth.signup.haveAccount')}{' '}
            <Link className="font-medium text-slate-900" to={`/login?redirect=${redirect}`}>
              {t('auth.signup.loginLink')}
            </Link>
          </p>
        </div>
      </main>
  )
}
