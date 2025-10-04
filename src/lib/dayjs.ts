import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import momentJalaali from 'moment-jalaali'
import momentHijri from 'moment-hijri'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(localizedFormat)

// تنظیم لوکال فارسی برای moment-jalaali
momentJalaali.loadPersian({ usePersianDigits: false })

export type CalendarKind = 'gregorian' | 'jalali' | 'islamic'

const jalaliMonthNames = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
]

const hijriMonthNames = [
  'محرم', 'صفر', 'ربیع‌الاول', 'ربیع‌الثانی', 'جمادی‌الاول', 'جمادی‌الثانی',
  'رجب', 'شعبان', 'رمضان', 'شوال', 'ذی‌القعده', 'ذی‌الحجه'
]

const gregorianMonthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export function formatInCalendar(dateIso: string, calendar: CalendarKind, fmt = 'YYYY-MM-DD'): string {
  const date = new Date(dateIso)
  
  switch (calendar) {
    case 'gregorian': {
      const d = dayjs(dateIso)
      if (fmt === 'MMMM YYYY') {
        return `${gregorianMonthNames[date.getMonth()]} ${date.getFullYear()}`
      }
      return d.format(fmt)
    }
    case 'jalali': {
      const m = momentJalaali(dateIso)
      if (fmt === 'MMMM YYYY') {
        return `${jalaliMonthNames[m.jMonth()]} ${m.jYear()}`
      } else if (fmt === 'D') {
        return m.jDate().toString()
      }
      return m.format('jYYYY-jMM-jDD')
    }
    case 'islamic': {
      const m = momentHijri(dateIso)
      if (fmt === 'MMMM YYYY') {
        return `${hijriMonthNames[m.iMonth()]} ${m.iYear()}`
      } else if (fmt === 'D') {
        return m.iDate().toString()
      }
      return m.format('iYYYY-iMM-iDD')
    }
    default:
      return dayjs(dateIso).format(fmt)
  }
}

export function toAllCalendars(dateIso: string): { gregorian: string; jalali: string; islamic: string } {
  return {
    gregorian: formatInCalendar(dateIso, 'gregorian'),
    jalali: formatInCalendar(dateIso, 'jalali'),
    islamic: formatInCalendar(dateIso, 'islamic'),
  }
}

// Helper functions for calendar operations
export function getMonthStart(date: Date, calendar: CalendarKind): Date {
  switch (calendar) {
    case 'gregorian': {
      const d = new Date(date)
      d.setDate(1)
      d.setHours(0, 0, 0, 0)
      return d
    }
    case 'jalali': {
      const m = momentJalaali(date)
      m.jDate(1)
      return m.toDate()
    }
    case 'islamic': {
      const m = momentHijri(date)
      m.iDate(1)
      return m.toDate()
    }
  }
}

export function getDaysInMonth(date: Date, calendar: CalendarKind): number {
  switch (calendar) {
    case 'gregorian': {
      const d = new Date(date.getFullYear(), date.getMonth() + 1, 0)
      return d.getDate()
    }
    case 'jalali': {
      return momentJalaali(date).jDaysInMonth()
    }
    case 'islamic': {
      return momentHijri(date).iDaysInMonth()
    }
  }
}

export function addMonths(date: Date, amount: number, calendar: CalendarKind): Date {
  switch (calendar) {
    case 'gregorian': {
      const d = new Date(date)
      d.setMonth(d.getMonth() + amount)
      return d
    }
    case 'jalali': {
      const m = momentJalaali(date)
      m.add(amount, 'jMonth')
      return m.toDate()
    }
    case 'islamic': {
      const m = momentHijri(date)
      m.add(amount, 'iMonth')
      return m.toDate()
    }
  }
}

export function isSameMonth(date1: Date, date2: Date, calendar: CalendarKind): boolean {
  switch (calendar) {
    case 'gregorian': {
      return date1.getFullYear() === date2.getFullYear() && 
             date1.getMonth() === date2.getMonth()
    }
    case 'jalali': {
      const m1 = momentJalaali(date1)
      const m2 = momentJalaali(date2)
      return m1.jYear() === m2.jYear() && m1.jMonth() === m2.jMonth()
    }
    case 'islamic': {
      const m1 = momentHijri(date1)
      const m2 = momentHijri(date2)
      return m1.iYear() === m2.iYear() && m1.iMonth() === m2.iMonth()
    }
  }
}

export function getWeekdayOfMonthStart(date: Date, calendar: CalendarKind): number {
  const firstDay = getMonthStart(date, calendar)
  // 0 = یکشنبه, 1 = دوشنبه, ..., 6 = شنبه
  return firstDay.getDay()
}

export default dayjs