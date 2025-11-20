export interface BankOption {
  code: string
  name: string
  shortName?: string
}

export const VN_BANKS: BankOption[] = [
  { code: 'VCB', name: 'Vietcombank', shortName: 'Vietcombank' },
  { code: 'TCB', name: 'Techcombank', shortName: 'Techcombank' },
  { code: 'ACB', name: 'Asia Commercial Bank', shortName: 'ACB' },
  { code: 'BIDV', name: 'BIDV - Ngân hàng Đầu tư và Phát triển', shortName: 'BIDV' },
  { code: 'MB', name: 'MB Bank', shortName: 'MB Bank' },
  { code: 'VPB', name: 'VPBank - Ngân hàng Việt Nam Thịnh Vượng', shortName: 'VPBank' },
  { code: 'STB', name: 'Sacombank', shortName: 'Sacombank' },
  { code: 'HDB', name: 'HDBank', shortName: 'HDBank' },
  { code: 'OCB', name: 'OCB - Phương Đông', shortName: 'OCB' },
  { code: 'VIB', name: 'VIB - Quốc Tế', shortName: 'VIB' },
  { code: 'SHB', name: 'SHB - Sài Gòn Hà Nội', shortName: 'SHB' },
  { code: 'EIB', name: 'Eximbank', shortName: 'Eximbank' },
  { code: 'SCB', name: 'SCB - Sài Gòn', shortName: 'SCB' },
  { code: 'ABB', name: 'ABBANK', shortName: 'ABBANK' },
  { code: 'PGB', name: 'PGBank', shortName: 'PGBank' },
  { code: 'TPB', name: 'TPBank', shortName: 'TPBank' },
  { code: 'LPB', name: 'LienVietPostBank', shortName: 'LienVietPostBank' },
  { code: 'KLB', name: 'KienLongBank', shortName: 'KienLongBank' },
  { code: 'VBA', name: 'VietinBank', shortName: 'VietinBank' },
  { code: 'SEA', name: 'SeABank', shortName: 'SeABank' }
]

export function findBankByCode(code: string): BankOption | undefined {
  return VN_BANKS.find(bank => bank.code === code)
}

