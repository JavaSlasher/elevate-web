import axios from 'axios'
import { t } from '@/shared/i18n'

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const responseMessage = error.response?.data?.message

    if (typeof responseMessage === 'string' && responseMessage.trim().length > 0) {
      return responseMessage
    }

    if (error.message && error.message.trim().length > 0) {
      return error.message
    }
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message
  }

  return t('common.error')
}
