import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { t } from '@/shared/i18n'
import { Button } from '@/components/ui/button'
import { getMyBookings } from '@/api/bookings'
import { rateVehicle } from '@/api/rating'
import { useNavigate } from 'react-router-dom'
import type { BookingSummaryResponse } from '@/types/booking'

function getUserFullName(user?: {
  firstName?: string
  middleName?: string
  lastName?: string
}) {
  if (!user) return ''
  return [user.firstName, user.middleName, user.lastName].filter(Boolean).join(' ').trim()
}

function formatDate(value?: string) {
  if (!value) return ''
  return new Date(value).toLocaleDateString()
}

export default function UserProfilePage() {
  const authenticated = useAuthStore((state) => state.authenticated)
  const user = useAuthStore((state) => state.user)
  const navigate = useNavigate()

  const [editingRatings, setEditingRatings] = useState<Record<string, boolean>>({})
  const [ratings, setRatings] = useState<
      Record<string, { rating?: number; comment?: string }>
  >({})

  const {
    data: bookings = [],
    isPending,
  } = useQuery<BookingSummaryResponse[]>({
    queryKey: ['user', 'me', 'bookings'],
    queryFn: getMyBookings,
    enabled: authenticated,
  })

  const fullName = useMemo(() => getUserFullName(user ?? undefined), [user])

  const completedBookings = bookings.filter((b) => b.status === 'COMPLETED')
  const activeBookings = bookings.filter((b) => b.status !== 'COMPLETED')

  const handleStartEditing = (vehicleId: string) => {
    setEditingRatings((prev) => ({ ...prev, [vehicleId]: true }))
  }

  const handleRatingChange = (vehicleId: string, value: number) => {
    setRatings((prev) => ({
      ...prev,
      [vehicleId]: { ...prev[vehicleId], rating: value },
    }))
  }

  const handleCommentChange = (vehicleId: string, comment: string) => {
    setRatings((prev) => ({
      ...prev,
      [vehicleId]: { ...prev[vehicleId], comment },
    }))
  }

  const handleSubmitRating = async (vehicleId: string) => {
    const rating = ratings[vehicleId]?.rating
    const comment = ratings[vehicleId]?.comment || ''

    if (!rating) {
      alert('Please select a rating')
      return
    }

    await rateVehicle(vehicleId, rating, comment)

    setEditingRatings((prev) => ({
      ...prev,
      [vehicleId]: false,
    }))
  }

  if (!authenticated || !user) {
    return (
        <main className="min-h-screen px-4 py-10">
          <div className="mx-auto max-w-5xl rounded-3xl border bg-white p-8 shadow-xl">
            <h1 className="text-3xl font-bold">{t('user.userProfile.title')}</h1>
            <p className="mt-4">{t('user.userProfile.loginRequired')}</p>
          </div>
        </main>
    )
  }

  if (isPending) {
    return (
        <main className="min-h-screen px-4 py-10">
          <div className="mx-auto max-w-5xl rounded-3xl border bg-white p-8 shadow-xl">
            <h1 className="text-3xl font-bold">{t('user.userProfile.title')}</h1>
            <p className="mt-4">{t('common.loading')}</p>
          </div>
        </main>
    )
  }

  return (
      <main className="min-h-screen px-4 py-10">
        <div className="mx-auto max-w-6xl space-y-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
            <h1 className="text-3xl font-bold text-slate-900 text-center">
              {t('user.userProfile.title')}
            </h1>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <div className="p-5 border border-slate-200 rounded-xl">
                <p className="text-sm text-slate-500">Full Name</p>
                <p className="font-semibold text-slate-900">{fullName}</p>
              </div>

              <div className="p-5 border border-slate-200 rounded-xl">
                <p className="text-sm text-slate-500">Username</p>
                <p className="font-semibold text-slate-900">{user.username}</p>
              </div>
            </div>
          </section>
          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
            <Button className="w-full mb-6" onClick={() => navigate('/vehicle/search')}>
              Book Vehicle
            </Button>

            <h2 className="text-2xl font-bold text-slate-900">
              Active Bookings
            </h2>

            {activeBookings.length === 0 ? (
                <div className="mt-6 text-slate-600">No active bookings</div>
            ) : (
                <div className="mt-6 divide-y divide-slate-200">
                  {activeBookings.map((b) => (
                      <div
                          key={b.id}
                          className="grid gap-3 px-5 py-4 md:grid-cols-[1.8fr_1fr_1fr_1fr] md:items-center"
                      >
                        <div>
                          <p className="text-base font-semibold text-slate-900">
                            {b.vehicleYear} {b.vehicleMake} {b.vehicleModel}
                          </p>
                        </div>

                        <div>
                          <p className="text-base font-semibold text-slate-900">
                            {b.vehicleLicensePlate}
                          </p>
                        </div>

                        <div>
                    <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                      {b.status}
                    </span>
                        </div>

                        <div>
                          <p className="text-sm text-slate-600">
                            {formatDate(b.startDate)}
                          </p>
                        </div>
                      </div>
                  ))}
                </div>
            )}
          </section>
          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-slate-900">
              Completed Bookings
            </h2>

            {completedBookings.length === 0 ? (
                <div className="mt-6 text-slate-600">
                  No completed bookings
                </div>
            ) : (
                <div className="mt-6 divide-y divide-slate-200">
                  {completedBookings.map((b) => {
                    const existingRating = b.vehicleRating
                    const existingComment = b.vehicleComment

                    const local = ratings[b.vehicleId] || {}

                    const isEditing =
                        editingRatings[b.vehicleId] || existingRating == null

                    const ratingValue =
                        local.rating ?? existingRating ?? ''

                    const commentValue =
                        local.comment ?? existingComment ?? ''

                    return (
                        <div
                            key={b.id}
                            className="grid gap-3 px-5 py-4 md:grid-cols-[1.8fr_1fr_1fr_1fr] md:items-start"
                        >
                          <div>
                            <p className="text-base font-semibold text-slate-900">
                              {b.vehicleYear} {b.vehicleMake} {b.vehicleModel}
                            </p>
                          </div>

                          <div>
                            <p className="text-base font-semibold text-slate-900">
                              {b.vehicleLicensePlate}
                            </p>
                          </div>

                          <div>
                      <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                        COMPLETED
                      </span>
                          </div>

                          <div className="space-y-2">
                            {isEditing ? (
                                <>
                                  <select
                                      className="w-full rounded-xl border border-slate-300 px-3 py-2"
                                      value={ratingValue}
                                      onChange={(e) =>
                                          handleRatingChange(
                                              b.vehicleId,
                                              Number(e.target.value)
                                          )
                                      }
                                  >
                                    <option value="">Rate (1–10)</option>
                                    {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                                        <option key={n} value={n}>
                                          {n}
                                        </option>
                                    ))}
                                  </select>

                                  <textarea
                                      className="w-full rounded-xl border border-slate-300 px-3 py-2"
                                      placeholder="Write a comment..."
                                      value={commentValue}
                                      onChange={(e) =>
                                          handleCommentChange(
                                              b.vehicleId,
                                              e.target.value
                                          )
                                      }
                                  />

                                  <Button
                                      className="w-full mt-2"
                                      onClick={() => handleSubmitRating(b.vehicleId)}
                                  >
                                    Submit Rating
                                  </Button>
                                </>
                            ) : (
                                <>
                                  <p className="text-sm font-semibold text-green-600">
                                    Rating: {existingRating}
                                  </p>

                                  {existingComment && (
                                      <p className="text-sm text-slate-600">
                                        "{existingComment}"
                                      </p>
                                  )}

                                  <button
                                      className="text-sm text-blue-600 underline"
                                      onClick={() => handleStartEditing(b.vehicleId)}
                                  >
                                    Rate again
                                  </button>
                                </>
                            )}
                          </div>
                        </div>
                    )
                  })}
                </div>
            )}
          </section>

        </div>
      </main>
  )
}
