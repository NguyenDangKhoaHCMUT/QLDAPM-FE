export interface PaymentData {
  method: string
  amount: number
  transactionId: string
  qrCode?: string
  accountInfo?: {
    bankName: string
    accountNumber: string
    accountName: string
  }
  expiresAt: Date
}

export const mockPaymentMethods = {
  momo: {
    name: 'MoMo',
    logo: '/images/momo-logo.png'
  },
  banking: {
    name: 'Chuyển khoản ngân hàng',
    logo: '/images/bank-logo.png'
  },
  cash: {
    name: 'Thanh toán khi nhận xe',
    logo: '/images/cash-logo.png'
  }
}

export function generatePaymentData(method: string, amount: number): PaymentData {
  const transactionId = generateTransactionId()
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes from now

  switch (method) {
    case 'momo':
      return {
        method,
        amount,
        transactionId,
        qrCode: generateMoMoQR(transactionId, amount),
        expiresAt
      }

    case 'banking':
      return {
        method,
        amount,
        transactionId,
        qrCode: generateBankingQR(transactionId, amount),
        accountInfo: {
          bankName: 'MSB',
          accountNumber: '14001010134225',
          accountName: 'CTY TNHH EV SHARING'
        },
        expiresAt
      }

    case 'cash':
      return {
        method,
        amount,
        transactionId,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      }

    default:
      throw new Error(`Unsupported payment method: ${method}`)
  }
}

function generateTransactionId(): string {
  const prefix = 'EV'
  const timestamp = Date.now().toString().slice(-8)
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}${timestamp}${random}`
}

function generateMoMoQR(transactionId: string, amount: number): string {
  return '/images/momo-qr.png'
}

function generateBankingQR(transactionId: string, amount: number): string {
  return '/images/bank-qr.png'
}
export const mockTransactionHistory = [
  {
    id: 'EV202410011234',
    method: 'momo',
    amount: 450000,
    status: 'success',
    createdAt: new Date('2024-10-01T10:30:00'),
    completedAt: new Date('2024-10-01T10:32:15')
  },
  {
    id: 'EV202410025678',
    method: 'banking',
    amount: 680000,
    status: 'success',
    createdAt: new Date('2024-10-02T14:20:00'),
    completedAt: new Date('2024-10-02T14:25:30')
  }
]
