<template>
  <div :class="[
    'fixed inset-0 bg-gradient-to-br flex items-center justify-center z-50',
    backgroundClasses
  ]">
    <div class="text-center text-white">
      <!-- Animated Spinner -->
      <div class="mb-8">
        <div class="relative">
          <!-- Outer ring -->
          <div :class="[
            'border-4 border-blue-200 border-opacity-30 rounded-full animate-spin',
            sizeClasses
          ]"></div>
          <!-- Inner ring -->
          <div :class="[
            'absolute top-0 left-0 border-4 border-transparent border-t-white rounded-full animate-spin',
            sizeClasses
          ]" style="animation-duration: 1.5s;"></div>
          <!-- Center dot -->
          <div :class="[
            'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full',
            dotSizeClasses
          ]"></div>
        </div>
      </div>
      
      <!-- Loading Text -->
      <div class="space-y-2">
        <h2 class="text-2xl font-bold">{{ title }}</h2>
        <p class="text-blue-100">{{ subtitle }}</p>
        <div v-if="loadingText" class="text-blue-200 text-sm">
          {{ loadingText }}
        </div>
      </div>
      
      <!-- Progress Dots -->
      <div v-if="showDots" class="flex justify-center mt-6 space-x-2">
        <div class="w-2 h-2 bg-white rounded-full animate-bounce"></div>
        <div class="w-2 h-2 bg-white rounded-full animate-bounce" style="animation-delay: 0.1s;"></div>
        <div class="w-2 h-2 bg-white rounded-full animate-bounce" style="animation-delay: 0.2s;"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props
interface Props {
  title?: string
  subtitle?: string
  loadingText?: string
  showDots?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
  background?: 'blue' | 'green' | 'purple' | 'orange'
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Đang tải...',
  subtitle: 'Vui lòng chờ trong giây lát...',
  loadingText: '',
  showDots: true,
  size: 'lg',
  background: 'blue'
})

// Computed properties
const sizeClasses = computed(() => {
  const sizes = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20', 
    lg: 'w-24 h-24',
    xl: 'w-32 h-32'
  }
  return sizes[props.size]
})

const dotSizeClasses = computed(() => {
  const sizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4', 
    xl: 'w-5 h-5'
  }
  return sizes[props.size]
})

const backgroundClasses = computed(() => {
  const backgrounds = {
    blue: 'from-blue-600 to-blue-700',
    green: 'from-green-600 to-green-700',
    purple: 'from-purple-600 to-purple-700',
    orange: 'from-orange-600 to-orange-700'
  }
  return backgrounds[props.background]
})
</script>
