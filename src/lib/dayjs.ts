import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import jalaliday from 'jalaliday'
import calendarSystems from '@calidy/dayjs-calendarsystems'
import { toHijri, toGregorian } from 'hijri-converter'

// Islamic month names
const islamicMonths = [
  'محرم', 'صفر', 'ربیع الاول', 'ربیع الثانی', 'جمادی الاول', 'جمادی الثانی',
  'رجب', 'شعبان', 'رمضان', 'شوال', 'ذی القعده', 'ذی الحجه'
]

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
      try {
        const gregorianDate = d.toDate()
        const hijri = toHijri(gregorianDate.getFullYear(), gregorianDate.getMonth() + 1, gregorianDate.getDate())
        // Handle special formatting for month names
        if (fmt.includes('MMMM')) {
          const monthName = islamicMonths[hijri.hm - 1] || `ماه ${hijri.hm}`
          return fmt.replace('MMMM', monthName).replace('YYYY', hijri.hy.toString()).replace('MM', hijri.hm.toString().padStart(2, '0')).replace('DD', hijri.hd.toString().padStart(2, '0'))
        }
        
        return `${hijri.hy}-${hijri.hm.toString().padStart(2, '0')}-${hijri.hd.toString().padStart(2, '0')}`
      } catch (e) {
        console.error('Error converting to Islamic calendar:', e)
        return d.format(fmt)
      }
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


