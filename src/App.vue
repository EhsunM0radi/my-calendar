<script setup lang="ts">
import ThemeToggle from '@/components/ThemeToggle.vue'
import DateTriView from '@/components/DateTriView.vue'
import ReminderForm from '@/components/ReminderForm.vue'
const store = useStore()
store.initApp()
store.loadReminders()
store.setTheme(store.theme)
</script>

<template>
  <main class="min-h-screen flex flex-col items-center px-4 py-6 gap-6 bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-100">
    <header class="w-full max-w-3xl flex items-center justify-between">
      <h1 class="text-lg font-semibold">تقویم من</h1>
      <ThemeToggle />
    </header>

    <DateTriView />
    <ReminderForm />
  </main>
</template>
