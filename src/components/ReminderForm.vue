<script setup lang="ts">
const store = useStore()
const title = ref('')
const time = ref('')

async function createReminder() {
  console.log('Creating reminder', title.value, time.value)
  if (!title.value || !time.value) return
  
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
  <div class="w-full max-w-xl border rounded p-3 flex flex-col gap-2">
    <div class="text-sm font-medium">ایجاد یادآور</div>
    <input v-model="title" class="border rounded px-2 py-1 bg-transparent" placeholder="عنوان" />
    <div class="flex gap-2">
      <input v-model="time" type="time" class="border rounded px-2 py-1 bg-transparent flex-1" placeholder="زمان" />
    </div>
    <button class="px-3 py-2 rounded bg-black text-white dark:bg-white dark:text-black" @click="createReminder">ذخیره</button>
    <div class="text-xs opacity-70">یادآور در زمان مشخص شده ارسال می‌شود.</div>
  </div>
</template>

