export type CreateOwnerRequest = {
  userId?: string
  hasCompany: boolean
  companyName?: string
}

export type CreateOwnerResponse = {
  success: boolean
  message: string
  ownerId: string
}

export type OwnerProfile = {
  id: string
  userId: string
  hasCompany: boolean
  companyName?: string
  firstName: string
  middleName?: string
  lastName: string
  username: string
  phone?: string
  email?: string
  isVerified?: boolean
}
