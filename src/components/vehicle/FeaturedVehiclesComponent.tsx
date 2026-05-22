import useEmblaCarousel from 'embla-carousel-react'
import { useNavigate } from 'react-router-dom'
import { t } from '@/shared/i18n'
import type { FeaturedVehicleCarouselProps } from '@/types/vehicle.ts'

export default function FeaturedVehiclesComponent({
  vehicles,
}: FeaturedVehicleCarouselProps) {
  const navigate = useNavigate()
  const [emblaRef] = useEmblaCarousel({
    loop: true,
    align: 'start',
  })

  return (
    <section className="mx-auto w-full max-w-6xl rounded-3xl border border-yellow-700/20 bg-[#0B0B0C]/95 p-2 shadow-2xl">
      <div className="mb-6 text-center">
        <h2 className="gold-text gold-underline">{t('home.highlyRated.title')}</h2>
        {/*<br />
        <p className="gold-text gold-underline">{t('home.highlyRated.subtitle')}</p>*/}
      </div>
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex gap-5">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="min-w-0 flex-[0_0_85%] sm:flex-[0_0_48%] lg:flex-[0_0_31%]"
            >
              <button
                type="button"
                onClick={() => navigate(`/vehicles/${vehicle.id}`)}
                className="group w-full overflow-hidden rounded-3xl border border-yellow-700/30 bg-white text-left shadow-lg transition hover:-translate-y-1 hover:shadow-yellow-700/30"
              >
                <div className="h-56 overflow-hidden bg-slate-100">
                  <img
                    src={vehicle.image}
                    alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-5">
                  <p className="text-xl font-bold text-slate-950">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </p>

                  <p className="mt-2 bg-gradient-to-r from-[#f7d774] via-[#d4a637] to-[#8a6218] bg-clip-text text-sm font-semibold text-transparent">
                    {t('home.highlyRated.viewDetails')}
                  </p>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
