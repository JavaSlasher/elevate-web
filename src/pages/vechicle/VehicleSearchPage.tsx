import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { t } from '@/shared/i18n'
import { Button } from '@/components/ui/button.tsx'
import DatePickerField from '@/components/common/DatePickerField.tsx'

export default function VehicleSearchPage() {
  const navigate = useNavigate()
  const [startDate, setStartDate] = useState<string | undefined>(undefined)
  const [endDate, setEndDate] = useState<string | undefined>(undefined)

  function handleSearch() {
    if (!startDate || !endDate) {
      alert(t('date.selectBothDates'))
      return
    }

    navigate(
      `/vehicles?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`,
    )
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>{t('vehicle.vehicleSearch.title')}</h1>
      <p>{t('vehicle.vehicleSearch.subTitle')}</p>

      <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
        <div>
          <label htmlFor="startDate">{t('date.startLabel')}</label>
          <br />
          <DatePickerField onDateSelection={setStartDate} value={startDate} />
        </div>

        <div>
          <label htmlFor="endDate">{t('date.endLabel')}</label>
          <br />
          <DatePickerField onDateSelection={setEndDate} value={endDate} />
        </div>

        <div style={{ alignSelf: 'end' }}>
          <Button
            className={'bg-blue-600 text-white outline-black'}
            onClick={handleSearch}
          >
            {t('vehicle.vehicleSearch.searchButtonText')}
          </Button>
        </div>
      </div>
    </main>
  )
}
