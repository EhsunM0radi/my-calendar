<script setup lang="ts">
import dayjs, { toAllCalendars, formatInCalendar, type CalendarKind } from '@/lib/dayjs'

const store = useStore()

const calendars = [
  { key: 'gregorian', label: 'میلادی' },
  { key: 'jalali', label: 'جلالی' },
  { key: 'islamic', label: 'قمری' },
] as const

const selectedDate = computed({
  get: () => store.selectedDateIso,
  set: (v: string) => store.setSelectedDate(v),
})

const selectedCalendar = computed({
  get: () => store.selectedCalendar,
  set: (v: CalendarKind) => store.setSelectedCalendar(v),
})

const equivalents = computed(() => toAllCalendars(selectedDate.value))
// Week days based on calendar type
const weekDays = computed(() => {
  if (selectedCalendar.value === 'gregorian') {
    return ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'] // Sunday to Saturday
  } else {
    return ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'] // Saturday to Friday for Persian/Islamic
  }
})

// Calendar month view
const currentMonth = ref(dayjs())
const selectedDay = ref(dayjs(selectedDate.value))

const monthDays = computed(() => {
  const start = currentMonth.value.startOf('month')
  const end = currentMonth.value.endOf('month')
  const days = []
  // For Persian/Islamic calendars, start week from Saturday (day 6)
  // For Gregorian, start from Sunday (day 0)
  const weekStartDay = selectedCalendar.value === 'gregorian' ? 0 : 6
    
  // Add previous month's trailing days
  const startDay = start.day()
  const daysToAdd = (startDay - weekStartDay + 7) % 7
  for (let i = daysToAdd - 1; i >= 0; i--) {
    days.push(start.subtract(i + 1, 'day'))
  }
  
  // Add current month's days
  let day = start
  while (day.isSame(end, 'month') || day.isBefore(end)) {
    days.push(day)
    day = day.add(1, 'day')
  }
  
  // Add next month's leading days to fill 6 weeks
  while (days.length < 42) {
    days.push(day)
    day = day.add(1, 'day')
  }
  
  return days
})

function onToday() {
  selectedDate.value = new Date().toISOString()
  selectedDay.value = dayjs()
  currentMonth.value = dayjs()
}

function selectDay(day: dayjs.Dayjs) {
  selectedDay.value = day
  selectedDate.value = day.toISOString()
}

function prevMonth() {
  currentMonth.value = currentMonth.value.subtract(1, 'month')
}

function nextMonth() {
  currentMonth.value = currentMonth.value.add(1, 'month')
}

function formatDay(day: dayjs.Dayjs, calendar: CalendarKind) {
  return formatInCalendar(day.toISOString(), calendar, 'D')
}

function isToday(day: dayjs.Dayjs) {
  return day.isSame(dayjs(), 'day')
}

function isSelected(day: dayjs.Dayjs) {
  return day.isSame(selectedDay.value, 'day')
}

function isCurrentMonth(day: dayjs.Dayjs) {
  return day.isSame(currentMonth.value, 'month')
}
</script>

<template>
  <div class="flex flex-col gap-4 w-full max-w-4xl">
    <!-- Calendar Selector -->
    <div class="flex items-center justify-between gap-2">
      <div class="flex items-center gap-2">
        <label class="text-sm">تقویم نمایش:</label>
        <select v-model="selectedCalendar" class="border rounded px-2 py-1 bg-transparent">
          <option v-for="c in calendars" :key="c.key" :value="c.key">{{ c.label }}</option>
        </select>
      </div>
      <button class="text-sm underline" @click="onToday">امروز</button>
    </div>

    <!-- Calendar Month View -->
    <div class="border rounded-lg p-4">
      <!-- Month Header -->
      <div class="flex items-center justify-between mb-4">
        <button @click="prevMonth" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">‹</button>
        <h3 class="text-lg font-semibold">
          {{ formatInCalendar(currentMonth.toISOString(), selectedCalendar, 'MMMM YYYY') }}
        </h3>
        <button @click="nextMonth" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">›</button>
      </div>

      <!-- Week Days Header -->
      <div class="grid grid-cols-7 gap-1 mb-2">
        <div v-for="day in weekDays" :key="day"  
             class="text-center text-sm font-medium text-gray-500 py-2">
          {{ day }}
        </div>
      </div>

      <!-- Calendar Days -->
      <div class="grid grid-cols-7 gap-1">
        <button
          v-for="(day, index) in monthDays"
          :key="index"
          @click="selectDay(day)"
          :class="[
            'p-2 text-sm rounded transition-colors',
            isSelected(day) ? 'bg-blue-500 text-white' : '',
            isToday(day) && !isSelected(day) ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : '',
            !isCurrentMonth(day) ? 'text-gray-400' : '',
            'hover:bg-gray-100 dark:hover:bg-gray-700'
          ]"
        >
          {{ formatDay(day, selectedCalendar) }}
        </button>
      </div>
    </div>

    <!-- Date Equivalents -->
    <div class="rounded border p-3 text-sm grid grid-cols-1 gap-1">
      <div class="flex justify-between"><span>میلادی</span><span dir="ltr">{{ equivalents.gregorian }}</span></div>
      <div class="flex justify-between"><span>جلالی</span><span dir="ltr">{{ equivalents.jalali }}</span></div>
      <div class="flex justify-between"><span>قمری</span><span dir="ltr">{{ equivalents.islamic }}</span></div>
    </div>
  </div>
</template>

