export interface Vehicle {
  id: number
  name: string
  type: string
  licensePlate: string
  image: string
  pricePerHour: number
  status: 'available' | 'unavailable' | 'active' | 'pending' | 'inactive'
  description?: string
  createdAt: string
  updatedAt?: string
}

export const defaultVehicles: Vehicle[] = [
  {
    id: 1,
    name: 'Tesla Model 3',
    type: 'Ô tô điện',
    licensePlate: '30A-12345',
    pricePerHour: 100000,
    status: 'active',
    image: 'https://via.placeholder.com/400x300/green/white?text=Tesla+Model+3',
    description: 'Xe điện cao cấp, tiết kiệm năng lượng',
    createdAt: new Date('2024-01-15').toISOString()
  },
  {
    id: 2,
    name: 'VinFast VF5',
    type: 'Ô tô điện',
    licensePlate: '51B-67890',
    pricePerHour: 80000,
    status: 'pending',
    image: 'https://via.placeholder.com/400x300/blue/white?text=VinFast+VF5',
    description: 'SUV điện compact, phù hợp gia đình',
    createdAt: new Date('2024-02-01').toISOString()
  },
  {
    id: 3,
    name: 'BMW iX3',
    type: 'Ô tô điện',
    licensePlate: '29C-11111',
    pricePerHour: 150000,
    status: 'inactive',
    image: 'https://via.placeholder.com/400x300/gray/white?text=BMW+iX3',
    description: 'SUV điện hạng sang với công nghệ tiên tiến',
    createdAt: new Date('2024-01-20').toISOString()
  }
]

export function useCompanyVehicles() {
  const vehicles = ref<Vehicle[]>([])

  // Load vehicles from localStorage or use defaults
  function loadVehicles() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('company_vehicles')
      if (stored) {
        try {
          vehicles.value = JSON.parse(stored)
        } catch (e) {
          console.error('Error parsing stored vehicles:', e)
          vehicles.value = [...defaultVehicles]
          saveVehicles()
        }
      } else {
        vehicles.value = [...defaultVehicles]
        saveVehicles()
      }
    }
  }

  // Save vehicles to localStorage
  function saveVehicles() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('company_vehicles', JSON.stringify(vehicles.value))
    }
  }

  // Add new vehicle
  function addVehicle(vehicleData: Omit<Vehicle, 'id' | 'createdAt'>) {
    const newVehicle: Vehicle = {
      ...vehicleData,
      id: Date.now(),
      createdAt: new Date().toISOString()
    }
    
    vehicles.value.unshift(newVehicle)
    saveVehicles()
    return newVehicle
  }

  // Update vehicle
  function updateVehicle(id: number, updates: Partial<Omit<Vehicle, 'id' | 'createdAt'>>) {
    const index = vehicles.value.findIndex(v => v.id === id)
    if (index !== -1) {
      const currentVehicle = vehicles.value[index]
      if (currentVehicle) {
        // Create a complete vehicle object with all required fields
        const updatedVehicle: Vehicle = {
          id: currentVehicle.id,
          name: updates.name ?? currentVehicle.name,
          type: updates.type ?? currentVehicle.type,
          licensePlate: updates.licensePlate ?? currentVehicle.licensePlate,
          image: updates.image ?? currentVehicle.image,
          pricePerHour: updates.pricePerHour ?? currentVehicle.pricePerHour,
          status: updates.status ?? currentVehicle.status,
          description: updates.description ?? currentVehicle.description,
          createdAt: currentVehicle.createdAt,
          updatedAt: new Date().toISOString()
        }
        
        vehicles.value[index] = updatedVehicle
        saveVehicles()
        return updatedVehicle
      }
    }
    return null
  }

  // Delete vehicle
  function deleteVehicle(id: number) {
    const index = vehicles.value.findIndex(v => v.id === id)
    if (index !== -1) {
      const deleted = vehicles.value.splice(index, 1)[0]
      saveVehicles()
      return deleted
    }
    return null
  }

  // Get vehicle by id
  function getVehicleById(id: number) {
    return vehicles.value.find(v => v.id === id)
  }

  // Get vehicles with filters
  function getFilteredVehicles(filters: {
    search?: string
    status?: string
    type?: string
  } = {}) {
    return computed(() => {
      let filtered = vehicles.value

      if (filters.search) {
        const search = filters.search.toLowerCase()
        filtered = filtered.filter(vehicle => 
          vehicle.name.toLowerCase().includes(search) ||
          vehicle.licensePlate.toLowerCase().includes(search) ||
          vehicle.type.toLowerCase().includes(search)
        )
      }

      if (filters.status) {
        filtered = filtered.filter(vehicle => vehicle.status === filters.status)
      }

      if (filters.type) {
        filtered = filtered.filter(vehicle => vehicle.type === filters.type)
      }

      return filtered
    })
  }

  return {
    vehicles: readonly(vehicles),
    loadVehicles,
    saveVehicles,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    getVehicleById,
    getFilteredVehicles
  }
}