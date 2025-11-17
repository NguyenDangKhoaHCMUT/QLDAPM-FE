import { defineStore } from 'pinia'
import { ref, computed, provide } from 'vue'
import { useApi } from '../app/composables/useApi'

// Types for rented vehicles/booking view
interface VehicleSearchResponse {
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
  province: string
  ward: string
  address: string
  typeSortOrder: number
  paused: boolean
}

type RentedBooking = {
  id: string
  bookingCode: string
  vehicle: { id: string; name: string; type: string; price: number; image: string }
  startDateTime: string
  endDateTime: string
  totalHours: number
  totalAmount: number
  paymentMethod?: string
  createdAt: string
  bookingStatus?: string
}

interface ApiVehicle {
  id: number
  name: string
  type: string
  price: number
  range: number
  image: string
  status: 'available' | 'unavailable'
  province: string
  ward: string
  address: string
}

// Store to manage vehicles list and filters
export const useVehiclesStore = defineStore('vehicles', () => {
  // State
  const loading = ref(false)
  const vehicles = ref<ApiVehicle[]>([])
  const priceMax = ref<number>(2000000)
  const vehicleTypes = ref<string[]>(['BIKE', 'SCOOTER', 'CAR'])
  
  // Rented vehicles state (bookings)
  const rentedLoading = ref(false)
  const rentedBookings = ref<RentedBooking[]>([])
  
  // Pagination state
  const currentPage = ref(1)
  const itemsPerPage = ref(10)

  const filters = ref({
    province: '',
    ward: '',
    startDate: '',
    endDate: '',
    startTime: '10:00',
    endTime: '10:00',
    type: '',
    minPrice: 0,
    maxPrice: 2000000
  })

  const sortBy = ref('price_asc')
  const sortOrder = ref('asc')

  // API client
  const { get } = useApi()

  // Getters
  const filteredVehicles = computed(() => {
    let result = vehicles.value
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

  // Helpers
  function padStartWithZeros(value: string | number, targetLength: number): string {
    const str = String(value)
    if (str.length >= targetLength) return str
    const zeros = new Array(targetLength - str.length + 1).join('0')
    return zeros + str
  }

  function diffHours(startIso: string, endIso: string): number {
    const start = new Date(startIso).getTime()
    const end = new Date(endIso).getTime()
    if (isNaN(start) || isNaN(end) || end <= start) return 1
    const hours = Math.ceil((end - start) / (1000 * 60 * 60))
    return Math.max(1, hours)
  }

  // Actions: fetch my vehicles (similar to companyVehicles)
  async function SearchVehicles() {
    loading.value = true
    const params = new URLSearchParams()
    if (filters.value.province) params.append('province', filters.value.province)
    if (filters.value.ward) params.append('district',filters.value.ward) 
    if (filters.value.type) params.append('type', filters.value.type)

    // if (sortBy.value && sortBy.value !== 'default') params.append('sort', sortBy.value)
    if (filters.value.minPrice) params.append('priceMin', String(filters.value.minPrice))
    if (filters.value.maxPrice && filters.value.maxPrice > 0) params.append('priceMax', String(filters.value.maxPrice))
    
    try {
      const res = await get<VehicleSearchResponse[]>(`/vehicles/search?${params.toString()}`)
      const data = Array.isArray(res?.data?.items) ? res.data.items : []
      // Transform API data to match ApiVehicle interface
      const transformedData = data.map(v => ({
        id: v.id,
        name: v.name,
        type: v.type,
        price: v.pricePerHour || 0,
        image: v.imageUrl || '',
        status: (v.status === 'AVAILABLE' ? 'available' : 'unavailable') as 'available' | 'unavailable',
        province: v.province || '',
        ward: v.ward || '',
        address: v.address || ''
        
      }))
      vehicles.value = transformedData
      if (transformedData.length) {
        priceMax.value = Math.max(...transformedData.map(v => v.price))
        if (filters.value.maxPrice > priceMax.value) filters.value.maxPrice = priceMax.value
      }
    } catch (e: any) {
      console.error('Failed to fetch my vehicles:', e)
    } finally {
      loading.value = false
    }
  }

  // Actions: rented vehicles
  async function fetchRentedVehicles() {
    rentedLoading.value = true
    try {
      const res = await get<any>('/vehicles/rented')
      // API may return either an array directly or an object with { data: [...] }
      const payload = res?.data as any
      const items: any[] = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
          ? payload.data
          : []

      rentedBookings.value = items.map((item: any) => {
        const vehicle = item?.vehicle ?? item
        const start = item?.startTime ?? vehicle?.createdAt
        const end = item?.endTime ?? vehicle?.updatedAt ?? vehicle?.createdAt
        const hours = diffHours(String(start), String(end))
        const pricePerHour = Number(vehicle?.pricePerHour || 0)
        const amount = Math.round(pricePerHour * hours)

        const idSource = item?.bookingId ?? vehicle?.id
        return {
          id: String(idSource),
          bookingCode: `EV${padStartWithZeros(idSource, 3)}`,
          vehicle: {
            id: String(vehicle?.id ?? ''),
            name: vehicle?.name || 'Xe',
            type: vehicle?.type || '',
            price: pricePerHour,
            image: vehicle?.imageUrl || ''
          },
          startDateTime: String(start),
          endDateTime: String(end),
          totalHours: hours,
          totalAmount: amount,
          paymentMethod: undefined,
          createdAt: String(vehicle?.createdAt || start),
          bookingStatus: String(item?.bookingStatus || '')
        }
      })
    } catch (err) {
      // Silent fail; UI will show empty state
      console.error('Failed to load rented vehicles', err)
      rentedBookings.value = []
    }
    rentedLoading.value = false
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

  // Find vehicle by ID
  function findVehicleById(id: number) {
    return vehicles.value.find(v => v.id === id) || null
  }

  return {
    // State
    loading,
    vehicles,
    filters,
    priceMax,
    vehicleTypes,
    rentedLoading,
    rentedBookings,
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
    SearchVehicles,
    fetchRentedVehicles,
    setSort,
    nextPage,
    previousPage,
    goToPage,
    findVehicleById
  }
})
