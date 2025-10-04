<script setup lang="ts">
const store = useStore()
const title = ref('')
const date = ref('')
const time = ref('')

async function createReminder() {
  console.log('Creating reminder', title.value, date.value, time.value)
  if (!title.value || !date.value || !time.value) return
  
  const whenLocal = new Date(`${date.value}T${time.value}:00`)
  const now = new Date()
  
  if (whenLocal <= now) {
    store.showToast('زمان یادآور باید در آینده باشد!', 'error')
    return
  }
  
  const id = store.upsertReminder({ 
    title: title.value, 
    datetimeIso: whenLocal.toISOString() 
  })
  
  store.showToast(`یادآور برای ${whenLocal.toLocaleString('fa-IR')} تنظیم شد!`)
  
  title.value = ''
  date.value = ''
  time.value = ''
}
</script>

<template>
  <div class="w-full max-w-xl border rounded p-3 flex flex-col gap-2">
    <div class="text-sm font-medium">ایجاد یادآور</div>
    <input v-model="title" class="border rounded px-2 py-1 bg-transparent" placeholder="عنوان" />
    <div class="grid grid-cols-2 gap-2">
      <input v-model="date" type="date" class="border rounded px-2 py-1 bg-transparent" />
      <input v-model="time" type="time" class="border rounded px-2 py-1 bg-transparent" />
    </div>
    <button class="px-3 py-2 rounded bg-black text-white dark:bg-white dark:text-black" @click="createReminder">ذخیره</button>
    <div class="text-xs opacity-70">یادآور در زمان مشخص شده ارسال می‌شود.</div>
  </div>
</template>

