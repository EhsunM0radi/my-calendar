<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import momentJalaali from 'moment-jalaali'
import momentHijri from 'moment-hijri'
import { isHoliday, isHolidayWithIslamic } from '@/data/occasions'

// تنظیم لوکال فارسی
momentJalaali.loadPersian({ usePersianDigits: false })

const store = useStore()

// Set default calendar to 'jalali' if not already set
if (!store.selectedCalendar) {
  store.setSelectedCalendar('jalali')
}

const calendars = [
  { key: 'gregorian', label: 'میلادی' },
  { key: 'jalali', label: 'جلالی (شمسی)' },
  { key: 'islamic', label: 'قمری' },
] as const

type CalendarKind = 'gregorian' | 'jalali' | 'islamic'

// نام روزهای هفته - از دوشنبه تا یکشنبه برای میلادی، از شنبه تا جمعه برای فارسی
const weekDays = {
  gregorian: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  jalali: ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'],
  islamic: ['السبت', 'الاحد', 'الاثنين', 'الثلاثاء', 'الاربعاء', 'الخميس', 'الجمعة'] // شنبه تا جمعه
}

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

const selectedDate = computed({
  get: () => store.selectedDateIso,
  set: (v: string) => store.setSelectedDate(v),
})

const selectedCalendar = computed({
  get: () => store.selectedCalendar as CalendarKind,
  set: (v: CalendarKind) => store.setSelectedCalendar(v),
})

const currentMonth = ref(new Date())

// وقتی تقویم عوض میشه، ماه جاری رو به‌روز کن
watch(selectedCalendar, () => {
  currentMonth.value = new Date(selectedDate.value)
}, { immediate: true })

// وقتی selectedDate عوض میشه، currentMonth رو هم به‌روز کن
watch(() => selectedDate.value, (newDate) => {
  currentMonth.value = new Date(newDate)
})

// نمایش نام ماه و سال
const monthYearDisplay = computed(() => {
  if (selectedCalendar.value === 'gregorian') {
    return `${gregorianMonthNames[currentMonth.value.getMonth()]} ${currentMonth.value.getFullYear()}`
  } else if (selectedCalendar.value === 'jalali') {
    const jDate = momentJalaali(currentMonth.value)
    return `${jalaliMonthNames[jDate.jMonth()]} ${convertToPersianDigits(jDate.jYear())}`
  } else {
    const iDate = momentHijri(currentMonth.value)
    return `${hijriMonthNames[iDate.iMonth()]} ${convertToPersianDigits(iDate.iYear())}`
  }
})

