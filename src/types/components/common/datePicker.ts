import type { DateOnlyString } from '@/types/date.ts'
import type { Dispatch, SetStateAction } from 'react'

export type DatePickerFieldProps = {
  value?: DateOnlyString
  onDateSelection: Dispatch<SetStateAction<DateOnlyString | undefined>>
  placeholderKey?: string
  className?: string
  disabled?: boolean
  fromYear?: number
  toYear?: number
}
