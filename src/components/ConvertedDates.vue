<template>
  <div class="w-full rounded-xl border border-gray-300 p-3 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
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
</template>
<script setup lang="ts">
import { computed } from 'vue'
import momentJalaali from 'moment-jalaali'
import momentHijri from 'moment-hijri'

// تنظیم لوکال فارسی
momentJalaali.loadPersian({ usePersianDigits: false })

const store = useStore()

const selectedDate = computed({
  get: () => store.selectedDateIso,
  set: (v: string) => store.setSelectedDate(v),
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
</script>
