<script setup lang="ts">
const store = useStore()
function toggle() {
  store.setTheme(store.theme === 'dark' ? 'light' : 'dark')
}
</script>

<template>
  <button class="px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700" @click="toggle">
    <span v-if="store.theme === 'dark'">🌙</span>
    <span v-else>☀️</span>
  </button>
  
</template>

