import { acceptHMRUpdate, defineStore } from 'pinia'

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
    selectedCalendar: 'gregorian' as 'gregorian' | 'jalali' | 'islamic',
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
    },
    upsertReminder(rem: { id?: string; title: string; datetimeIso: string }) {
      const id = rem.id ?? crypto.randomUUID()
      const idx = this.reminders.findIndex((r) => r.id === id)
      const next = { id, title: rem.title, datetimeIso: rem.datetimeIso, delivered: false }
      if (idx >= 0) this.reminders[idx] = next
      else this.reminders.push(next)
      localStorage.setItem('reminders', JSON.stringify(this.reminders))
      return id
    },
    showToast(message: string, type: 'success' | 'error' = 'success') {
      // Simple toast implementation
      const toast = document.createElement('div')
      toast.className = `fixed top-4 right-4 px-4 py-2 rounded text-white z-50 ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
      }`
      toast.textContent = message
      document.body.appendChild(toast)
      setTimeout(() => {
        document.body.removeChild(toast)
      }, 3000)
    },
    loadReminders() {
      const raw = localStorage.getItem('reminders')
      if (raw) {
        try {
          this.reminders = JSON.parse(raw)
        } catch {}
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
