<script setup lang="ts">
import ThemeToggle from '@/components/ThemeToggle.vue'
import DateTriView from '@/components/DateTriView.vue'
import ReminderForm from '@/components/ReminderForm.vue'
import ReminderList from '@/components/ReminderList.vue'

const store = useStore()
store.initApp()
store.loadReminders()
store.setTheme(store.theme)

// Request notification permission
import { isPermissionGranted, requestPermission } from '@tauri-apps/plugin-notification'

async function requestNotificationPermission() {
  try {
    const permissionGranted = await isPermissionGranted()
    if (!permissionGranted) {
      await requestPermission()
    }
  } catch (error) {
    console.error('Failed to request notification permission:', error)
    // Fallback to browser notification
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }
}

requestNotificationPermission()
</script>

<template>
  <main class="min-h-screen flex flex-col items-center px-4 py-6 gap-6 bg-white text-black dark:bg-neutral-900 dark:text-neutral-100">
    <header class="w-full max-w-3xl flex items-center justify-between">
      <h1 class="text-lg font-semibold">تقویم من</h1>
      <ThemeToggle />
    </header>

    <DateTriView />
    <ReminderForm />
    <ReminderList />
  </main>
</template>
