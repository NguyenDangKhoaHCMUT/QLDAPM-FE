import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useApi } from '../app/composables/useApi'
import { toast } from 'vue3-toastify'

interface ApiVehicle {
  createdAt: string
  updatedAt: string
  id: number
  ownerId: string
  ownerEmail: string
  name: string
  type: string
  pricePerHour: number
  imageUrl: string
  status: string
}

export interface UiVehicleItem {
  id: number
  name: string
  image: string
  licensePlate: string
  status: string
  type: string
  pricePerHour: number
}

export const useCompanyVehiclesStore = defineStore('companyVehicles', () => {
  const items = ref<UiVehicleItem[]>([])
  const isLoading = ref<boolean>(false)
  const lastError = ref<string | null>(null)

  const { get, put, error } = useApi()
  const { delete: del } = useApi()

  async function fetchMyVehicles() {
    isLoading.value = true
    lastError.value = null
    try {
      const res = await get<ApiVehicle[]>('/vehicles/my')
      const data = Array.isArray(res?.data) ? res.data : []
      items.value = data.map(v => ({
        id: v.id,
        name: v.name,
        image: v.imageUrl || '',
        licensePlate: '-',
        status: (v.status || '').toLowerCase(),
        type: v.type || '',
        pricePerHour: v.pricePerHour || 0
      }))
    } catch (e: any) {
      lastError.value = error.value || e?.message || 'Fetch vehicles failed'
    } finally {
      isLoading.value = false
    }
  }

  function removeVehicleInScreen(id: number) {
    items.value = items.value.filter(v => v.id !== id)
  }

  function findVehicleInStore(id: number): UiVehicleItem | null {
    return items.value.find(v => v.id === id) || null
  }

  async function deleteVehicle(id: number) {
    try {
      const res = await del(`/vehicles/${id}`)
      const ok = (res as any)?.status === 'success' || (res as any)?.message?.toLowerCase?.().includes('thành công')
      if (ok) {
        removeVehicleInScreen(id)
        toast.success('Xóa xe thành công')
      } else {
        const msg = (res as any)?.message || 'Delete vehicle failed'
        lastError.value = msg
        throw new Error(msg)
      }
    } catch (e: any) {
      lastError.value = error.value || e?.message || 'Delete vehicle failed'
      throw e
    }
  }

  async function updateVehicle(id: number, data: Partial<UiVehicleItem>) {
    try {
      // Format data according to API spec
      const apiData = {
        name: data.name,
        type: data.type,
        pricePerHour: data.pricePerHour,
        imageUrl: data.image
      }
      
      const res = await put(`/vehicles/${id}`, apiData)
      const ok = (res as any)?.status === 'success' || (res as any)?.message?.toLowerCase?.().includes('thành công')
      if (ok) {
        // Refresh the list to get updated data
        await fetchMyVehicles()
        toast.success('Cập nhật xe thành công')
        return true
      } else {
        const msg = (res as any)?.message || 'Update vehicle failed'
        lastError.value = msg
        throw new Error(msg)
      }
    } catch (e: any) {
      lastError.value = error.value || e?.message || 'Update vehicle failed'
      throw e
    }
  }

  async function pauseVehicle(id: number) {
    try {
      const res = await put(`/vehicles/${id}/pause`)
      const ok = (res as any)?.status === 'success' || (res as any)?.message?.toLowerCase?.().includes('thành công')
      if (ok) {
        // Update the vehicle status in the store
        const vehicle = findVehicleInStore(id)
        if (vehicle) {
          vehicle.status = 'paused'
        }
        toast.success('Tạm dừng xe thành công')
        return true
      } else {
        const msg = (res as any)?.message || 'Pause vehicle failed'
        lastError.value = msg
        throw new Error(msg)
      }
    } catch (e: any) {
      lastError.value = error.value || e?.message || 'Pause vehicle failed'
      throw e
    }
  }

  async function resumeVehicle(id: number) {
    try {
      const res = await put(`/vehicles/${id}/resume`)
      const ok = (res as any)?.status === 'success' || (res as any)?.message?.toLowerCase?.().includes('thành công')
      if (ok) {
        // Update the vehicle status in the store
        const vehicle = findVehicleInStore(id)
        if (vehicle) {
          vehicle.status = 'available'
        }
        toast.success('Tiếp tục xe thành công')
        return true
      } else {
        const msg = (res as any)?.message || 'Resume vehicle failed'
        lastError.value = msg
        throw new Error(msg)
      }
    } catch (e: any) {
      lastError.value = error.value || e?.message || 'Resume vehicle failed'
      throw e
    }
  }

  const total = computed(() => items.value.length)

  return {
    items,
    isLoading,
    lastError,
    total,
    fetchMyVehicles,
    removeLocal: removeVehicleInScreen,
    deleteVehicle,
    findVehicleInStore,
    updateVehicle,
    pauseVehicle,
    resumeVehicle
  }
})


