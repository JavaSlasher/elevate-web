import { Capacitor } from '@capacitor/core'

function getApiBaseUrl() {
  const isNative = Capacitor.isNativePlatform()

  // Android emulator
  if (isNative && Capacitor.getPlatform() === 'android') {
    return 'http://192.168.12.124:8080/api'
  }

  // iOS simulator
  if (isNative && Capacitor.getPlatform() === 'ios') {
    return 'http://localhost:8080/api'
  }

  // Web browser uses Vite proxy
  return '/api'
}

export const env = {
  apiBaseUrl: getApiBaseUrl(),
}