// محاسبه روزهای ماه
const monthDays = computed(() => {
  const days: Array<{ date: Date; isCurrentMonth: boolean; displayDay: number | string; isHoliday: boolean }> = []

  if (selectedCalendar.value === 'gregorian') {
    // تقویم میلادی
    const firstDay = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth(), 1)
    const lastDay = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() + 1, 0)

    // روز اول ماه چه روزی از هفته است (0=یکشنبه تا 6=شنبه)
    // ما میخوایم از دوشنبه شروع کنیم، پس باید تبدیل کنیم
    let startDay = firstDay.getDay() - 1 // دوشنبه = 0
    if (startDay < 0) startDay = 6 // اگر یکشنبه بود، میشه 6

    // روزهای ماه قبل
    for (let i = startDay - 1; i >= 0; i--) {
      const prevDay = new Date(firstDay)
      prevDay.setDate(prevDay.getDate() - (i + 1))
      days.push({
        date: prevDay,
        isCurrentMonth: false,
        displayDay: prevDay.getDate(),
        isHoliday: isHoliday('gregorian', prevDay.getMonth() + 1, prevDay.getDate(), prevDay.getDay())
      })
    }

    // روزهای ماه جاری
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const day = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth(), i)
      days.push({
        date: day,
        isCurrentMonth: true,
        displayDay: i,
        isHoliday: isHoliday('gregorian', day.getMonth() + 1, i, day.getDay())
      })
    }

    // روزهای ماه بعد
    const totalDays = days.length
    const remainingDays = (7 - (totalDays % 7)) % 7 // Days to complete the last week
    for (let i = 1; i <= remainingDays; i++) {
      const nextDay = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() + 1, i)
      days.push({
        date: nextDay,
        isCurrentMonth: false,
        displayDay: i,
        isHoliday: isHoliday('gregorian', nextDay.getMonth() + 1, i, nextDay.getDay())
      })
    }

  } else if (selectedCalendar.value === 'jalali') {
    // تقویم جلالی
    const jCurrent = momentJalaali(currentMonth.value)
    const jYear = jCurrent.jYear()
    const jMonth = jCurrent.jMonth()

    // اولین روز ماه جلالی
    const firstDay = momentJalaali(currentMonth.value).jDate(1)

    // دریافت تعداد روزهای ماه
    let daysInMonth: number
    if (jMonth < 6) {
      daysInMonth = 31 // 6 ماه اول
    } else if (jMonth < 11) {
      daysInMonth = 30 // 5 ماه بعدی
    } else {
      // اسفند - چک کردن کبیسه بودن
      const isLeap = momentJalaali.jIsLeapYear(jYear)
      daysInMonth = isLeap ? 30 : 29
    }

    // روز اول ماه چه روزی از هفته است
    // 0=یکشنبه تا 6=شنبه در JS، ما میخوایم شنبه=0
    let startDay = (firstDay.day() + 1) % 7 // شنبه = 0

    // روزهای ماه قبل
    for (let i = startDay - 1; i >= 0; i--) {
      const prevDay = firstDay.clone().subtract(i + 1, 'days')
      const prevJDate = momentJalaali(prevDay.toDate())
      const prevIDate = momentHijri(prevDay.toDate())
      days.push({
        date: prevDay.toDate(),
        isCurrentMonth: false,
        displayDay: convertToPersianDigits(prevDay.jDate()),
        isHoliday: isHolidayWithIslamic(prevJDate.jMonth() + 1, prevJDate.jDate(), prevIDate.iMonth() + 1, prevIDate.iDate(), prevDay.day())
      })
    }

    // روزهای ماه جاری
    for (let i = 1; i <= daysInMonth; i++) {
      const day = momentJalaali(currentMonth.value).jYear(jYear).jMonth(jMonth).jDate(i)
      const iDate = momentHijri(day.toDate())
      days.push({
        date: day.toDate(),
        isCurrentMonth: true,
        displayDay: convertToPersianDigits(i),
        isHoliday: isHolidayWithIslamic(jMonth + 1, i, iDate.iMonth() + 1, iDate.iDate(), day.day())
      })
    }

    // روزهای ماه بعد
    const totalDaysJalali = days.length
    const remainingDaysJalali = (7 - (totalDaysJalali % 7)) % 7
    for (let i = 1; i <= remainingDaysJalali; i++) {
      const nextDay = firstDay.clone().add(daysInMonth + i - 1, 'days')
      const nextJDate = momentJalaali(nextDay.toDate())
      const nextIDate = momentHijri(nextDay.toDate())
      days.push({
        date: nextDay.toDate(),
        isCurrentMonth: false,
        displayDay: convertToPersianDigits(nextDay.jDate()),
        isHoliday: isHolidayWithIslamic(nextJDate.jMonth() + 1, nextJDate.jDate(), nextIDate.iMonth() + 1, nextIDate.iDate(), nextDay.day())
      })
    }

  } else if (selectedCalendar.value === 'islamic') {
    // تقویم قمری
    const iCurrent = momentHijri(currentMonth.value)
    const iYear = iCurrent.iYear()
    const iMonth = iCurrent.iMonth()

    // اولین روز ماه هجری
    const firstDay = momentHijri()
    firstDay.iYear(iYear)
    firstDay.iMonth(iMonth)
    firstDay.iDate(1)

    const daysInMonth = firstDay.iDaysInMonth()

    // روز اول ماه چه روزی از هفته است
    // 0=یکشنبه تا 6=شنبه، ما میخوایم شنبه=0
    let startDay = (firstDay.day() + 1) % 7

    // روزهای ماه قبل
    for (let i = startDay - 1; i >= 0; i--) {
      const prevDay = firstDay.clone().subtract(i + 1, 'days')
      const prevIDate = momentHijri(prevDay.toDate())
      days.push({
        date: prevDay.toDate(),
        isCurrentMonth: false,
        displayDay: convertToPersianDigits(prevDay.iDate()),
        isHoliday: isHoliday('islamic', prevIDate.iMonth() + 1, prevIDate.iDate(), prevDay.day())
      })
    }

    // روزهای ماه جاری
    for (let i = 1; i <= daysInMonth; i++) {
      const day = momentHijri()
      day.iYear(iYear)
      day.iMonth(iMonth)
      day.iDate(i)
      days.push({
        date: day.toDate(),
        isCurrentMonth: true,
        displayDay: convertToPersianDigits(i),
        isHoliday: isHoliday('islamic', iMonth + 1, i, day.day())
      })
    }

    // روزهای ماه بعد
    const totalDaysIslamic = days.length
    const remainingDaysIslamic = (7 - (totalDaysIslamic % 7)) % 7
    for (let i = 1; i <= remainingDaysIslamic; i++) {
      const nextDay = firstDay.clone().add(daysInMonth + i - 1, 'days')
      const nextIDate = momentHijri(nextDay.toDate())
      days.push({
        date: nextDay.toDate(),
        isCurrentMonth: false,
        displayDay: convertToPersianDigits(nextDay.iDate()),
        isHoliday: isHoliday('islamic', nextIDate.iMonth() + 1, nextIDate.iDate(), nextDay.day())
      })
    }
  }

  return days
})

