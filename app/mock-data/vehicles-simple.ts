// Mock data đơn giản cho vehicles
export interface VehicleSimple {
  id: number
  name: string
  type: string
  licensePlate: string
  image: string
  pricePerHour: number
  status: 'available' | 'unavailable' | 'active' | 'pending' | 'inactive'
  description?: string
}

export const mockVehicles: VehicleSimple[] = [
  {
    id: 1,
    name: 'Tesla Model 3',
    type: 'Ô tô điện',
    licensePlate: '30A-12345',
    image: 'https://via.placeholder.com/400x300/007bff/white?text=Tesla+Model+3',
    pricePerHour: 500000,
    status: 'available',
    description: 'Xe điện cao cấp Tesla Model 3 với công nghệ tự lái'
  },
  {
    id: 2,
    name: 'VinFast VF5',
    type: 'Ô tô điện',
    licensePlate: '51B-67890',
    image: 'https://via.placeholder.com/400x300/28a745/white?text=VinFast+VF5',
    pricePerHour: 400000,
    status: 'pending',
    description: 'Xe điện VinFast VF5 tiết kiệm và thân thiện môi trường'
  },
  {
    id: 3,
    name: 'BMW iX3',
    type: 'Ô tô điện',
    licensePlate: '29C-11111',
    image: 'https://via.placeholder.com/400x300/6c757d/white?text=BMW+iX3',
    pricePerHour: 600000,
    status: 'active',
    description: 'Xe điện BMW iX3 sang trọng và hiện đại'
  },
  {
    id: 4,
    name: 'Honda PCX Electric',
    type: 'Xe máy điện',
    licensePlate: '59F1-23456',
    image: 'https://via.placeholder.com/400x300/dc3545/white?text=Honda+PCX',
    pricePerHour: 150000,
    status: 'unavailable',
    description: 'Xe máy điện Honda PCX tiện lợi cho di chuyển trong thành phố'
  },
  {
    id: 5,
    name: 'Giant Electric Bike',
    type: 'Xe đạp điện',
    licensePlate: 'E-001',
    image: 'https://via.placeholder.com/400x300/ffc107/white?text=Giant+Bike',
    pricePerHour: 50000,
    status: 'inactive',
    description: 'Xe đạp điện Giant phù hợp cho thể thao và giải trí'
  }
]

// Function để tìm xe theo ID
export function findVehicleById(id: number): VehicleSimple | undefined {
  return mockVehicles.find(vehicle => vehicle.id === id)
}

// Function để cập nhật xe (mock)
export function updateVehicle(id: number, data: Partial<Omit<VehicleSimple, 'id'>>): VehicleSimple | null {
  const vehicleIndex = mockVehicles.findIndex(v => v.id === id)
  if (vehicleIndex !== -1 && mockVehicles[vehicleIndex]) {
    Object.assign(mockVehicles[vehicleIndex], data)
    return mockVehicles[vehicleIndex]
  }
  return null
}

// Function để thêm xe mới
export function addVehicle(data: Omit<VehicleSimple, 'id'>): VehicleSimple {
  const newId = Math.max(...mockVehicles.map(v => v.id)) + 1
  const newVehicle: VehicleSimple = { id: newId, ...data }
  mockVehicles.push(newVehicle)
  return newVehicle
}

// Function để xóa xe
export function deleteVehicle(id: number): boolean {
  const vehicleIndex = mockVehicles.findIndex(v => v.id === id)
  if (vehicleIndex !== -1) {
    mockVehicles.splice(vehicleIndex, 1)
    return true
  }
  return false
}