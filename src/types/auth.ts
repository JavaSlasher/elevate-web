import type { User, UserRole } from '../types/user'

export type AuthState = {
  authenticated: boolean
  user: User | null
  pendingSignupRoles: UserRole[]
  setAuthenticated: (value: boolean) => void
  setUser: (user: User | null) => void
  setPendingSignupRoles: (roles: UserRole[]) => void
  clearPendingSignupRoles: () => void
  logout: () => void
}

export type LoginRequest = {
  username: string
  password: string
}

export type LoginResponse = {
  success: boolean
  message: string
  token: string
}