// تابع برای تغییر ماه
function changeMonth(direction: number) {
  if (selectedCalendar.value === 'gregorian') {
    const newDate = new Date(currentMonth.value)
    newDate.setMonth(newDate.getMonth() + direction)
    currentMonth.value = newDate

  } else if (selectedCalendar.value === 'jalali') {
    const jDate = momentJalaali(currentMonth.value)
    jDate.add(direction, 'jMonth')
    currentMonth.value = jDate.toDate()

  } else if (selectedCalendar.value === 'islamic') {
    const iDate = momentHijri(currentMonth.value)
    iDate.add(direction, 'iMonth')
    currentMonth.value = iDate.toDate()
  }
}

function onToday() {
  const now = new Date()
  selectedDate.value = now.toISOString()
  currentMonth.value = now
}

function selectDay(date: Date) {
  selectedDate.value = date.toISOString()
}

function isToday(date: Date) {
  const today = new Date()
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear()
}

function isSelected(date: Date) {
  const selected = new Date(selectedDate.value)
  return date.getDate() === selected.getDate() &&
         date.getMonth() === selected.getMonth() &&
         date.getFullYear() === selected.getFullYear()
}

const isRTL = computed(() => selectedCalendar.value !== 'gregorian')

function convertToPersianDigits(num: number) {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
  return num.toString().split('').map(digit => persianDigits[parseInt(digit)] || digit).join('')
}
</script>

<template>
  <div
    class="flex flex-col gap-6 w-full"
  >
    <!-- انتخاب نوع تقویم -->
    <div class="flex items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <label class="text-sm font-medium text-gray-700 dark:text-gray-300">نوع تقویم:</label>
        <div class="inline-flex rounded-xl shadow-sm border border-gray-300 dark:border-gray-500 overflow-hidden">
          <button
            v-for="(c, index) in calendars"
            :key="c.key"
            @click="selectedCalendar = c.key"
            :class="[
              'px-4 py-2 text-sm font-medium transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-700',
              c.key === selectedCalendar
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold shadow-md'
                : 'bg-white text-gray-900 hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600',
              // Conditional border for separators
              isRTL
                ? (index !== calendars.length - 1 ? 'border-r border-gray-300 dark:border-gray-500' : '')
                : (index !== 0 ? 'border-l border-gray-300 dark:border-gray-500' : ''),
              // No individual rounding on buttons, parent div handles it
              'rounded-none'
            ]"
          >
            {{ c.label }}
          </button>
        </div>
      </div>
      <button
        class="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
        @click="onToday"
      >
        امروز
      </button>
    </div>

    <!-- نمایش تقویم -->
    <div class="w-full border border-gray-300 rounded-xl p-4 dark:border-gray-700 dark:bg-gray-800" :dir="isRTL ? 'rtl' : 'ltr'">
      <!-- هدر ماه -->
      <div class="flex items-center justify-between mb-4">
        <button
          @click="changeMonth(-1)"
          class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          <
        </button>
        <h3 class="text-lg font-semibold">
          {{ monthYearDisplay }}
        </h3>
        <button
          @click="changeMonth(1)"
          class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          >
        </button>
      </div>

      <!-- نام روزهای هفته -->
      <div class="grid grid-cols-7 gap-1 mb-2">
        <div
          v-for="(day, i) in weekDays[selectedCalendar]"
          :key="i"
          class="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2"
        >
          {{ day }}
        </div>
      </div>

      <!-- روزهای ماه -->
      <div class="grid grid-cols-7 gap-1">
        <button
          v-for="(dayObj, index) in monthDays"
          :key="index"
          @click="selectDay(dayObj.date)"
          :class="[
            'p-2 text-sm rounded-lg transition-colors',
            isSelected(dayObj.date) ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold shadow-md' : '',
            isToday(dayObj.date) && !isSelected(dayObj.date) ? 'bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 text-blue-700 dark:text-blue-300 font-medium' : '',
            !dayObj.isCurrentMonth ? 'text-gray-400' : '',
            dayObj.isCurrentMonth && !isSelected(dayObj.date) && !isToday(dayObj.date) ? 'hover:bg-gray-100 dark:hover:bg-gray-700' : '',
            dayObj.isHoliday && !isSelected(dayObj.date) ? 'text-red-600 dark:text-red-400 font-bold' : ''
          ]"
        >
          {{ dayObj.displayDay }}
        </button>
      </div>
    </div>
  </div>
</template>
