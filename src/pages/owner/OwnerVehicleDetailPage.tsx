import { useParams } from 'react-router-dom'
import { t } from '@/shared/i18n'
import VehicleBookingCalendarComponent from '@/components/vehicle/VechicleBookingCalendarComponent.tsx'
import VehicleImagesComponent from "@/components/vehicle/VehicleImagesComponent.tsx";

export default function OwnerVehicleDetailPage() {
  const { id } = useParams()

  if (!id) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 px-4 py-10">
        <div className="mx-auto max-w-6xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-slate-900">
            {t('vehicle.ownerVehicleDetail.notFound')}
          </h1>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-slate-900">
            {t('vehicle.ownerVehicleDetail.title')}
          </h1>
          <p className="mt-2 text-slate-600">
            {t('vehicle.ownerVehicleDetail.subtitle')}
          </p>
        </section>
        <VehicleImagesComponent vehicleId={id} canManage={true} />
        <VehicleBookingCalendarComponent vehicleId={id} />
      </div>
    </main>
  )
}
