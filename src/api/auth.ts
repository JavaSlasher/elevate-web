import { apiClient } from '../shared/config/apiClientConfig.ts'
import type { LoginRequest, LoginResponse } from '../types/auth.ts'

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const { data } = await apiClient.post('/auth/login', payload)
  return data
}
