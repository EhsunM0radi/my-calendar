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
    jalali: formatPersianDate(mJal.format('jYYYY-jMM-jDD')),
    islamic: formatPersianDate(mHij.format('iYYYY-iMM-iDD'))
  }
})

function formatPersianDate(dateString: string) {
  const parts = dateString.split('-')
  const year = convertToPersianDigits(parseInt(parts[0]))
  const month = convertToPersianDigits(parseInt(parts[1]))
  const day = convertToPersianDigits(parseInt(parts[2]))
  return `${year}/${month}/${day}`
}

function convertToPersianDigits(num: number) {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
  return num.toString().split('').map(digit => persianDigits[parseInt(digit)] || digit).join('')
}
</script>
