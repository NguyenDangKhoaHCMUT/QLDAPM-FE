// Revenue Report Types

export interface RevenueSummary {
  startDate: string
  endDate: string
  totalRevenue: number // Tổng tiền khách trả (VND)
  totalCommission: number // Phí sàn (VND)
  totalOwnerReceived: number // Thực nhận (Total - Commission)
  totalBookings: number // Số lượng booking hoàn thành
}

export interface RevenueTransaction {
  transactionId: number
  bookingId: number
  vehicleName: string
  customerName: string
  completedAt: string // ISO date string
  totalAmount: number
  commissionFee: number
  ownerAmount: number
  paymentMethod: string
}

export interface RevenueTransactionsResponse {
  items: RevenueTransaction[]
  page: number
  size: number
  totalItems: number
  totalPages: number
}

export type DateFilterType = 'today' | 'last7days' | 'thisMonth' | 'custom'
