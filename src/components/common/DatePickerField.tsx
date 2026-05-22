import * as React from 'react'
import { CalendarIcon } from 'lucide-react'

import { t } from '@/shared/i18n'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { formatDateOnly, parseDateOnly, toDateOnlyString } from '@/shared/utils/dateUtils'
import type { DateOnlyString } from '@/types/date'

type DatePickerFieldProps = {
  value?: DateOnlyString
  onDateSelection: (date: DateOnlyString | undefined) => void
  placeholderKey?: string
  className?: string
  disabled?: boolean
  fromYear?: number
  toYear?: number
}

export default function DatePickerField({
  value,
  onDateSelection,
  placeholderKey = 'date.pickerPlaceholder',
  className,
  disabled = false,
  fromYear = 2024,
  toYear = 2035,
}: DatePickerFieldProps) {
  const [open, setOpen] = React.useState(false)

  const selectedDate = value ? parseDateOnly(value) : undefined
  const displayValue = value ? formatDateOnly(value) : t(placeholderKey)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            'h-11 w-full justify-between rounded-xl border-slate-200 bg-white px-4 text-left font-normal shadow-sm hover:bg-slate-50',
            !value && 'text-slate-500',
            className,
          )}
        >
          <span>{displayValue}</span>
          <CalendarIcon className="h-4 w-4 text-slate-500" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-auto rounded-2xl border-slate-200 p-0 shadow-xl"
      >
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => {
            onDateSelection(date ? toDateOnlyString(date) : undefined)
            setOpen(false)
          }}
          className="rounded-2xl"
          captionLayout="dropdown"
          fromYear={fromYear}
          toYear={toYear}
        />
      </PopoverContent>
    </Popover>
  )
}
