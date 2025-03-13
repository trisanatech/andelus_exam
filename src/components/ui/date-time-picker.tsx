'use client'

import React from 'react'
import DatePicker from 'react-datepicker'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar, Clock } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import 'react-datepicker/dist/react-datepicker.css'
import './date-time-picker.css'

interface DateTimePickerProps {
  value?: Date
  onChange: (date: Date) => void
  className?: string
}

export function DateTimePicker({ value, onChange, className }: DateTimePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal',
            !value && 'text-muted-foreground',
            className
          )}
        >
          <Calendar className="mr-2 h-4 w-4" />
          {value ? (
            <>
              {value.toLocaleDateString()} <Clock className="ml-2 h-4 w-4" />
              {value.toLocaleTimeString()}
            </>
          ) : (
            <span>Pick a date and time</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <DatePicker
          selected={value}
          onChange={(date: Date) => onChange(date)}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          timeCaption="Time"
          dateFormat="MMMM d, yyyy h:mm aa"
          inline
        />
      </PopoverContent>
    </Popover>
  )
}