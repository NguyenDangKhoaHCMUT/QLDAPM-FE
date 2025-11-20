import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApi } from '../app/composables/useApi'
import { toast } from 'vue3-toastify'
import type { RevenueSummary, RevenueTransactionsResponse } from '../app/types/company/revenue'
import {
  fetchRevenueSummaryMock,
  fetchRevenueTransactionsMock,
  exportRevenueTransactionsCsvMock
} from '../app/mock-data/revenue'

function getCookieValue(name: string): string | null {
  if (typeof document === 'undefined') return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null
  }
  return null
}

// Temporary flag: switch to false when backend APIs are ready
const USE_REVENUE_MOCK = false // TODO: switch to false when backend APIs are ready

export const useRevenueStore = defineStore('revenue', () => {
  const useMock = USE_REVENUE_MOCK
  const isLoading = ref<boolean>(false)
  const lastError = ref<string | null>(null)
  const summary = ref<RevenueSummary | null>(null)
  const transactions = ref<RevenueTransactionsResponse | null>(null)

  const { get, error } = useApi()

  /**
   * Fetch revenue summary for a date range
   */
  async function fetchSummary(startDate: string, endDate: string) {
    isLoading.value = true
    lastError.value = null
    try {
      if (useMock) {
        const data = await fetchRevenueSummaryMock(startDate, endDate)
        summary.value = data
        return data
      }

      const params = new URLSearchParams({
        startDate,
        endDate
      })
      const res = await get<RevenueSummary>(`/api/reports/revenue/summary?${params.toString()}`)
      
      if (res && res.data) {
        summary.value = res.data
        return res.data
      } else {
        const msg = res?.message || 'Fetch revenue summary failed'
        lastError.value = msg
        throw new Error(msg)
      }
    } catch (e: any) {
      const errorMsg = error.value || e?.message || 'Fetch revenue summary failed'
      lastError.value = errorMsg
      toast.error(`Lỗi khi tải báo cáo tổng quan: ${errorMsg}`)
      throw e
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetch revenue transactions for a date range with pagination
   */
  async function fetchTransactions(
    startDate: string,
    endDate: string,
    page: number = 1,
    size: number = 10,
    sort: string = 'date_desc'
  ) {
    isLoading.value = true
    lastError.value = null
    try {
      if (useMock) {
        const data = await fetchRevenueTransactionsMock({
          startDate,
          endDate,
          page,
          size,
          sort
        })
        transactions.value = data
        return data
      }

      const params = new URLSearchParams({
        startDate,
        endDate,
        page: page.toString(),
        size: size.toString(),
        sort
      })
      const res = await get<RevenueTransactionsResponse>(`/api/reports/revenue/transactions?${params.toString()}`)
      
      if (res && res.data) {
        transactions.value = res.data
        return res.data
      } else {
        const msg = res?.message || 'Fetch revenue transactions failed'
        lastError.value = msg
        throw new Error(msg)
      }
    } catch (e: any) {
      const errorMsg = error.value || e?.message || 'Fetch revenue transactions failed'
      lastError.value = errorMsg
      toast.error(`Lỗi khi tải danh sách giao dịch: ${errorMsg}`)
      throw e
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Export transactions to CSV
   */
  async function exportToCSV(startDate: string, endDate: string) {
    isLoading.value = true
    lastError.value = null
    try {
      if (useMock) {
        await exportRevenueTransactionsCsvMock(startDate, endDate)
        toast.success('Xuất file CSV thành công!')
        return true
      }

      const params = new URLSearchParams({
        startDate,
        endDate
      })

      const token = getCookieValue('ev_access_token')
      const API_BASE_URL = 'https://ec2-15-134-124-141.ap-southeast-2.compute.amazonaws.com'
      
      const response = await fetch(`${API_BASE_URL}/api/reports/revenue/transactions/export?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      // Get filename from Content-Disposition header or use default
      const contentDisposition = response.headers.get('Content-Disposition')
      let filename = 'revenue-report.csv'
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i)
        if (filenameMatch) {
          filename = filenameMatch[1]
        }
      }

      const data = await response.arrayBuffer()
      const bom = new Uint8Array([0xef, 0xbb, 0xbf])
      const csvArray = new Uint8Array(bom.length + data.byteLength)
      csvArray.set(bom, 0)
      csvArray.set(new Uint8Array(data), bom.length)

      // Download the file
      const blob = new Blob([csvArray], { type: 'text/csv;charset=utf-8;' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success('Xuất file CSV thành công!')
      return true
    } catch (e: any) {
      const errorMsg = e?.message || 'Export CSV failed'
      lastError.value = errorMsg
      toast.error(`Lỗi khi xuất file CSV: ${errorMsg}`)
      throw e
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    lastError,
    summary,
    transactions,
    fetchSummary,
    fetchTransactions,
    exportToCSV
  }
})

