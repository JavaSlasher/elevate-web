import type { UtcIsoDateTimeString } from './date'

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BLOCKED'

export type UserRole = 'DRIVER' | 'OWNER' | 'CUSTOMER' | 'ADMIN'

export type User = {
  id: string
  username: string
  firstName: string
  middleName?: string
  lastName: string
  phone?: string
  email?: string
  isVerified?: boolean
  status?: UserStatus
  lastLoginAt?: UtcIsoDateTimeString
  roles?: UserRole[]
}

export type CreateUserRequest = {
  username: string
  password: string
  firstName: string
  middleName?: string
  lastName: string
  phone: string
  email?: string
  roles?: UserRole[]
}

export type CreateUserResponse = {
  success: boolean
  message: string
  userId: string
  isVerified: boolean
  status: UserStatus
}

export type UpsertUserRolesRequest = {
  roles: UserRole[]
}

export type UserRoleSelectionModalProps = {
  open: boolean
  onSubmit: (roles: UserRole[]) => void
  isSubmitting?: boolean
}
