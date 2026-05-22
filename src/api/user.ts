import { apiClient } from '../shared/config/apiClientConfig.ts'
import type {
  CreateUserRequest,
  CreateUserResponse,
  UpsertUserRolesRequest,
  User,
} from '../types/user'

export async function createUser(
    payload: CreateUserRequest,
): Promise<CreateUserResponse> {
  const { data } = await apiClient.post('/users', payload)
  return data
}

export async function getCurrentUser(): Promise<User> {
  const { data } = await apiClient.get('/users/me')
  return data
}

export async function upsertMyRoles(payload: UpsertUserRolesRequest): Promise<User> {
  const { data } = await apiClient.post('/users/me/roles', payload)
  return data
}
