import { t } from '@/shared/i18n'
import FeaturedVehiclesComponent from '../components/vehicle/FeaturedVehiclesComponent.tsx'
import type { FeaturedVehicleCard } from '@/types/vehicle.ts'
import TeslaImage from '@/assets/tesla.jpeg'
import LucidImage from '@/assets/lucid.jpeg'
import BMWImage from '@/assets/bmw.jpeg'
import MercedesImage from '@/assets/merce.jpeg'
import Porsche from '@/assets/porche.jpeg'
import BrandImage from '@/assets/brand-d.png'

const featuredVehicles: FeaturedVehicleCard[] = [
  {
    id: 'vehicle-1',
    image: TeslaImage,
    year: 2024,
    make: 'Tesla',
    model: 'Model S',
  },
  {
    id: 'vehicle-2',
    image: LucidImage,
    year: 2024,
    make: 'Lucid',
    model: 'Air',
  },
  {
    id: 'vehicle-3',
    image: BMWImage,
    year: 2025,
    make: 'BMW',
    model: 'i7',
  },
  {
    id: 'vehicle-4',
    image: MercedesImage,
    year: 2025,
    make: 'Mercedes',
    model: 'EQS',
  },
  {
    id: 'vehicle-5',
    image: Porsche,
    year: 2024,
    make: 'Porsche',
    model: 'Taycan',
  },
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#ffffff] via-[#f5ecd2] to-[#e8cf8a] px-2">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10">
        {/*<section className="flex w-full flex-col items-center text-center">*/}
        <img
          src={BrandImage}
          alt={t('home.logoAlt')}
          className="w-115 object-contain"
        />
        {/*<h1 className="mt-6 bg-gradient-to-r from-[#f7d774] via-[#d4a637] to-[#8a6218] bg-clip-text text-4xl font-bold text-transparent">
            {t('home.hero.title')}
          </h1>

          <p className="mt-3 max-w-2xl text-base text-slate-700">
            {t('home.hero.subtitle')}
          </p>*/}
        {/* </section>*/}
      </div>
      <FeaturedVehiclesComponent vehicles={featuredVehicles} />
    </main>
  )
}
