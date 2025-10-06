<script setup lang="ts">
const store = useStore()
function toggle() {
  store.setToggleTheme(store.toggleTheme === 'dark' ? 'light' : 'dark')
}
</script>

<template>
  <button
    @click="toggle"
    class="relative p-2.5 rounded-xl bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300 shadow-md hover:shadow-lg overflow-hidden group"
  >
    <div class="relative z-10">
      <Transition name="icon" mode="out-in">
        <span v-if="store.toggleTheme === 'dark'" key="moon" class="block text-xl">🌙</span>
        <span v-else key="sun" class="block text-xl">☀️</span>
      </Transition>
    </div>

    <!-- Animated background -->
    <div class="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
  </button>
</template>

<style scoped>
.icon-enter-active,
.icon-leave-active {
  transition: all 0.3s ease;
}

.icon-enter-from {
  opacity: 0;
  transform: rotate(-90deg) scale(0);
}

.icon-leave-to {
  opacity: 0;
  transform: rotate(90deg) scale(0);
}
</style>
