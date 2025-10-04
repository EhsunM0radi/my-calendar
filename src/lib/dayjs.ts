import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import jalaliday from 'jalaliday'
import calendarSystems from '@calidy/dayjs-calendarsystems'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(localizedFormat)
dayjs.extend(jalaliday)
dayjs.extend(calendarSystems)

export type CalendarKind = 'gregorian' | 'jalali' | 'islamic'

export function formatInCalendar(dateIso: string, calendar: CalendarKind, fmt = 'YYYY-MM-DD'): string {
  const d = dayjs(dateIso)
  switch (calendar) {
    case 'gregorian':
      return d.format(fmt)
    case 'jalali':
      // @ts-expect-error calendar is provided by plugins
      return d.calendar('jalali').format(fmt)
    case 'islamic':
      // @ts-expect-error calendar is provided by plugins
      return d.calendar('islamic').format(fmt)
    default:
      return d.format(fmt)
  }
}

export function toAllCalendars(dateIso: string): { gregorian: string; jalali: string; islamic: string } {
  return {
    gregorian: formatInCalendar(dateIso, 'gregorian'),
    jalali: formatInCalendar(dateIso, 'jalali'),
    islamic: formatInCalendar(dateIso, 'islamic'),
  }
}

export default dayjs


