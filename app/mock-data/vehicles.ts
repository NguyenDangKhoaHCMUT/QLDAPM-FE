// Vehicles mock module
// Comments in English per request

export interface MockVehicle {
  id: number
  name: string
  type: string
  price: number
  range: number
  seats: number
  batteryCapacity: string
  efficiency: string
  image: string
  status: 'available' | 'unavailable'
  freeCharging: boolean
  location: 'hanoi' | 'hcm' | 'danang' | 'haiphong'
}

const vehicles: MockVehicle[] = [
  {
    id: 1,
    name: 'VinFast VF 3',
    type: 'Minicar',
    price: 590000,
    range: 210,
    seats: 4,
    batteryCapacity: '28.5L',
    efficiency: 'NEDC',
    image: 'https://th.bing.com/th/id/R.b05d74798f6d2bfd9bd039b4c6ef6ce1?rik=i1BVMYNPZ0KHgQ&pid=ImgRaw&r=0',
    status: 'available',
    freeCharging: true,
    location: 'hanoi'
  },
  {
    id: 2,
    name: 'VinFast VF 6 Plus',
    type: 'B-SUV',
    price: 1250000,
    range: 460,
    seats: 5,
    batteryCapacity: '42.3L',
    efficiency: 'NEDC',
    image: 'https://th.bing.com/th/id/R.b05d74798f6d2bfd9bd039b4c6ef6ce1?rik=i1BVMYNPZ0KHgQ&pid=ImgRaw&r=0',
    status: 'available',
    freeCharging: true,
    location: 'hcm'
  },
  {
    id: 3,
    name: 'VinFast VF 6S',
    type: 'B-SUV',
    price: 1100000,
    range: 480,
    seats: 5,
    batteryCapacity: '42.3L',
    efficiency: 'NEDC',
    image: 'https://th.bing.com/th/id/R.b05d74798f6d2bfd9bd039b4c6ef6ce1?rik=i1BVMYNPZ0KHgQ&pid=ImgRaw&r=0',
    status: 'unavailable',
    freeCharging: true,
    location: 'hanoi'
  },
  {
    id: 4,
    name: 'VinFast VF 5',
    type: 'A-SUV',
    price: 950000,
    range: 285,
    seats: 5,
    batteryCapacity: '36.8L',
    efficiency: 'NEDC',
    image: 'https://th.bing.com/th/id/R.b05d74798f6d2bfd9bd039b4c6ef6ce1?rik=i1BVMYNPZ0KHgQ&pid=ImgRaw&r=0',
    status: 'available',
    freeCharging: false,
    location: 'danang'
  },
  {
    id: 5,
    name: 'VinFast VF 7',
    type: 'C-SUV',
    price: 1450000,
    range: 450,
    seats: 7,
    batteryCapacity: '75.3L',
    efficiency: 'EPA',
    image: 'https://th.bing.com/th/id/R.b05d74798f6d2bfd9bd039b4c6ef6ce1?rik=i1BVMYNPZ0KHgQ&pid=ImgRaw&r=0',
    status: 'available',
    freeCharging: true,
    location: 'hcm'
  },
  {
    id: 6,
    name: 'VinFast VF 8',
    type: 'D-SUV',
    price: 1650000,
    range: 420,
    seats: 7,
    batteryCapacity: '82.0L',
    efficiency: 'EPA',
    image: 'https://th.bing.com/th/id/R.b05d74798f6d2bfd9bd039b4c6ef6ce1?rik=i1BVMYNPZ0KHgQ&pid=ImgRaw&r=0',
    status: 'available',
    freeCharging: true,
    location: 'hanoi'
  },
  {
    id: 7,
    name: 'VinFast VF 8',
    type: 'D-SUV',
    price: 1650000,
    range: 420,
    seats: 7,
    batteryCapacity: '82.0L',
    efficiency: 'EPA',
    image: 'https://th.bing.com/th/id/R.b05d74798f6d2bfd9bd039b4c6ef6ce1?rik=i1BVMYNPZ0KHgQ&pid=ImgRaw&r=0',
    status: 'available',
    freeCharging: true,
    location: 'hanoi'
  },
  {
    id: 8,
    name: 'VinFast VF 8',
    type: 'D-SUV',
    price: 1650000,
    range: 420,
    seats: 7,
    batteryCapacity: '82.0L',
    efficiency: 'EPA',
    image: 'https://th.bing.com/th/id/R.b05d74798f6d2bfd9bd039b4c6ef6ce1?rik=i1BVMYNPZ0KHgQ&pid=ImgRaw&r=0',
    status: 'available',
    freeCharging: true,
    location: 'hanoi'
  },
  {
    id: 9,
    name: 'VinFast VF 8',
    type: 'D-SUV',
    price: 1650000,
    range: 420,
    seats: 7,
    batteryCapacity: '82.0L',
    efficiency: 'EPA',
    image: 'https://th.bing.com/th/id/R.b05d74798f6d2bfd9bd039b4c6ef6ce1?rik=i1BVMYNPZ0KHgQ&pid=ImgRaw&r=0',
    status: 'available',
    freeCharging: true,
    location: 'hanoi'
  },
  {
    id: 10,
    name: 'VinFast VF 8',
    type: 'D-SUV',
    price: 1650000,
    range: 420,
    seats: 7,
    batteryCapacity: '82.0L',
    efficiency: 'EPA',
    image: 'https://th.bing.com/th/id/R.b05d74798f6d2bfd9bd039b4c6ef6ce1?rik=i1BVMYNPZ0KHgQ&pid=ImgRaw&r=0',
    status: 'available',
    freeCharging: true,
    location: 'hanoi'
  }
]

export async function getVehiclesMock(): Promise<MockVehicle[]> {
  // Simulate network fetch
  await new Promise(resolve => setTimeout(resolve, 300))
  return vehicles
}


