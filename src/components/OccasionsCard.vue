<template>
  <div class="w-full rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
    <!-- Header -->
    <div class="bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600 px-4 py-3">
      <h3 class="text-white font-bold text-lg flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clip-rule="evenodd" />
        </svg>
        مناسبت‌های امروز
      </h3>
    </div>

    <!-- Content -->
    <div class="p-4">
      <div v-if="allOccasions.length === 0" class="text-center py-6 text-gray-500 dark:text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p>امروز مناسبت خاصی ثبت نشده است</p>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="(group, index) in allOccasions"
          :key="index"
          class="border-r-4 pr-3 py-2"
          :class="getCalendarBorderColor(group.calendar)"
        >
          <div class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            تقویم {{ group.calendar }}
          </div>
          <div class="space-y-1">
            <div
              v-for="(occasion, idx) in group.occasions"
              :key="idx"
              class="flex items-start gap-2"
            >
              <span class="text-lg" :class="getOccasionIcon(occasion.type)">
                {{ getOccasionEmoji(occasion.type) }}
              </span>
              <div class="flex-1">
                <p class="font-medium text-gray-900 dark:text-gray-100">
                  {{ occasion.title }}
                </p>
                <div class="flex items-center gap-2 mt-0.5">
                  <span
                    class="text-xs px-2 py-0.5 rounded-full"
                    :class="getOccasionTypeClass(occasion.type)"
                  >
                    {{ getOccasionTypeLabel(occasion.type) }}
                  </span>
                  <span
                    v-if="occasion.isHoliday"
                    class="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 font-medium"
                  >
                    تعطیل رسمی
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import momentJalaali from 'moment-jalaali'
import momentHijri from 'moment-hijri'
import { getAllOccasionsForDate, type Occasion } from '@/data/occasions'

const store = useStore()

const selectedDate = computed(() => new Date(store.selectedDateIso))

// محاسبه تاریخ‌های جلالی و قمری
const jalaliDate = computed(() => {
  const jDate = momentJalaali(selectedDate.value)
  return {
    month: jDate.jMonth(),
    day: jDate.jDate()
  }
})

const islamicDate = computed(() => {
  const iDate = momentHijri(selectedDate.value)
  return {
    month: iDate.iMonth(),
    day: iDate.iDate()
  }
})

// دریافت تمام مناسبت‌ها
const allOccasions = computed(() => {
  return getAllOccasionsForDate(
    selectedDate.value,
    jalaliDate.value.month,
    jalaliDate.value.day,
    islamicDate.value.month,
    islamicDate.value.day
  )
})

function getCalendarBorderColor(calendar: string): string {
  switch (calendar) {
    case 'میلادی':
      return 'border-blue-500'
    case 'شمسی':
      return 'border-green-500'
    case 'قمری':
      return 'border-purple-500'
    default:
      return 'border-gray-500'
  }
}

function getOccasionEmoji(type: string): string {
  switch (type) {
    case 'national':
      return '🇮🇷'
    case 'religious':
      return '🕌'
    case 'international':
      return '🌍'
    case 'custom':
      return '⭐'
    default:
      return '📅'
  }
}

function getOccasionIcon(type: string): string {
  return 'flex-shrink-0'
}

function getOccasionTypeLabel(type: string): string {
  switch (type) {
    case 'national':
      return 'ملی'
    case 'religious':
      return 'مذهبی'
    case 'international':
      return 'بین‌المللی'
    case 'custom':
      return 'سفارشی'
    default:
      return 'سایر'
  }
}

function getOccasionTypeClass(type: string): string {
  switch (type) {
    case 'national':
      return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
    case 'religious':
      return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
    case 'international':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
    case 'custom':
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
  }
}
</script>
