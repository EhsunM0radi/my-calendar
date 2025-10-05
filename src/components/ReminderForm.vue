<script setup lang="ts">
const store = useStore()
const title = ref('')
const time = ref('')
const titleError = ref('')
const timeError = ref('')

async function createReminder() {
  titleError.value = ''
  timeError.value = ''

  if (!title.value) {
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
    title: title.value,
    datetimeIso: selectedDate.toISOString()
  })

  store.showToast(`یادآور برای ${selectedDate.toLocaleString('fa-IR')} تنظیم شد!`)

  title.value = ''
  time.value = ''
}
</script>

<template>
  <div class="w-full border border-gray-300 rounded-xl p-3 flex flex-col gap-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300">
    <div class="text-sm font-medium dark:text-gray-200">ایجاد یادآور</div>
    <textarea v-model="title" rows="3" class="border border-gray-300 rounded-lg px-2 py-1 bg-transparent dark:border-gray-600 dark:text-gray-200 resize-y" :class="{'border-red-500': titleError}" placeholder="عنوان"></textarea>
    <div v-if="titleError" class="text-red-500 text-xs">{{ titleError }}</div>
    <div class="flex gap-2">
      <input v-model="time" type="time" class="border border-gray-300 rounded-lg px-2 py-1 bg-transparent flex-1 dark:border-gray-600 dark:text-gray-200 p-2" :class="{'border-red-500': timeError}" placeholder="زمان" />
    </div>
    <div v-if="timeError" class="text-red-500 text-xs">{{ timeError }}</div>
    <button class="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 transition-colors duration-200 dark:bg-blue-700 dark:hover:bg-blue-600 dark:active:bg-blue-800" @click="createReminder">ذخیره</button>
    <div class="text-xs opacity-70 dark:text-gray-400">یادآور در زمان مشخص شده ارسال می‌شود.</div>
  </div>
</template>

