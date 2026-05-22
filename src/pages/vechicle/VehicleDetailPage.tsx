import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getVehicleById } from '@/api/vehicle.ts'
import { createBooking } from '@/api/bookings.ts'
import type { Vehicle } from '@/types/vehicle.ts'
import { t } from '@/shared/i18n'
import { useAuthStore } from '@/store/authStore.ts'
import UserDetailComponent from '@/components/user/UserDetailComponent.tsx'
import { formatDateOnly, getDayCount } from '@/shared/utils/dateUtils.ts'
import { Button } from '@/components/ui/button'
import VehicleImagesComponent from "@/components/vehicle/VehicleImagesComponent.tsx";

function calculateEstimatedSubtotal(vehicle: Vehicle, days: number): number {
  if (days <= 0) return 0

  const dailyRate = Number(vehicle.dailyRate ?? 0)
  const weeklyRate = Number(vehicle.weeklyRate ?? 0)
  const monthlyRate = Number(vehicle.monthlyRate ?? 0)

  if (monthlyRate > 0 && days >= 30) {
    const months = Math.floor(days / 30)
    const remainingDays = days % 30
    return months * monthlyRate + remainingDays * dailyRate
  }

  if (weeklyRate > 0 && days >= 7) {
    const weeks = Math.floor(days / 7)
    const remainingDays = days % 7
    return weeks * weeklyRate + remainingDays * dailyRate
  }

  return days * dailyRate
}

