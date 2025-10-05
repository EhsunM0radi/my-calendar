<script setup lang="ts">
const store = useStore()

const formatDateTime = (isoString: string) => {
  return new Date(isoString).toLocaleString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const isPast = (isoString: string) => {
  return new Date(isoString) < new Date()
}

const isDelivered = (reminder: any) => {
  return reminder.delivered || isPast(reminder.datetimeIso)
}

const upcomingReminders = computed(() =>
  store.reminders.filter(r => !isPast(r.datetimeIso) && !r.delivered)
)

const pastReminders = computed(() =>
  store.reminders.filter(r => isPast(r.datetimeIso) || r.delivered)
)
</script>

<template>
  <div class="w-full flex flex-col gap-6">
    <div v-if="store.reminders.length === 0" class="text-center py-12">
      <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      </div>
      <p class="text-lg font-medium text-gray-500 dark:text-gray-300">هیچ یادآوری وجود ندارد</p>
      <p class="text-sm text-gray-400 dark:text-gray-400 mt-2">یادآور جدیدی ایجاد کنید</p>
    </div>

    <div v-else class="space-y-6">
      <!-- Upcoming Reminders -->
      <div v-if="upcomingReminders.length > 0">
        <h3 class="text-lg font-bold mb-3 flex items-center gap-2">
          <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          یادآورهای آینده
          <span class="text-sm font-normal text-gray-500 dark:text-gray-300">({{ upcomingReminders.length }})</span>
        </h3>
        <div class="space-y-3">
          <div
            v-for="reminder in upcomingReminders"
            :key="reminder.id"
            class="group relative overflow-hidden flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl hover:shadow-lg transition-all duration-300"
          >
            <div class="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
              </svg>
            </div>

            <div class="flex-1 min-w-0">
              <div class="font-bold text-lg text-gray-900 dark:text-white">{{ reminder.title }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                </svg>
                {{ formatDateTime(reminder.datetimeIso) }}
              </div>
            </div>

            <button
              @click="store.deleteReminder(reminder.id)"
              class="flex-shrink-0 p-2 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors opacity-0 group-hover:opacity-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Past/Delivered Reminders -->
      <div v-if="pastReminders.length > 0">
        <h3 class="text-lg font-bold mb-3 flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <span class="w-2 h-2 bg-gray-400 rounded-full"></span>
          یادآورهای گذشته
          <span class="text-sm font-normal dark:text-gray-300">({{ pastReminders.length }})</span>
        </h3>
        <div class="space-y-3">
          <div
            v-for="reminder in pastReminders"
            :key="reminder.id"
            class="group relative overflow-hidden flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl opacity-60 hover:opacity-80 transition-all duration-300"
          >
            <div class="flex-shrink-0 w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
              <svg v-if="reminder.delivered" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
              </svg>
            </div>

            <div class="flex-1 min-w-0">
              <div class="font-medium text-gray-700 dark:text-gray-300 line-through">{{ reminder.title }}</div>
              <div class="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                </svg>
                {{ formatDateTime(reminder.datetimeIso) }}
              </div>
              <div v-if="reminder.delivered" class="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                ارسال شده
              </div>
            </div>

            <button
              @click="store.deleteReminder(reminder.id)"
              class="flex-shrink-0 p-2 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors opacity-0 group-hover:opacity-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
