<template>
  <div class="w-full flex flex-col items-center justify-center py-10" role="status" aria-live="polite">
    <span
      class="inline-block animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"
      :style="{ width: computedSize, height: computedSize }"
    />
    <p v-if="message" class="mt-4 text-sm text-blue-700">{{ message }}</p>
  </div>
  
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: number | string
  message?: string
}

const props = defineProps<Props>()

// Convert numeric sizes to px, pass strings through as-is
const computedSize = computed(() => {
  if (props.size === undefined) return '48px'
  return typeof props.size === 'number' ? `${props.size}px` : props.size
})
</script>

<style scoped>
/* Keep spinner accessible on different backgrounds */
</style>


