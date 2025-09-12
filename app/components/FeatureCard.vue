<template>
  <div class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
    <div class="text-3xl mb-4">{{ icon }}</div>
    <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ title }}</h3>
    <p class="text-gray-600 text-sm">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon: string
  title: string
  description: string
}

defineProps<Props>()
</script>

<style scoped>
/* Add any scoped styles here */
</style>
