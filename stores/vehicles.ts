import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useApi } from '../app/composables/useApi'
import { getVehiclesMock, type MockVehicle } from '../app/mock-data/vehicles'

// Store to manage vehicles list and filters
export const useVehiclesStore = defineStore('vehicles', () => {
  // State
  const loading = ref(false)
  const vehicles = ref<MockVehicle[]>([])
  const priceMax = ref<number>(2000000)
  const vehicleTypes = ref<string[]>(['Minicar', 'A-SUV', 'B-SUV', 'C-SUV', 'D-SUV'])

  const filters = ref({
    location: '',
    startDate: '',
    endDate: '',
    startTime: '10:00',
    endTime: '10:00',
    type: '',
    maxPrice: 2000000
  })

  // API client
  const { get } = useApi()

  // Getters
  const displayVehicles = computed(() => {
    let result = vehicles.value
    // Always show only available vehicles
    result = result.filter(v => v.status === 'available')

    if (filters.value.location) {
      result = result.filter(v => v.location === filters.value.location)
    }
    if (filters.value.type) {
      result = result.filter(v => v.type === filters.value.type)
    }
    if (filters.value.maxPrice != null) {
      result = result.filter(v => v.price <= filters.value.maxPrice)
    }
    return result
  })

  // Actions
  async function fetchVehicles() {
    loading.value = true
    try {
      const params = new URLSearchParams()
      if (filters.value.location) params.set('location', filters.value.location)
      if (filters.value.type) params.set('type', filters.value.type)
      if (filters.value.maxPrice != null) params.set('maxPrice', String(filters.value.maxPrice))
      if (filters.value.startDate) params.set('startDate', filters.value.startDate)
      if (filters.value.endDate) params.set('endDate', filters.value.endDate)

      // Try real API
      const res = await get<MockVehicle[]>(`/api/vehicles?${params.toString()}`)
      if (res && Array.isArray((res as any).data)) {
        const data = (res as any).data as MockVehicle[]
        vehicles.value = data
        if (data.length) {
          priceMax.value = Math.max(...data.map(v => v.price))
          if (filters.value.maxPrice > priceMax.value) filters.value.maxPrice = priceMax.value
        }
        return
      }
    } catch (e) {
      // ignore and fallback to mock
    } finally {
      loading.value = false
    }

    // Fallback to mock
    loading.value = true
    try {
      const data = await getVehiclesMock()
      vehicles.value = data
      if (data.length) {
        priceMax.value = Math.max(...data.map(v => v.price))
        if (filters.value.maxPrice > priceMax.value) filters.value.maxPrice = priceMax.value
      }
    } finally {
      loading.value = false
    }
  }

  function applyFilters() {
    // Trigger refetch with current filters
    return fetchVehicles()
  }

  return {
    // State
    loading,
    vehicles,
    filters,
    priceMax,
    vehicleTypes,

    // Getters
    displayVehicles,

    // Actions
    fetchVehicles,
    applyFilters
  }
})


