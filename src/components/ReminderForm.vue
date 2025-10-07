<script setup lang="ts">
import { ref, computed } from 'vue'
import momentJalaali from 'moment-jalaali'
import momentHijri from 'moment-hijri'

const store = useStore()
const title = ref('')
const time = ref('')
const titleError = ref('')
const timeError = ref('')

// محاسبه تاریخ نمایشی بر اساس تقویم انتخابی
const displayDate = computed(() => {
  const date = new Date(store.selectedDateIso)

  if (store.selectedCalendar === 'gregorian') {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } else if (store.selectedCalendar === 'jalali') {
    const jDate = momentJalaali(date)
    const jalaliMonths = [
      'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
      'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
    ]
    return `${jDate.jDate()} ${jalaliMonths[jDate.jMonth()]} ${jDate.jYear()}`
  } else {
    const iDate = momentHijri(date)
    const hijriMonths = [
      'محرم', 'صفر', 'ربیع‌الاول', 'ربیع‌الثانی', 'جمادی‌الاول', 'جمادی‌الثانی',
      'رجب', 'شعبان', 'رمضان', 'شوال', 'ذی‌القعده', 'ذی‌الحجه'
    ]
    return `${iDate.iDate()} ${hijriMonths[iDate.iMonth()]} ${iDate.iYear()}`
  }
})

async function createReminder() {
  titleError.value = ''
  timeError.value = ''

  if (!title.value.trim()) {
    titleError.value = 'عنوان یادآور نمی‌تواند خالی باشد.'
    return
  }

  if (!time.value) {
    timeError.value = 'زمان یادآور نمی‌تواند خالی باشد.'
    return
  }

  // Use the selected date from the calendar
  const selectedDate = new Date(store.selectedDateIso)
  const [hours, minutes] = time.value.split(':')
  selectedDate.setHours(parseInt(hours || '0'), parseInt(minutes || '0'), 0, 0)

  const now = new Date()

  if (selectedDate <= now) {
    store.showToast('زمان یادآور باید در آینده باشد!', 'error')
    return
  }

  const id = store.upsertReminder({
    title: title.value.trim(),
    datetimeIso: selectedDate.toISOString()
  })

  store.showToast(`یادآور برای ${displayDate.value} ساعت ${time.value} تنظیم شد!`)

  title.value = ''
  time.value = ''
}

function setQuickTime(hour: number, minute: number) {
  time.value = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}
</script>

<template>
  <div class="w-full border border-gray-300 rounded-xl p-4 flex flex-col gap-3 dark:bg-gray-800 dark:border-gray-700">
    <!-- Header -->
    <div class="flex items-center gap-2 text-base font-bold text-gray-800 dark:text-gray-100">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
      </svg>
      ایجاد یادآور
    </div>

    <!-- Selected Date Display -->
    <div class="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-lg p-3 border border-blue-200 dark:border-gray-600">
      <div class="text-xs text-gray-600 dark:text-gray-400 mb-1">تاریخ انتخابی:</div>
      <div class="font-bold text-gray-800 dark:text-gray-100">{{ displayDate }}</div>
    </div>

    <!-- Title Input -->
    <div class="flex flex-col gap-1">
      <label class="text-sm font-medium text-gray-700 dark:text-gray-300">عنوان یادآور:</label>
      <textarea
        v-model="title"
        rows="3"
        class="border rounded-lg px-3 py-2 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-y text-gray-900 dark:text-gray-100"
        :class="titleError ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'"
        placeholder="مثال: جلسه کاری با تیم"
      ></textarea>
      <div v-if="titleError" class="text-red-500 dark:text-red-400 text-xs flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        {{ titleError }}
      </div>
    </div>

    <!-- Time Input -->
    <div class="flex flex-col gap-1">
      <label class="text-sm font-medium text-gray-700 dark:text-gray-300">زمان یادآور:</label>
      <input
        v-model="time"
        type="time"
        class="border rounded-lg px-3 py-2 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-gray-100"
        :class="timeError ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'"
      />
      <div v-if="timeError" class="text-red-500 dark:text-red-400 text-xs flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        {{ timeError }}
      </div>
    </div>

    <!-- Quick Time Buttons -->
    <div class="flex flex-col gap-2">
      <div class="text-xs font-medium text-gray-600 dark:text-gray-400">انتخاب سریع زمان:</div>
      <div class="grid grid-cols-4 gap-2">
        <button
          @click="setQuickTime(8, 0)"
          class="px-2 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          08:00
        </button>
        <button
          @click="setQuickTime(12, 0)"
          class="px-2 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          12:00
        </button>
        <button
          @click="setQuickTime(18, 0)"
          class="px-2 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          18:00
        </button>
        <button
          @click="setQuickTime(20, 0)"
          class="px-2 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          20:00
        </button>
      </div>
    </div>

    <!-- Submit Button with Gradient -->
    <button
      class="px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
      @click="createReminder"
    >
      <div class="flex items-center justify-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
        </svg>
        ذخیره یادآور
      </div>
    </button>

    <!-- Help Text -->
    <div class="text-xs text-gray-500 dark:text-gray-400 flex items-start gap-1">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
      </svg>
      <span>یادآور در زمان مشخص شده با نوتیفیکیشن سیستمی و درون‌برنامه‌ای ارسال می‌شود.</span>
    </div>
  </div>
</template>
