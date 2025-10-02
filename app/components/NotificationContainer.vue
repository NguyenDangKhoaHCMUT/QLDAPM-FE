<template>
  <div class="fixed top-4 right-4 z-50 space-y-2">
    <TransitionGroup name="notification" tag="div">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="[
          'max-w-sm p-4 rounded-lg shadow-lg border-l-4 flex items-center justify-between',
          getNotificationClasses(notification.type)
        ]"
      >
        <div class="flex items-center">
          <div :class="getIconClasses(notification.type)" class="mr-3">
            {{ getIcon(notification.type) }}
          </div>
          <div class="text-sm font-medium">
            {{ notification.message }}
          </div>
        </div>
        <button
          @click="removeNotification(notification.id)"
          class="ml-4 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          ×
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useNotification } from '../composables/useNotification'

const { notifications, removeNotification } = useNotification()

function getNotificationClasses(type: string) {
  const classes = {
    success: 'bg-green-50 border-green-400 text-green-800',
    error: 'bg-red-50 border-red-400 text-red-800',
    warning: 'bg-yellow-50 border-yellow-400 text-yellow-800',
    info: 'bg-blue-50 border-blue-400 text-blue-800'
  }
  return classes[type as keyof typeof classes] || classes.info
}

function getIconClasses(type: string) {
  const classes = {
    success: 'text-green-400',
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400'
  }
  return classes[type as keyof typeof classes] || classes.info
}

function getIcon(type: string) {
  const icons = {
    success: '✓',
    error: '⚠',
    warning: '⚠',
    info: 'ℹ'
  }
  return icons[type as keyof typeof icons] || icons.info
}
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-move {
  transition: transform 0.3s ease;
}
</style>