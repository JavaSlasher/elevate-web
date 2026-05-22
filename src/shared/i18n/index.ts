import { en } from './en'

type Messages = typeof en
type MessageValue = string | Record<string, unknown>

const messages: Messages = en

function getValue(obj: Record<string, unknown>, path: string): MessageValue | undefined {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key]
    }
    return undefined
  }, obj) as MessageValue | undefined
}

export function t(
  key: string,
  params?: Record<string, string | number>,
): string {
  const value = getValue(messages as unknown as Record<string, unknown>, key)

  if (typeof value !== 'string') {
    return key
  }

  if (!params) {
    return value
  }

  return value.replace(/\{(\w+)\}/g, (_, token: string) => {
    const replacement = params[token]
    return replacement !== undefined ? String(replacement) : `{${token}}`
  })
}
