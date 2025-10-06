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

  const validEmail = 'mockdata@gmail.com'
  const validPassword = '12345'

  if (body.email === validEmail && body.password === validPassword) {
    const data: MockLoginData = {
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      tokenType: 'Bearer',
      user: {
        email: validEmail,
        fullname: 'Mock User',
        phone: '0123456789',
        role: 'USER'
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


