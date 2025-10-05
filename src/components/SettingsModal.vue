<script setup lang="ts">
const store = useStore()

const themes = [
  { value: 'light', label: 'روشن', icon: '☀️' },
  { value: 'dark', label: 'تاریک', icon: '🌙' },
]

function selectTheme(theme: 'light' | 'dark') {
  store.setTheme(theme)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Theme Settings -->
    <div>
      <h3 class="text-lg font-semibold mb-4">تم پیش‌فرض</h3>
      <div class="grid grid-cols-2 gap-3">
        <button
          v-for="theme in themes"
          :key="theme.value"
          @click="selectTheme(theme.value as 'light' | 'dark')"
          :class="[
            'flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all duration-300',
            store.theme === theme.value
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg scale-105'
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md'
          ]"
        >
          <span class="text-4xl">{{ theme.icon }}</span>
          <span class="font-medium">{{ theme.label }}</span>
          <div
            v-if="store.theme === theme.value"
            class="w-2 h-2 bg-blue-500 rounded-full"
          ></div>
        </button>
      </div>
    </div>

    <!-- App Info -->
    <div class="pt-6 border-t border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>نسخه برنامه</span>
        <span class="font-mono">{{ store.version }}</span>
      </div>
    </div>
  </div>
</template>
