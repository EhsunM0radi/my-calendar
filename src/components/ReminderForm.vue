<script setup lang="ts">
import dayjs from '@/lib/dayjs'

const store = useStore()
const title = ref('')
const time = ref('')

const selectedDate = computed(() => store.selectedDateIso)

async function createReminder() {
  if (!title.value || !time.value) return
  
  // Combine selected date with time
  const selectedDay = dayjs(selectedDate.value)
  const [hours, minutes] = time.value.split(':')
  const whenLocal = selectedDay.hour(parseInt(hours)).minute(parseInt(minutes)).second(0).toDate()
  
  // Check if the time is in the future
  if (whenLocal <= new Date()) {
    store.showToast('زمان یادآور باید در آینده باشد', 'error')
    return
  }
  
  const id = store.upsertReminder({ title: title.value, datetimeIso: whenLocal.toISOString() })
  
  // Schedule OS notification
  try {
    const { schedule } = await import('@tauri-apps/plugin-notification')
    console.log('Scheduling notification for:', whenLocal)
    await schedule({
      identifier: id,
      title: 'یادآور',
      body: title.value,
      schedule: { at: whenLocal },
    })
    console.log('Notification scheduled successfully')
    store.showToast('یادآور با موفقیت ایجاد شد!')
  } catch (e) {
    console.error('Failed to schedule notification:', e)
    console.error('Error details:', JSON.stringify(e, null, 2))
    store.showToast('یادآور ایجاد شد اما اعلان زمان‌بندی نشد', 'error')
  }
  
  title.value = ''
  time.value = ''
}
</script>

<template>
  <div class="w-full max-w-xl border rounded p-3 flex flex-col gap-2">
    <div class="text-sm font-medium">ایجاد یادآور</div>
    <div class="text-xs text-gray-500 mb-2">
      تاریخ انتخاب شده: {{ dayjs(selectedDate).format('YYYY/MM/DD') }}
    </div>
    <input v-model="title" class="border rounded px-2 py-1 bg-transparent" placeholder="عنوان یادآور" />
    <input v-model="time" type="time" class="border rounded px-2 py-1 bg-transparent" placeholder="زمان" />
    <button class="px-3 py-2 rounded bg-black text-white dark:bg-white dark:text-black" @click="createReminder">ذخیره</button>
    <div class="text-xs opacity-70">اعلان سیستم در زمان مشخص‌شده ارسال می‌شود.</div>
  </div>
</template>

