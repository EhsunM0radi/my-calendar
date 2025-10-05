<script setup lang="ts">
import ThemeToggle from '@/components/ThemeToggle.vue'
import DateTriView from '@/components/DateTriView.vue'
import ReminderForm from '@/components/ReminderForm.vue'
import ReminderList from '@/components/ReminderList.vue'
import SettingsModal from '@/components/SettingsModal.vue'

const store = useStore()
store.initApp()
store.loadReminders()
store.setTheme(store.theme)

const showReminderList = ref(false)
const showSettings = ref(false)

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
  <main dir="rtl" class="min-h-screen flex flex-col items-center px-4 py-6 gap-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
    <!-- Header -->
    <header class="w-full max-w-7xl flex items-center justify-between backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 rounded-2xl px-6 py-4 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
      <div class="flex items-center gap-3">
        <img src="/logo.png" alt="Logo" class="w-10 h-10 rounded-lg shadow-md" />
        <h1 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">تقویم من</h1>
      </div>

      <div class="flex items-center gap-3">
        <!-- Reminders Count Badge -->
        <button
          @click="showReminderList = true"
          class="relative px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <span class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
            یادآورها
          </span>
          <span
            v-if="store.reminders.length > 0"
            class="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg"
          >
            {{ store.reminders.length }}
          </span>
        </button>

        <button
          @click="showSettings = true"
          class="p-2.5 rounded-xl bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
          </svg>
        </button>

        <ThemeToggle />
      </div>
    </header>

    <!-- Main Content - Responsive Grid -->
    <div class="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Calendar View -->
      <div class="flex justify-center items-start backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
        <DateTriView />
      </div>

      <!-- Reminder Form -->
      <div class="flex justify-center items-start backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-700/50">
        <ReminderForm />
      </div>
    </div>

    <!-- Reminder List Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showReminderList"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          @click.self="showReminderList = false"
        >
          <div dir="rtl" class="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
            <div class="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between z-10">
              <h2 class="text-xl font-bold">یادآورهای من</h2>
              <button
                @click="showReminderList = false"
                class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="p-6">
              <ReminderList />
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Settings Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showSettings"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          @click.self="showSettings = false"
        >
          <div dir="rtl" class="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
            <div class="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
              <h2 class="text-xl font-bold">تنظیمات</h2>
              <button
                @click="showSettings = false"
                class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="p-6">
              <SettingsModal />
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </main>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition: all 0.3s ease;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: translateY(20px);
}
</style>
