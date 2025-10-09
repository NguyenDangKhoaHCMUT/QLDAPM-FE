// Utility để khởi tạo dữ liệu xe mẫu
export function initSampleVehicles() {
  const existingVehicles = localStorage.getItem('company_vehicles')
  
  if (!existingVehicles || JSON.parse(existingVehicles).length === 0) {
    const sampleVehicles = [
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
        status: 'unavailable',
        description: 'Xe điện VinFast VF5 tiết kiệm và thân thiện môi trường'
      },
      {
        id: 3,
        name: 'BMW iX3',
        type: 'Ô tô điện',
        licensePlate: '29C-11111',
        image: 'https://via.placeholder.com/400x300/6c757d/white?text=BMW+iX3',
        pricePerHour: 600000,
        status: 'available',
        description: 'Xe điện BMW iX3 sang trọng và hiện đại'
      }
    ]
    
    localStorage.setItem('company_vehicles', JSON.stringify(sampleVehicles))
    console.log('Đã khởi tạo dữ liệu xe mẫu')
  }
}