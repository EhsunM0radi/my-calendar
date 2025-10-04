<script setup lang="ts">
const store = useStore()

const formatDateTime = (isoString: string) => {
  return new Date(isoString).toLocaleString('fa-IR')
}

const isPast = (isoString: string) => {
  return new Date(isoString) < new Date()
}

const isDelivered = (reminder: any) => {
  return reminder.delivered || isPast(reminder.datetimeIso)
}
</script>

<template>
  <div class="w-full max-w-xl border rounded p-3 flex flex-col gap-2">
    <div class="text-sm font-medium">یادآورهای من</div>
    
    <div v-if="store.reminders.length === 0" class="text-sm opacity-70 text-center py-4">
      هیچ یادآوری وجود ندارد
    </div>
    
    <div v-else class="space-y-2">
      <div 
        v-for="reminder in store.reminders" 
        :key="reminder.id"
        class="flex items-center justify-between p-2 border rounded"
        :class="{
          'opacity-50': isDelivered(reminder),
          'bg-green-50 dark:bg-green-900/20': reminder.delivered,
          'bg-yellow-50 dark:bg-yellow-900/20': isPast(reminder.datetimeIso) && !reminder.delivered
        }"
      >
        <div class="flex-1">
          <div class="font-medium">{{ reminder.title }}</div>
          <div class="text-xs opacity-70">{{ formatDateTime(reminder.datetimeIso) }}</div>
          <div v-if="reminder.delivered" class="text-xs text-green-600 dark:text-green-400">
            ✓ ارسال شده
          </div>
          <div v-else-if="isPast(reminder.datetimeIso)" class="text-xs text-yellow-600 dark:text-yellow-400">
            ⏰ زمان گذشته
          </div>
        </div>
        
        <button 
          @click="store.deleteReminder(reminder.id)"
          class="text-red-500 hover:text-red-700 text-sm px-2 py-1"
        >
          حذف
        </button>
      </div>
    </div>
  </div>
</template>
