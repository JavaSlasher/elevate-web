import type { SyntheticEvent } from 'react'
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { t } from '@/shared/i18n'
import type {
  CreateVehicleRequest,
  VehicleAvailabilityStatus,
  VehicleStatus,
  VehicleType,
} from '@/types/vehicle'
import { createVehicle } from '@/api/vehicle.ts'
import { getErrorMessage } from '@/shared/utils/errorMessageUtil.ts'
import VehicleImageUploadComponent from '@/components/file/VehicleImageUploadComponent.tsx'
import VehicleOwnershipUploadComponent from '@/components/file/VehicleOwnershipUploadComponent.tsx'

export default function VehicleRegisterPage() {
  const navigate = useNavigate()
  const authenticated = useAuthStore((state) => state.authenticated)
  const user = useAuthStore((state) => state.user)

  const [form, setForm] = useState<CreateVehicleRequest>({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    licensePlate: '',
    vehicleType: 'SEDAN',
    capacity: 4,
    status: 'ACTIVE',
    availabilityStatus: 'AVAILABLE',
    dailyRate: 0,
    weeklyRate: undefined,
    monthlyRate: undefined,
  })

  const isOwnerMissing = useMemo(() => !authenticated || !user, [authenticated, user])

  const mutation = useMutation({
    mutationFn: createVehicle,
    onSuccess: () => {
      navigate('/vehicles')
    },
  })

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!user?.id) {
      navigate('/login?redirect=/vehicle/register')
      return
    }

    mutation.mutate({
      ...form,
      userId: user.id,
      make: form.make.trim(),
      model: form.model.trim(),
      licensePlate: form.licensePlate.trim(),
      dailyRate: Number(form.dailyRate),
      weeklyRate: form.weeklyRate ? Number(form.weeklyRate) : undefined,
      monthlyRate: form.monthlyRate ? Number(form.monthlyRate) : undefined,
      capacity: Number(form.capacity),
      year: Number(form.year),
    })
  }

  if (isOwnerMissing) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-10">
        <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-slate-900">
            {t('vehicle.vehicleRegister.title')}
          </h1>
          <p className="mt-3 text-slate-600">
            {t('vehicle.vehicleRegister.loginRequired')}
          </p>
          <div className="mt-6">
            <Link
              to="/login?redirect=/vehicle/register"
              className="inline-flex rounded-xl bg-slate-900 px-5 py-3 font-medium text-white"
            >
              {t('vehicle.vehicleRegister.goToLogin')}
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-slate-900">
            {t('vehicle.vehicleRegister.title')}
          </h1>
          <p className="text-slate-600">{t('vehicle.vehicleRegister.subtitle')}</p>
        </div>
        <VehicleImageUploadComponent />
        <VehicleOwnershipUploadComponent />
        <form onSubmit={handleSubmit} className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="make" className="text-sm font-medium text-slate-700">
              {t('vehicle.vehicleRegister.fields.make')}
            </label>
            <input
              id="make"
              value={form.make}
              onChange={(e) => setForm((prev) => ({ ...prev, make: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 px-4 py-3"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="model" className="text-sm font-medium text-slate-700">
              {t('vehicle.vehicleRegister.fields.model')}
            </label>
            <input
              id="model"
              value={form.model}
              onChange={(e) => setForm((prev) => ({ ...prev, model: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 px-4 py-3"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="year" className="text-sm font-medium text-slate-700">
              {t('vehicle.vehicleRegister.fields.year')}
            </label>
            <input
              id="year"
              type="number"
              value={form.year}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, year: Number(e.target.value) }))
              }
              className="w-full rounded-xl border border-slate-200 px-4 py-3"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="licensePlate" className="text-sm font-medium text-slate-700">
              {t('vehicle.vehicleRegister.fields.licensePlate')}
            </label>
            <input
              id="licensePlate"
              value={form.licensePlate}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, licensePlate: e.target.value }))
              }
              className="w-full rounded-xl border border-slate-200 px-4 py-3"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="vehicleType" className="text-sm font-medium text-slate-700">
              {t('vehicle.vehicleRegister.fields.vehicleType')}
            </label>
            <select
              id="vehicleType"
              value={form.vehicleType}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  vehicleType: e.target.value as VehicleType,
                }))
              }
              className="w-full rounded-xl border border-slate-200 px-4 py-3"
            >
              <option value="NANO">NANO</option>
              <option value="SEDAN">SEDAN</option>
              <option value="CROSSOVER">CROSSOVER</option>
              <option value="SUV">SUV</option>
              <option value="CYCLE">CYCLE</option>
              <option value="MOTORBIKE">MOTORBIKE</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="capacity" className="text-sm font-medium text-slate-700">
              {t('vehicle.vehicleRegister.fields.capacity')}
            </label>
            <input
              id="capacity"
              type="number"
              min="1"
              value={form.capacity}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, capacity: Number(e.target.value) }))
              }
              className="w-full rounded-xl border border-slate-200 px-4 py-3"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium text-slate-700">
              {t('vehicle.vehicleRegister.fields.status')}
            </label>
            <select
              id="status"
              value={form.status}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  status: e.target.value as VehicleStatus,
                }))
              }
              className="w-full rounded-xl border border-slate-200 px-4 py-3"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
              <option value="BLOCKED">BLOCKED</option>
            </select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="availabilityStatus"
              className="text-sm font-medium text-slate-700"
            >
              {t('vehicle.vehicleRegister.fields.availabilityStatus')}
            </label>
            <select
              id="availabilityStatus"
              value={form.availabilityStatus}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  availabilityStatus: e.target.value as VehicleAvailabilityStatus,
                }))
              }
              className="w-full rounded-xl border border-slate-200 px-4 py-3"
            >
              <option value="AVAILABLE">AVAILABLE</option>
              <option value="UNAVAILABLE">UNAVAILABLE</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="dailyRate" className="text-sm font-medium text-slate-700">
              {t('vehicle.vehicleRegister.fields.dailyRate')}
            </label>
            <input
              id="dailyRate"
              type="number"
              min="0"
              step="0.01"
              value={form.dailyRate}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, dailyRate: Number(e.target.value) }))
              }
              className="w-full rounded-xl border border-slate-200 px-4 py-3"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="weeklyRate" className="text-sm font-medium text-slate-700">
              {t('vehicle.vehicleRegister.fields.weeklyRate')}
            </label>
            <input
              id="weeklyRate"
              type="number"
              min="0"
              step="0.01"
              value={form.weeklyRate ?? ''}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  weeklyRate: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
              className="w-full rounded-xl border border-slate-200 px-4 py-3"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label htmlFor="monthlyRate" className="text-sm font-medium text-slate-700">
              {t('vehicle.vehicleRegister.fields.monthlyRate')}
            </label>
            <input
              id="monthlyRate"
              type="number"
              min="0"
              step="0.01"
              value={form.monthlyRate ?? ''}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  monthlyRate: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
              className="w-full rounded-xl border border-slate-200 px-4 py-3"
            />
          </div>

          {mutation.isError && (
            <p className="md:col-span-2 text-sm text-red-700">
              {getErrorMessage(mutation.error)}
            </p>
          )}

          {user?.isVerified ? (
            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={mutation.isPending}
                className="rounded-xl bg-slate-900 px-6 py-3 font-medium text-white"
              >
                {mutation.isPending
                  ? t('common.loading')
                  : t('vehicle.vehicleRegister.submit')}
              </button>
            </div>
          ) : (
            <section
              style={{
                marginTop: 24,
                padding: 16,
                borderRadius: 12,
                background: '#fef3c7',
                border: '1px solid #facc15',
                color: '#92400e',
              }}
            >
              {t('vehicle.vehicleRegister.verifyBeforeAdding')}
            </section>
          )}
        </form>
      </div>
    </main>
  )
}
