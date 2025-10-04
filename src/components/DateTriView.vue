<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import momentJalaali from 'moment-jalaali'
import momentHijri from 'moment-hijri'

// تنظیم لوکال فارسی
momentJalaali.loadPersian({ usePersianDigits: false })

const store = useStore()

const calendars = [
  { key: 'gregorian', label: 'میلادی' },
  { key: 'jalali', label: 'جلالی (شمسی)' },
  { key: 'islamic', label: 'قمری' },
] as const

type CalendarKind = 'gregorian' | 'jalali' | 'islamic'

// نام روزهای هفته - از دوشنبه تا یکشنبه برای میلادی، از شنبه تا جمعه برای فارسی
const weekDays = {
  gregorian: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  jalali: ['شنبه', 'یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'],
  islamic: ['السَبت', 'الأحد', 'الإثنَیْن', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'] // شنبه تا جمعه
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

// محاسبه تاریخ‌های معادل
const equivalents = computed(() => {
  const date = new Date(selectedDate.value)
  const mGreg = new Date(date)
  const mJal = momentJalaali(date)
  const mHij = momentHijri(date)
  
  return {
    gregorian: mGreg.toISOString().split('T')[0],
    jalali: mJal.format('jYYYY-jMM-jDD'),
    islamic: mHij.format('iYYYY-iMM-iDD')
  }
})

// نمایش نام ماه و سال
const monthYearDisplay = computed(() => {
  if (selectedCalendar.value === 'gregorian') {
    return `${gregorianMonthNames[currentMonth.value.getMonth()]} ${currentMonth.value.getFullYear()}`
  } else if (selectedCalendar.value === 'jalali') {
    const jDate = momentJalaali(currentMonth.value)
    return `${jalaliMonthNames[jDate.jMonth()]} ${jDate.jYear()}`
  } else {
    const iDate = momentHijri(currentMonth.value)
    return `${hijriMonthNames[iDate.iMonth()]} ${iDate.iYear()}`
  }
})

// محاسبه روزهای ماه
const monthDays = computed(() => {
  const days: Array<{ date: Date; isCurrentMonth: boolean; displayDay: number }> = []

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
        displayDay: prevDay.getDate()
      })
    }
    
    // روزهای ماه جاری
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const day = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth(), i)
      days.push({ 
        date: day, 
        isCurrentMonth: true,
        displayDay: i
      })
    }
    
    // روزهای ماه بعد
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      const nextDay = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() + 1, i)
      days.push({ 
        date: nextDay, 
        isCurrentMonth: false,
        displayDay: i
      })
    }
    
  } else if (selectedCalendar.value === 'jalali') {
    // تقویم جلالی
    const jCurrent = momentJalaali(currentMonth.value)
    const jYear = jCurrent.jYear()
    const jMonth = jCurrent.jMonth()
    
    // اولین روز ماه جلالی - روش دیگر
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
      days.push({ 
        date: prevDay.toDate(), 
        isCurrentMonth: false,
        displayDay: prevDay.jDate()
      })
    }
    
    // روزهای ماه جاری
    for (let i = 1; i <= daysInMonth; i++) {
      const day = momentJalaali(currentMonth.value).jYear(jYear).jMonth(jMonth).jDate(i)
      days.push({ 
        date: day.toDate(), 
        isCurrentMonth: true,
        displayDay: i
      })
    }
    
    // روزهای ماه بعد
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      const nextDay = firstDay.clone().add(daysInMonth + i - 1, 'days')
      days.push({ 
        date: nextDay.toDate(), 
        isCurrentMonth: false,
        displayDay: nextDay.jDate()
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
      days.push({ 
        date: prevDay.toDate(), 
        isCurrentMonth: false,
        displayDay: prevDay.iDate()
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
        displayDay: i
      })
    }
    
    // روزهای ماه بعد
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      const nextDay = firstDay.clone().add(daysInMonth + i - 1, 'days')
      days.push({ 
        date: nextDay.toDate(), 
        isCurrentMonth: false,
        displayDay: nextDay.iDate()
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
</script>

<template>
  <div 
    class="flex flex-col gap-4 w-full max-w-4xl" 
    :dir="isRTL ? 'rtl' : 'ltr'"
  >
    <!-- انتخاب نوع تقویم -->
    <div class="flex items-center justify-between gap-2">
      <div class="flex items-center gap-2">
        <label class="text-sm font-medium">نوع تقویم:</label>
        <select 
          v-model="selectedCalendar" 
          class="border rounded px-3 py-1 bg-transparent"
        >
          <option v-for="c in calendars" :key="c.key" :value="c.key">
            {{ c.label }}
          </option>
        </select>
      </div>
      <button 
        class="text-sm underline hover:text-blue-600"
        @click="onToday"
      >
        امروز
      </button>
    </div>

    <!-- نمایش تقویم -->
    <div class="border rounded-lg p-4">
      <!-- هدر ماه -->
      <div class="flex items-center justify-between mb-4">
        <button 
          @click="changeMonth(isRTL ? 1 : -1)"
          class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        >
          {{ isRTL ? '›' : '‹' }}
        </button>
        <h3 class="text-lg font-semibold">
          {{ monthYearDisplay }}
        </h3>
        <button 
          @click="changeMonth(isRTL ? -1 : 1)"
          class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        >
          {{ isRTL ? '‹' : '›' }}
        </button>
      </div>

      <!-- نام روزهای هفته -->
      <div class="grid grid-cols-7 gap-1 mb-2">
        <div 
          v-for="(day, i) in weekDays[selectedCalendar]" 
          :key="i" 
          class="text-center text-sm font-medium text-gray-500 py-2"
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
            'p-2 text-sm rounded transition-colors',
            isSelected(dayObj.date) ? 'bg-blue-500 text-white font-bold' : '',
            isToday(dayObj.date) && !isSelected(dayObj.date) ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium' : '',
            !dayObj.isCurrentMonth ? 'text-gray-400' : '',
            dayObj.isCurrentMonth && !isSelected(dayObj.date) && !isToday(dayObj.date) ? 'hover:bg-gray-100 dark:hover:bg-gray-700' : ''
          ]"
        >
          {{ dayObj.displayDay }}
        </button>
      </div>
    </div>

    <!-- نمایش تاریخ‌های معادل -->
    <div class="rounded border p-3 text-sm">
      <div class="grid grid-cols-1 gap-2">
        <div class="flex justify-between">
          <span class="font-medium">میلادی:</span>
          <span class="font-mono" dir="ltr">{{ equivalents.gregorian }}</span>
        </div>
        <div class="flex justify-between">
          <span class="font-medium">جلالی (شمسی):</span>
          <span class="font-mono" dir="ltr">{{ equivalents.jalali }}</span>
        </div>
        <div class="flex justify-between">
          <span class="font-medium">قمری:</span>
          <span class="font-mono" dir="ltr">{{ equivalents.islamic }}</span>
        </div>
      </div>
    </div>
  </div>
</template>