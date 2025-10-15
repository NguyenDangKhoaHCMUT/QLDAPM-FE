<template>
  <transition name="fade">
    <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/40" @click="onCancel" />
      <div class="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div class="px-6 py-5 border-b">
          <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
        </div>
        <div class="px-6 py-4">
          <p class="text-gray-700">{{ message }}</p>
        </div>
        <div class="px-6 py-4 flex justify-end gap-3 border-t">
          <button type="button" class="px-4 py-2 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200" @click="onCancel">{{ cancelText }}</button>
          <button type="button" class="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700" @click="onConfirm">{{ confirmText }}</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
interface Props {
  open: boolean
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Xác nhận',
  message: 'Bạn có chắc chắn muốn thực hiện thao tác này?',
  confirmText: 'Xác nhận',
  cancelText: 'Hủy'
})

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

function onConfirm() {
  emit('confirm')
}

function onCancel() {
  emit('cancel')
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>


