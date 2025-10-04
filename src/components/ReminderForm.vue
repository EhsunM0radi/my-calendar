<script setup lang="ts">
const store = useStore()
const title = ref('')
const date = ref('')
const time = ref('')

async function createReminder() {
  if (!title.value || !date.value || !time.value) return
  const whenLocal = new Date(`${date.value}T${time.value}:00`)
  const id = store.upsertReminder({ title: title.value, datetimeIso: whenLocal.toISOString() })
  
  // Schedule OS notification
  try {
    const { schedule } = await import('@tauri-apps/plugin-notification')
    await schedule({
      identifier: id,
      title: 'یادآور',
      body: title.value,
      schedule: { at: whenLocal },
    })
    store.showToast('یادآور با موفقیت ایجاد شد!')
  } catch (e) {
    console.error('Failed to schedule notification', e)
    store.showToast('یادآور ایجاد شد اما اعلان زمان‌بندی نشد', 'error')
  }
  
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
    <div class="text-xs opacity-70">اعلان سیستم در زمان مشخص‌شده ارسال می‌شود.</div>
  </div>
</template>

