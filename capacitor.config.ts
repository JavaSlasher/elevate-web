import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sulav.booking',
  appName: 'Sulav Booking',
  webDir: 'dist',
  server: {
    androidScheme: 'http'
  }
};

export default config;
