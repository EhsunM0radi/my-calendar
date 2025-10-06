import { acceptHMRUpdate, defineStore } from 'pinia'
import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/plugin-notification'

const versionString =
  import.meta.env.MODE === 'development' ? `${import.meta.env.VITE_APP_VERSION}-dev` : import.meta.env.VITE_APP_VERSION

export const useStore = defineStore('main', {
  state: () => ({
    debug: import.meta.env.MODE === 'development',
    version: versionString,
    isInitialized: false,
    name: '',
    // مدیریت سه لایه تم
    theme: 'light' as 'light' | 'dark', // تم اصلی که همه جا استفاده میشه
    toggleTheme: null as 'light' | 'dark' | null, // تم تاگل (سشن - موقت)
    defaultTheme: (localStorage.getItem('defaultTheme') as 'light' | 'dark') || 'light', // تم دیفالت (دائمی)
    selectedDateIso: new Date().toISOString(),
    selectedCalendar: (localStorage.getItem('selectedCalendar') as 'gregorian' | 'jalali' | 'islamic') || 'jalali',
    reminders: [] as Array<{ id: string; title: string; datetimeIso: string; delivered: boolean }>,
    inAppNotifications: [] as Array<{ id: string; title: string; message: string; time: Date; type: 'reminder' | 'missed' }>,
  }),

  actions: {
    initApp() {
      this.isInitialized = true
      // محاسبه تم اصلی بر اساس اولویت
      this.updateMainTheme()
      console.log('app initialized!')
    },

    // محاسبه و اعمال تم اصلی بر اساس اولویت: toggleTheme > defaultTheme
    updateMainTheme() {
      const finalTheme = this.toggleTheme ?? this.defaultTheme
      if (this.theme !== finalTheme) {
        this.theme = finalTheme
        this.applyThemeToDOM(finalTheme)
      }
    },

    // اعمال تم به DOM
    applyThemeToDOM(themeValue: 'light' | 'dark') {
      const root = document.documentElement
      if (themeValue === 'dark') {
        root.classList.add('dark')
        root.style.colorScheme = 'dark'
      } else {
        root.classList.remove('dark')
        root.style.colorScheme = 'light'
      }
    },

    // تنظیم تم تاگل (موقت - سشن)
    setToggleTheme(next: 'light' | 'dark' | null) {
      this.toggleTheme = next
      this.updateMainTheme()
    },

    // تنظیم تم دیفالت (دائمی - localStorage)
    setDefaultTheme(next: 'light' | 'dark') {
      this.defaultTheme = next
      localStorage.setItem('defaultTheme', next)
      this.updateMainTheme()
    },

    // برای سازگاری با کدهای قبلی (deprecated - از setToggleTheme یا setDefaultTheme استفاده کن)
    setTheme(next: 'light' | 'dark') {
      this.setToggleTheme(next)
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

    // نوتیفیکیشن درون‌برنامه‌ای
    showInAppNotification(title: string, message: string, type: 'reminder' | 'missed' = 'reminder') {
      const notification = {
        id: crypto.randomUUID(),
        title,
        message,
        time: new Date(),
        type
      }

      this.inAppNotifications.unshift(notification)

      // محدود کردن به 50 نوتیف آخر
      if (this.inAppNotifications.length > 50) {
        this.inAppNotifications = this.inAppNotifications.slice(0, 50)
      }

      // پخش صدا
      this.playNotificationSound()

      // نمایش نوتیف به صورت Toast
      this.showNotificationToast(notification)
    },

    playNotificationSound() {
      try {
        // ایجاد صدای نوتیفیکیشن با Web Audio API
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.frequency.value = 800
        oscillator.type = 'sine'

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.5)
      } catch (error) {
        console.error('Failed to play notification sound:', error)
      }
    },

    showNotificationToast(notification: { title: string; message: string; type: 'reminder' | 'missed' }) {
      const toast = document.createElement('div')
      const bgColor = notification.type === 'missed'
        ? 'bg-gradient-to-r from-amber-500 to-orange-500'
        : 'bg-gradient-to-r from-blue-500 to-cyan-500'

      toast.className = `fixed top-4 right-4 px-6 py-4 rounded-2xl text-white z-[9999] shadow-2xl backdrop-blur-sm transition-all duration-300 ${bgColor} max-w-sm`

      const icon = notification.type === 'missed' ? '⏰' : '🔔'
      toast.innerHTML = `
        <div dir="rtl" class="flex items-start gap-3">
          <span class="text-3xl">${icon}</span>
          <div class="flex-1">
            <div class="font-bold text-lg mb-1">${notification.title}</div>
            <div class="text-sm opacity-90">${notification.message}</div>
          </div>
        </div>
      `

      document.body.appendChild(toast)

      // Animate in
      setTimeout(() => {
        toast.style.transform = 'translateX(0)'
      }, 10)

      // Animate out and remove
      setTimeout(() => {
        toast.style.opacity = '0'
        toast.style.transform = 'translateX(100%)'
        setTimeout(() => {
          if (document.body.contains(toast)) {
            document.body.removeChild(toast)
          }
        }, 300)
      }, 5000)
    },

    clearInAppNotification(id: string) {
      this.inAppNotifications = this.inAppNotifications.filter(n => n.id !== id)
    },

    clearAllInAppNotifications() {
      this.inAppNotifications = []
    },

    loadReminders() {
      const raw = localStorage.getItem('reminders')
      if (raw) {
        try {
          this.reminders = JSON.parse(raw)

          // پاک کردن یادآورهای ارسال شده که بیش از 3 روز از آنها گذشته
          this.cleanupOldReminders()

          // بررسی یادآورهای گذشته و ارسال نوتیف برای آنها
          this.checkMissedReminders()

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
    cleanupOldReminders() {
      const threeDaysAgo = Date.now() - (3 * 24 * 60 * 60 * 1000) // 3 روز قبل

      const before = this.reminders.length
      this.reminders = this.reminders.filter(reminder => {
        // فقط یادآورهای ارسال شده که بیش از 3 روز از آنها گذشته را حذف کن
        if (reminder.delivered) {
          const reminderTime = new Date(reminder.datetimeIso).getTime()
          return reminderTime > threeDaysAgo
        }
        return true // یادآورهای ارسال نشده را نگه دار
      })

      if (before !== this.reminders.length) {
        localStorage.setItem('reminders', JSON.stringify(this.reminders))
        console.log(`پاکسازی: ${before - this.reminders.length} یادآور قدیمی حذف شد`)
      }
    },
    async checkMissedReminders() {
      const now = Date.now()
      const missedReminders = this.reminders.filter(reminder => {
        if (!reminder.delivered) {
          const reminderTime = new Date(reminder.datetimeIso).getTime()
          return reminderTime < now // زمان یادآور گذشته است
        }
        return false
      })

      if (missedReminders.length > 0) {
        console.log(`${missedReminders.length} یادآور از دست رفته یافت شد`)

        for (const reminder of missedReminders) {
          await this.sendMissedNotification(reminder)
        }
      }
    },
    async sendMissedNotification(reminder: { id: string; title: string; datetimeIso: string; delivered: boolean }) {
      try {
        const reminderTime = new Date(reminder.datetimeIso).getTime()
        const now = Date.now()
        const diffMs = now - reminderTime

        // محاسبه زمان گذشته
        const hours = Math.floor(diffMs / (1000 * 60 * 60))
        const days = Math.floor(hours / 24)

        let timeAgoText = ''
        if (days > 0) {
          timeAgoText = `${days} روز پیش`
        } else if (hours > 0) {
          timeAgoText = `${hours} ساعت پیش`
        } else {
          const minutes = Math.floor(diffMs / (1000 * 60))
          timeAgoText = `${minutes} دقیقه پیش`
        }

        const notificationBody = `⏰ ${timeAgoText}\n${reminder.title}`

        // نوتیف درون‌برنامه‌ای
        this.showInAppNotification(
          'یادآور از دست رفته',
          `${timeAgoText}: ${reminder.title}`,
          'missed'
        )

        const isDev = import.meta.env.MODE === 'development'

        // ارسال نوتیف سیستمی (اختیاری)
        if (isDev || !window.__TAURI__) {
          // Browser Notification
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('🔔 یادآور از دست رفته - تقویم من', {
              body: notificationBody,
              icon: '/logo.png',
              badge: '/logo.png',
              tag: reminder.id,
              requireInteraction: true,
              silent: false
            })
          }
        } else {
          // Tauri Notification
          const permissionGranted = await isPermissionGranted()
          if (permissionGranted) {
            await sendNotification({
              title: '🔔 یادآور از دست رفته - تقویم من',
              body: notificationBody,
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
        console.error('Failed to send missed notification:', error)
      }
    },
    async startReminderTimer(reminder: { id: string; title: string; datetimeIso: string; delivered: boolean }) {
      const reminderTime = new Date(reminder.datetimeIso).getTime()
      const now = Date.now()
      const delay = reminderTime - now

      if (delay > 0) {
        setTimeout(async () => {
          try {
            // نوتیف درون‌برنامه‌ای
            this.showInAppNotification(
              'یادآور',
              reminder.title,
              'reminder'
            )

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

    // دریافت تعداد نوتیف‌های خوانده نشده
    unreadNotificationsCount: (state) => {
      return state.inAppNotifications.length
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStore, import.meta.hot))
}
