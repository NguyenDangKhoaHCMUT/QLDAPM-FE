// Mock Auth module
// Note: Comments in English as requested

export interface MockLoginBody {
  email: string
  password: string
}

export interface MockLoginUser {
  email: string
  fullname: string
  phone: string
  role: string
}

export interface MockLoginData {
  accessToken: string
  refreshToken: string
  tokenType: string
  user: MockLoginUser
}

export async function loginMock(body: MockLoginBody): Promise<{ code: number; message: string; data: MockLoginData }>
{
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 300))

  const userMocks = [
    {
      email: 'user@gmail.com',
      password: '12345',
      fullname: 'Mock User',
      phone: '0123456789',
      role: 'USER'
    },
    {
      email: 'company@gmail.com',
      password: '123456789aA',
      fullname: 'Company Admin',
      phone: '0987654321',
      role: 'COMPANY'
    }
  ] as const

  const found = userMocks.find(u => u.email === body.email && u.password === body.password)

  if (found) {
    const tokenSuffix = found.role.toLowerCase()
    const data: MockLoginData = {
      accessToken: `mock-access-token-${tokenSuffix}`,
      refreshToken: `mock-refresh-token-${tokenSuffix}`,
      tokenType: 'Bearer',
      user: {
        email: found.email,
        fullname: found.fullname,
        phone: found.phone,
        role: found.role
      }
    }

    return {
      code: 200,
      message: 'OK',
      data
    }
  }

  // Unauthorized mock response
  const error: any = new Error('Unauthorized')
  error.response = {
    status: 401,
    data: { message: 'Email hoặc mật khẩu không đúng' }
  }
  throw error
}


