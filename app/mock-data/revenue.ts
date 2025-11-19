import type {
  RevenueSummary,
  RevenueTransaction,
  RevenueTransactionsResponse
} from '../types/company/revenue'
import { revenueTransactionsData } from './revenue-data'

interface MockFilterParams {
  startDate: string
  endDate: string
  page?: number
  size?: number
  sort?: string
}

const mockTransactions: RevenueTransaction[] = revenueTransactionsData

function toDate(value: string) { 
  const date = new Date(value)
  date.setSeconds(0, 0)
  return date
}

function normalizeRange(start: string, end: string) {
  const startDate = new Date(`${start}T00:00:00`)
  const endDate = new Date(`${end}T23:59:59`)
  return { startDate, endDate }
}

function filterTransactions({ startDate, endDate }: MockFilterParams) {
  const { startDate: start, endDate: end } = normalizeRange(startDate, endDate)
  return mockTransactions.filter(transaction => {
    const completedAt = toDate(transaction.completedAt)
    return completedAt >= start && completedAt <= end
  })
}

function sortTransactions(transactions: RevenueTransaction[], sort?: string) {
  const sorted = [...transactions]
  switch (sort) {
    case 'date_asc':
      sorted.sort((a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime())
      break
    case 'amount_desc':
      sorted.sort((a, b) => b.totalAmount - a.totalAmount)
      break
    case 'amount_asc':
      sorted.sort((a, b) => a.totalAmount - b.totalAmount)
      break
    case 'date_desc':
    default:
      sorted.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
      break
  }
  return sorted
}

function paginateTransactions(
  transactions: RevenueTransaction[],
  page: number = 1,
  size: number = 10
): RevenueTransactionsResponse {
  const startIndex = (page - 1) * size
  const pagedItems = transactions.slice(startIndex, startIndex + size)
  return {
    items: pagedItems,
    page,
    size,
    totalItems: transactions.length,
    totalPages: Math.max(1, Math.ceil(transactions.length / size))
  }
}

function computeSummary(transactions: RevenueTransaction[], startDate: string, endDate: string): RevenueSummary {
  const totalRevenue = transactions.reduce((sum, item) => sum + item.totalAmount, 0)
  const totalCommission = transactions.reduce((sum, item) => sum + item.commissionFee, 0)
  const totalOwnerReceived = transactions.reduce((sum, item) => sum + item.ownerAmount, 0)

  return {
    startDate,
    endDate,
    totalRevenue,
    totalCommission,
    totalOwnerReceived,
    totalBookings: transactions.length
  }
}

export async function fetchRevenueSummaryMock(startDate: string, endDate: string): Promise<RevenueSummary> {
  const filtered = filterTransactions({ startDate, endDate })
  const summary = computeSummary(filtered, startDate, endDate)
  await delay()
  return summary
}

export async function fetchRevenueTransactionsMock(
  params: Required<MockFilterParams>
): Promise<RevenueTransactionsResponse> {
  const filtered = filterTransactions(params)
  const sorted = sortTransactions(filtered, params.sort)
  const paged = paginateTransactions(sorted, params.page, params.size)
  await delay()
  return paged
}

export async function exportRevenueTransactionsCsvMock(startDate: string, endDate: string, sort?: string) {
  const filtered = filterTransactions({ startDate, endDate })
  const sorted = sortTransactions(filtered, sort)
  const header = [
    'Transaction ID',
    'Booking ID',
    'Vehicle Name',
    'Customer Name',
    'Completed At',
    'Total Amount',
    'Commission Fee',
    'Owner Amount',
    'Payment Method'
  ]
  const rows = sorted.map(item => [
    item.transactionId,
    item.bookingId,
    escapeCsv(item.vehicleName),
    escapeCsv(item.customerName),
    item.completedAt,
    item.totalAmount,
    item.commissionFee,
    item.ownerAmount,
    item.paymentMethod
  ])
  const csvContent = [header, ...rows]
    .map(row => row.join(','))
    .join('\n')
  const csvWithBom = `\uFEFF${csvContent}`

  await delay()

  if (typeof window === 'undefined') {
    return csvWithBom
  }

  const blob = new Blob([csvWithBom], { type: 'text/csv;charset=utf-8;' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `revenue-report-${startDate}-to-${endDate}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

function escapeCsv(value: string) {
  if (value.includes(',') || value.includes('"')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

function delay(ms: number = 400) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