export default function VehicleDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const authenticated = useAuthStore((state) => state.authenticated)
  const user = useAuthStore((state) => state.user)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [typedName, setTypedName] = useState('')
  const startDate = searchParams.get('startDate') ?? ''
  const endDate = searchParams.get('endDate') ?? ''

  const {
    data: vehicle,
    isPending,
    isError,
    error,
  } = useQuery<Vehicle>({
    queryKey: ['vehicle', id],
    queryFn: () => getVehicleById(id as string),
    enabled: Boolean(id),
  })

  const bookingMutation = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      setShowConfirmModal(false)
      setTypedName('')
      navigate('/booking-success')
    },
  })

  const rentalDays = useMemo(() => {
    if (!startDate || !endDate) return 0
    return getDayCount(startDate, endDate)
  }, [startDate, endDate])

  const estimatedSubtotal = useMemo(() => {
    if (!vehicle) return 0
    return calculateEstimatedSubtotal(vehicle, rentalDays)
  }, [vehicle, rentalDays])

  const expectedFullName = useMemo(() => {
    if (!user) return ''
    return `${user.firstName} ${user.lastName}`.trim()
  }, [user])

  const nameAccepted =
    expectedFullName.length > 0 &&
    typedName.trim().toLowerCase() === expectedFullName.toLowerCase()

  function handlePrimaryAction() {
    if (!id) return

    if (!authenticated) {
      navigate(
        `/login?redirect=${encodeURIComponent(
          `/vehicle/${id}?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`,
        )}`,
      )
      return
    }

    if (!user?.isVerified) {
      alert(t('booking.verifyBeforeBooking'))
      return
    }

    setShowConfirmModal(true)
  }

  function handleCompleteBooking() {
    if (!id) return

    bookingMutation.mutate({
      vehicleId: id,
      startDate,
      endDate,
      rentalUnit: 'DAY',
      rentalQuantity: 1,
      pricePerUnit: 50,
    })
  }

  if (!id) {
    return (
      <main style={{ padding: 20 }}>
        <h1>{t('vehicle.vehicleDetail.title')}</h1>
        <p>{t('vehicle.vehicleDetail.notFound')}</p>
      </main>
    )
  }

  if (isPending) {
    return (
      <main style={{ padding: 20 }}>
        <h1>{t('vehicle.vehicleDetail.title')}</h1>
        <p>{t('vehicle.vehicleDetail.loading')}</p>
      </main>
    )
  }

  if (isError) {
    return (
      <main style={{ padding: 20 }}>
        <h1>{t('vehicle.vehicleDetail.title')}</h1>
        <p>{error instanceof Error ? error.message : t('vehicle.vehicleDetail.error')}</p>
      </main>
    )
  }

  if (!vehicle) {
    return (
      <main style={{ padding: 20 }}>
        <h1>{t('vehicle.vehicleDetail.title')}</h1>
        <p>{t('vehicle.vehicleDetail.notFound')}</p>
      </main>
    )
  }

  return (
    <main style={{ padding: 20, maxWidth: 860, margin: '0 auto' }}>
        <VehicleImagesComponent vehicleId={id} canManage={false}/>
        <UserDetailComponent />

      <h1>{t('vehicle.vehicleDetail.title')}</h1>

      <article
        style={{
          marginTop: 16,
          padding: 20,
          border: '1px solid #e5e7eb',
          borderRadius: 16,
          background: '#fff',
          boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
        }}
      >
        <h2 style={{ marginTop: 0 }}>
          {vehicle.year} {vehicle.make} {vehicle.model}
        </h2>

        <p>
          <strong>{t('vehicle.vehicleDetail.labels.make')}:</strong> {vehicle.make}
        </p>

        <p>
          <strong>{t('vehicle.vehicleDetail.labels.model')}:</strong> {vehicle.model}
        </p>

        <p>
          <strong>{t('vehicle.vehicleDetail.labels.year')}:</strong> {vehicle.year}
        </p>

        {vehicle.vehicleType && (
          <p>
            <strong>{t('vehicle.vehicleDetail.labels.type')}:</strong>{' '}
            {vehicle.vehicleType}
          </p>
        )}

        {vehicle.availabilityStatus && (
          <p>
            <strong>{t('vehicle.vehicleDetail.labels.status')}:</strong>{' '}
            {vehicle.availabilityStatus}
          </p>
        )}

        {vehicle.capacity != null && (
          <p>
            <strong>{t('vehicle.vehicleDetail.labels.capacity')}:</strong>{' '}
            {vehicle.capacity}
          </p>
        )}

        {vehicle.dailyRate != null && (
          <p>
            <strong>{t('vehicle.vehicleDetail.labels.dailyRate')}:</strong>{' '}
            {vehicle.dailyRate}
          </p>
        )}

        {vehicle.weeklyRate != null && (
          <p>
            <strong>{t('vehicle.vehicleDetail.labels.weeklyRate')}:</strong>{' '}
            {vehicle.weeklyRate}
          </p>
        )}

        {vehicle.monthlyRate != null && (
          <p>
            <strong>{t('vehicle.vehicleDetail.labels.monthlyRate')}:</strong>{' '}
            {vehicle.monthlyRate}
          </p>
        )}

        {startDate && endDate && (
          <p>
            <strong>{t('vehicle.vehicleDetail.labels.selectedDates')}:</strong>{' '}
            {formatDateOnly(startDate)} - {formatDateOnly(endDate)}
          </p>
        )}
      </article>

      <section
        style={{
          marginTop: 24,
          padding: 20,
          border: '1px solid #e5e7eb',
          borderRadius: 16,
          background: '#fff',
          boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
        }}
      >
        <h2 style={{ marginTop: 0 }}>{t('vehicle.vehicleDetail.totals.title')}</h2>

        {startDate && endDate ? (
          <>
            <p>
              <strong>{t('vehicle.vehicleDetail.totals.rentalDays')}:</strong>{' '}
              {rentalDays}
            </p>
            <p>
              <strong>{t('vehicle.vehicleDetail.totals.estimatedSubtotal')}:</strong>{' '}
              {estimatedSubtotal.toFixed(2)}
            </p>
            <p>{t('vehicle.vehicleDetail.totals.disclaimer')}</p>
          </>
        ) : (
          <p>{t('vehicle.vehicleDetail.totals.selectDates')}</p>
        )}
      </section>

      {!user?.isVerified && authenticated && (
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
          {t('booking.verifyBeforeBooking')}
        </section>
      )}

      {bookingMutation.isError && (
        <p style={{ color: '#b91c1c', marginTop: 16 }}>
          {bookingMutation.error.message
            ? bookingMutation.error.message
            : t('common.error')}
        </p>
      )}

      <div style={{ display: 'flex', gap: 12, marginTop: 24, alignItems: 'center' }}>
        <Link
          to={`/vehicles?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`}
          style={{ textDecoration: 'none' }}
        >
          {t('vehicle.vehicleDetail.backToResults')}
        </Link>

        <button
          type="button"
          onClick={handlePrimaryAction}
          style={{
            padding: '12px 18px',
            borderRadius: 12,
            border: 'none',
            background: '#111827',
            color: '#fff',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {authenticated
            ? t('vehicle.vehicleDetail.confirmBooking')
            : t('vehicle.vehicleDetail.bookThisVehicle')}
        </button>
      </div>

      {showConfirmModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(17, 24, 39, 0.55)',
            display: 'grid',
            placeItems: 'center',
            padding: 20,
            zIndex: 1000,
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 560,
              background: '#fff',
              borderRadius: 20,
              padding: 24,
              boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
            }}
          >
            <h2 style={{ marginTop: 0 }}>{t('vehicle.vehicleDetail.modal.title')}</h2>

            <p>{t('vehicle.vehicleDetail.modal.cancellationPolicy')}</p>

            <p>{t('vehicle.vehicleDetail.modal.acceptanceText')}</p>

            <p style={{ marginBottom: 8 }}>
              <strong>{t('vehicle.vehicleDetail.modal.typeYourName')}</strong>
            </p>

            <input
              type="text"
              value={typedName}
              onChange={(e) => setTypedName(e.target.value)}
              placeholder={expectedFullName}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 12,
                border: '1px solid #d1d5db',
                boxSizing: 'border-box',
              }}
            />

            {expectedFullName && (
              <p style={{ marginTop: 10, color: '#4b5563' }}>
                {t('vehicle.vehicleDetail.modal.expectedName')}{' '}
                <strong>{expectedFullName}</strong>
              </p>
            )}

            <div
              style={{
                display: 'flex',
                gap: 12,
                justifyContent: 'flex-end',
                marginTop: 24,
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setShowConfirmModal(false)
                  setTypedName('')
                }}
                style={{
                  padding: '12px 18px',
                  borderRadius: 12,
                  border: '1px solid #d1d5db',
                  background: '#fff',
                  color: '#111827',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {t('vehicle.vehicleDetail.modal.cancel')}
              </button>

              <Button
                className="
  rounded-xl
  border border-yellow-500/70
  bg-gradient-to-b from-[#f7d774] via-[#d4a637] to-[#8a6218]
  px-6 py-4
  text-base
  font-semibold text-black
  shadow-lg shadow-yellow-700/30
  transition
  hover:from-[#ffe89a] hover:via-[#e0b94a] hover:to-[#9a6f1c]
  active:scale-[0.98]
"
                onClick={handleCompleteBooking}
                disabled={!nameAccepted || bookingMutation.isPending}
                /*style={{
                  padding: '12px 18px',
                  borderRadius: 12,
                  border: 'none',
                  background: '#111827',
                  color: '#fff',
                  fontWeight: 600,
                  cursor:
                    !nameAccepted || bookingMutation.isPending
                      ? 'not-allowed'
                      : 'pointer',
                  opacity: !nameAccepted || bookingMutation.isPending ? 0.7 : 1,
                }}*/
              >
                {bookingMutation.isPending
                  ? t('common.loading')
                  : t('vehicle.vehicleDetail.modal.completeBooking')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
