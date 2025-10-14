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
  
  // Pagination state
  const currentPage = ref(1)
  const itemsPerPage = ref(10)

  const filters = ref({
    location: '',
    startDate: '',
    endDate: '',
    startTime: '10:00',
    endTime: '10:00',
    type: '',
    minPrice: 0,
    maxPrice: 2000000
  })

  const sortBy = ref('price')
  const sortOrder = ref('asc')

  // API client
  const { get } = useApi()

  // Getters
  const filteredVehicles = computed(() => {
    let result = vehicles.value
    // Always show only available vehicles
    result = result.filter(v => v.status === 'available')

    if (filters.value.location) {
      result = result.filter(v => v.location === filters.value.location)
    }
    if (filters.value.type) {
      result = result.filter(v => v.type === filters.value.type)
    }
    if (filters.value.minPrice > 0) {
      result = result.filter(v => v.price >= filters.value.minPrice)
    }
    if (filters.value.maxPrice > 0) {
      result = result.filter(v => v.price <= filters.value.maxPrice)
    }

    // Apply sorting
    result = [...result].sort((a, b) => {
      let aValue, bValue
      
      switch (sortBy.value) {
        case 'price':
          aValue = a.price
          bValue = b.price
          break
        case 'name':
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case 'range':
          aValue = a.range
          bValue = b.range
          break
        case 'seats':
          aValue = a.seats
          bValue = b.seats
          break
        default:
          aValue = a.price
          bValue = b.price
      }

      if (sortOrder.value === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0
      }
    })

    return result
  })

  // Paginated vehicles for current page
  const displayVehicles = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredVehicles.value.slice(start, end)
  })

  // Pagination info
  const totalPages = computed(() => Math.ceil(filteredVehicles.value.length / itemsPerPage.value))
  const totalVehicles = computed(() => filteredVehicles.value.length)
  const hasNextPage = computed(() => currentPage.value < totalPages.value)
  const hasPreviousPage = computed(() => currentPage.value > 1)

  // Actions
  async function fetchVehicles() {
    loading.value = true
    try {
      const params = new URLSearchParams()
      if (filters.value.location) params.set('location', filters.value.location)
      if (filters.value.type) params.set('type', filters.value.type)
      if (filters.value.minPrice > 0) params.set('minPrice', String(filters.value.minPrice))
      if (filters.value.maxPrice > 0) params.set('maxPrice', String(filters.value.maxPrice))
      if (filters.value.startDate) params.set('startDate', filters.value.startDate)
      if (filters.value.endDate) params.set('endDate', filters.value.endDate)

      // Try real API
      const res = await get<any>(`/vehicles/search?${params.toString()}`)
      if (res && res.data && Array.isArray(res.data)) {
        const data = res.data as any[]
        // Transform API response to match our interface
        const transformedData = data.map(item => ({
          id: item.id,
          name: item.name,
          type: item.type,
          price: item.pricePerHour,
          image: item.imageUrl,
          range: 200, // Default value since API doesn't provide
          efficiency: 'Good', // Default value
          seats: item.type === 'MOTORBIKE' ? 2 : 4, // Default based on type
          batteryCapacity: '50kWh', // Default value
          freeCharging: false, // Default value
          status: (item.status === 'AVAILABLE' ? 'available' : 'unavailable') as 'available' | 'unavailable',
          location: 'hanoi' as 'hanoi' | 'hcm' | 'danang' | 'haiphong' // Default location
        }))
        
        vehicles.value = transformedData
        if (transformedData.length) {
          priceMax.value = Math.max(...transformedData.map(v => v.price))
          if (filters.value.maxPrice > priceMax.value) filters.value.maxPrice = priceMax.value
        }
        return
      }
    } catch (e) {
      console.log('API failed, using mock data:', e)
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
    // Reset to first page when applying new filters
    currentPage.value = 1
    // Trigger refetch with current filters
    return fetchVehicles()
  }

  function setSort(sort: string, order: string) {
    sortBy.value = sort
    sortOrder.value = order
    // Reset to first page when changing sort
    currentPage.value = 1
  }

  // Pagination actions
  function nextPage() {
    if (hasNextPage.value) {
      currentPage.value++
    }
  }

  function previousPage() {
    if (hasPreviousPage.value) {
      currentPage.value--
    }
  }

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  return {
    // State
    loading,
    vehicles,
    filters,
    priceMax,
    vehicleTypes,
    currentPage,
    itemsPerPage,
    sortBy,
    sortOrder,

    // Getters
    filteredVehicles,
    displayVehicles,
    totalPages,
    totalVehicles,
    hasNextPage,
    hasPreviousPage,

    // Actions
    fetchVehicles,
    applyFilters,
    setSort,
    nextPage,
    previousPage,
    goToPage
  }
})


