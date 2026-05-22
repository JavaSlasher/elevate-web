import { useState } from 'react'
import { t } from '@/shared/i18n'
import { Button } from '@/components/ui/button.tsx'
import type { UserRoleSelectionModalProps } from '@/types/user.ts'

export default function UserRoleSelectionModal({
  open,
  onSubmit,
  isSubmitting = false,
}: UserRoleSelectionModalProps) {
  const [willBeDriver, setWillBeDriver] = useState(false)
  const [willBeOwner, setWillBeOwner] = useState(false)

  if (!open) {
    return null
  }

  const selectedRoles: ('DRIVER' | 'OWNER')[] = [
    ...(willBeDriver ? ['DRIVER' as const] : []),
    ...(willBeOwner ? ['OWNER' as const] : [])
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl">
        <div className="space-y-3 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            {t('user.userRoles.modal.eyebrow')}
          </p>

          <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            {t('user.userRoles.modal.title')}
          </h2>

          <p className="text-sm text-slate-600 md:text-base">
            {t('user.userRoles.modal.description')}
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <label className="flex items-start gap-3 rounded-2xl border border-slate-200 p-4">
            <input
              type="checkbox"
              checked={willBeDriver}
              onChange={(e) => setWillBeDriver(e.target.checked)}
              className="mt-1 h-4 w-4"
            />
            <div>
              <p className="font-semibold text-slate-900">
                {t('user.userRoles.modal.driverTitle')}
              </p>
              <p className="text-sm text-slate-600">
                {t('user.userRoles.modal.driverDescription')}
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 rounded-2xl border border-slate-200 p-4">
            <input
              type="checkbox"
              checked={willBeOwner}
              onChange={(e) => setWillBeOwner(e.target.checked)}
              className="mt-1 h-4 w-4"
            />
            <div>
              <p className="font-semibold text-slate-900">
                {t('user.userRoles.modal.ownerTitle')}
              </p>
              <p className="text-sm text-slate-600">
                {t('user.userRoles.modal.ownerDescription')}
              </p>
            </div>
          </label>
        </div>

        <div className="mt-8 flex justify-end">
          <Button
            type="button"
            onClick={() => onSubmit(selectedRoles)}
            disabled={isSubmitting}
          >
            {isSubmitting ? t('common.loading') : t('user.userRoles.modal.continue')}
          </Button>
        </div>
      </div>
    </div>
  )
}
