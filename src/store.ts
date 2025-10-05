import { acceptHMRUpdate, defineStore } from 'pinia'
import { invoke } from '@tauri-apps/api/core'
import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/plugin-notification'

const versionString =
  import.meta.env.MODE === 'development' ? `${import.meta.env.VITE_APP_VERSION}-dev` : import.meta.env.VITE_APP_VERSION

export const useStore = defineStore('main', {
  state: () => ({
    debug: import.meta.env.MODE === 'development',
    version: versionString,
    isInitialized: false,
    name: '',
    theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'light',
    selectedDateIso: new Date().toISOString(),
    selectedCalendar: (localStorage.getItem('selectedCalendar') as 'gregorian' | 'jalali' | 'islamic') || 'jalali',
    reminders: [] as Array<{ id: string; title: string; datetimeIso: string; delivered: boolean }>,
  }),

  actions: {
    initApp() {
      this.isInitialized = true
      console.log('app initialized!')
    },
    setTheme(next: 'light' | 'dark') {
      this.theme = next
      localStorage.setItem('theme', next)
      const root = document.documentElement
      if (next === 'dark') {
        root.classList.add('dark')
        root.style.colorScheme = 'dark'
      } else {
        root.classList.remove('dark')
        root.style.colorScheme = 'light'
      }
    },
    setSelectedDate(iso: string) {
      this.selectedDateIso = iso
    },
    setSelectedCalendar(kind: 'gregorian' | 'jalali' | 'islamic') {
      this.selectedCalendar = kind
      localStorage.setItem('selectedCalendar', kind)
    },
    upsertReminder(rem: { id?: string; title: string; datetimeIso: string }) {
      const id = rem.id ?? crypto.randomUUID()
      const idx = this.reminders.findIndex((r) => r.id === id)
      const next = { id, title: rem.title, datetimeIso: rem.datetimeIso, delivered: false }
      if (idx >= 0) this.reminders[idx] = next
      else this.reminders.push(next)
      localStorage.setItem('reminders', JSON.stringify(this.reminders))

      // Start background timer for this reminder
      this.startReminderTimer(next)

      return id
    },
    showToast(message: string, type: 'success' | 'error' = 'success') {
      // Enhanced toast implementation
      const toast = document.createElement('div')
      toast.className = `fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-4 rounded-2xl text-white z-[9999] shadow-2xl backdrop-blur-sm transition-all duration-300 ${
        type === 'success'
          ? 'bg-gradient-to-r from-green-500 to-emerald-500'
          : 'bg-gradient-to-r from-red-500 to-rose-500'
      }`

      const icon = type === 'success' ? '✓' : '✕'
      toast.innerHTML = `
        <div class="flex items-center gap-3">
          <span class="text-2xl">${icon}</span>
          <span class="font-medium">${message}</span>
        </div>
      `

      document.body.appendChild(toast)

      // Animate in
      setTimeout(() => {
        toast.style.transform = 'translate(-50%, 0)'
      }, 10)

      // Animate out and remove
      setTimeout(() => {
        toast.style.opacity = '0'
        toast.style.transform = 'translate(-50%, -20px)'
        setTimeout(() => {
          document.body.removeChild(toast)
        }, 300)
      }, 3000)
    },
    loadReminders() {
      const raw = localStorage.getItem('reminders')
      if (raw) {
        try {
          this.reminders = JSON.parse(raw)
          // Start timers for all undelivered reminders
          this.reminders.forEach(reminder => {
            if (!reminder.delivered) {
              this.startReminderTimer(reminder)
            }
          })
        } catch {}
      }
    },
    deleteReminder(id: string) {
      this.reminders = this.reminders.filter(r => r.id !== id)
      localStorage.setItem('reminders', JSON.stringify(this.reminders))
    },
    async startReminderTimer(reminder: { id: string; title: string; datetimeIso: string; delivered: boolean }) {
      const reminderTime = new Date(reminder.datetimeIso).getTime()
      const now = Date.now()
      const delay = reminderTime - now

      if (delay > 0) {
        setTimeout(async () => {
          try {
            // در Development از Browser Notification استفاده کن (آیکون درست رو نشون میده)
            const isDev = import.meta.env.MODE === 'development'

            if (isDev || !window.__TAURI__) {
              // Browser Notification
              if ('Notification' in window) {
                if (Notification.permission === 'granted') {
                  new Notification('🔔 یادآور - تقویم من', {
                    body: reminder.title,
                    icon: '/logo.png',
                    badge: '/logo.png',
                    tag: reminder.id,
                    requireInteraction: true,
                    silent: false
                  })
                } else if (Notification.permission !== 'denied') {
                  const permission = await Notification.requestPermission()
                  if (permission === 'granted') {
                    new Notification('🔔 یادآور - تقویم من', {
                      body: reminder.title,
                      icon: '/logo.png',
                      badge: '/logo.png',
                      tag: reminder.id,
                      requireInteraction: true,
                      silent: false
                    })
                  }
                }
              }
            } else {
              // Tauri Notification (فقط در Production)
              let permissionGranted = await isPermissionGranted()

              if (!permissionGranted) {
                const permission = await requestPermission()
                permissionGranted = permission === 'granted'
              }

              if (permissionGranted) {
                await sendNotification({
                  title: '🔔 یادآور - تقویم من',
                  body: reminder.title,
                  icon: 'icons/icon.png'
                })
              }
            }

            // Mark as delivered
            const idx = this.reminders.findIndex(r => r.id === reminder.id)
            if (idx >= 0) {
              this.reminders[idx].delivered = true
              localStorage.setItem('reminders', JSON.stringify(this.reminders))
            }
          } catch (error) {
            console.error('Failed to send notification:', error)
          }
        }, delay)
      }
    },
  },

  getters: {
    isReady: (state) => {
      return !state.isInitialized
    },

    storeGreet: (state) => {
      if (state.name.length > 0) {
        return `Greetings from Pinia store, ${state.name}!`
      }
      return ''
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStore, import.meta.hot))
}
